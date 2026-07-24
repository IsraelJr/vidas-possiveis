import { z } from "zod";

const attributeKeySchema = z.enum([
  "reasoning",
  "perception",
  "communication",
  "selfControl",
  "vigor",
  "agility"
]);
const conditionKeySchema = z.enum(["energy", "stress", "health"]);
const knowledgeKeySchema = z.enum(["mathematics", "portuguese", "physics", "technology"]);
const relationshipDimensionSchema = z.enum(["trust", "closeness", "tension"]);
const personCategorySchema = z.enum(["scene", "known", "important"]);
const personPresenceSchema = z.enum(["active", "distant", "inactive", "unavailable", "deceased"]);
const comparisonOperatorSchema = z.enum([">=", "<=", ">", "<", "=="]);
const locationSchema = z.enum([
  "home",
  "school",
  "library",
  "work",
  "public_transport",
  "street",
  "shopping_mall",
  "park",
  "party"
]);
const clockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  minuteOfDay: z.number().int().min(0).max(1439)
});

const conditionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("attribute"), attribute: attributeKeySchema, operator: comparisonOperatorSchema, value: z.number() }),
  z.object({ type: z.literal("condition"), condition: conditionKeySchema, operator: comparisonOperatorSchema, value: z.number() }),
  z.object({ type: z.literal("knowledge"), knowledge: knowledgeKeySchema, operator: comparisonOperatorSchema, value: z.number() }),
  z.object({ type: z.literal("reputation"), operator: comparisonOperatorSchema, value: z.number() }),
  z.object({ type: z.literal("flag"), flag: z.string().min(1), value: z.boolean() }),
  z.object({ type: z.literal("money"), operator: comparisonOperatorSchema, valueCents: z.number().int() }),
  z.object({ type: z.literal("location"), value: locationSchema }),
  z.object({
    type: z.literal("relationship"),
    personId: z.string().min(1),
    dimension: relationshipDimensionSchema,
    operator: comparisonOperatorSchema,
    value: z.number()
  })
]);

const memorySchema = z.object({
  id: z.string().min(1),
  summary: z.string().min(1),
  kind: z.enum([
    "help",
    "promise",
    "conflict",
    "humiliation",
    "reconciliation",
    "shared_work",
    "shared_leisure",
    "family",
    "academic",
    "romance",
    "other"
  ]),
  intensity: z.number().int().min(0).max(10),
  resolved: z.boolean(),
  tags: z.array(z.string().min(1))
});

const immediateEffectSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("attribute"), attribute: attributeKeySchema, delta: z.number() }),
  z.object({ type: z.literal("condition"), condition: conditionKeySchema, delta: z.number() }),
  z.object({ type: z.literal("knowledge"), knowledge: knowledgeKeySchema, delta: z.number() }),
  z.object({ type: z.literal("reputation"), delta: z.number() }),
  z.object({ type: z.literal("money"), deltaCents: z.number().int() }),
  z.object({ type: z.literal("flag"), flag: z.string().min(1), value: z.boolean() }),
  z.object({ type: z.literal("advance_time"), minutes: z.number().int().nonnegative() }),
  z.object({ type: z.literal("set_clock"), clock: clockSchema }),
  z.object({ type: z.literal("set_location"), location: locationSchema }),
  z.object({
    type: z.literal("relationship"),
    personId: z.string().min(1),
    dimension: relationshipDimensionSchema,
    delta: z.number()
  }),
  z.object({
    type: z.literal("add_memory"),
    personId: z.string().min(1),
    memory: memorySchema
  }),
  z.object({
    type: z.literal("set_person_category"),
    personId: z.string().min(1),
    category: personCategorySchema
  }),
  z.object({
    type: z.literal("set_person_presence"),
    personId: z.string().min(1),
    presence: personPresenceSchema
  })
]);

const scheduleConsequenceSchema = z.object({
  type: z.literal("schedule_consequence"),
  consequenceId: z.string().min(1),
  delayMinutes: z.number().int().positive(),
  title: z.string().min(1),
  text: z.string().min(1),
  effects: z.array(immediateEffectSchema)
});

const effectSchema = z.union([immediateEffectSchema, scheduleConsequenceSchema]);
const outcomeTierSchema = z.enum([
  "critical_failure",
  "failure",
  "partial_success",
  "success",
  "exceptional_success"
]);

const skillOutcomeSchema = z.object({
  nextNodeId: z.string().min(1),
  effects: z.array(immediateEffectSchema)
});

const skillCheckSchema = z.object({
  eventId: z.string().min(1),
  attribute: attributeKeySchema,
  difficulty: z.number().int().min(0).max(100),
  bonusFlags: z.array(z.object({
    flag: z.string().min(1),
    label: z.string().min(1),
    value: z.number().int()
  })),
  outcomes: z.record(outcomeTierSchema, skillOutcomeSchema)
});

export const storyNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  activity: z.string().min(1),
  nextCommitment: z.object({ label: z.string().min(1), clock: clockSchema }).optional(),
  contextPersonIds: z.array(z.string().min(1)).optional(),
  moduleId: z.string().min(1).optional(),
  ending: z.boolean().optional(),
  choices: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    conditions: z.array(conditionSchema),
    effects: z.array(effectSchema),
    nextNodeId: z.string().min(1),
    skillCheck: skillCheckSchema.optional()
  }))
});
