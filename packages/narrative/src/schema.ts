import { z } from "zod";

const statKeySchema = z.enum(["knowledge", "communication", "discipline", "ethics", "energy", "stress", "health", "reputation"]);
const relationshipDimensionSchema = z.enum(["trust", "affection", "conflict"]);
const comparisonOperatorSchema = z.enum([">=", "<=", ">", "<", "=="]);
const locationSchema = z.enum(["home", "school", "library", "work", "public_transport", "ride_hailing", "shopping_mall", "park", "party", "street"]);
const clockSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), minuteOfDay: z.number().int().min(0).max(1439) });

const conditionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("stat"), stat: statKeySchema, operator: comparisonOperatorSchema, value: z.number() }),
  z.object({ type: z.literal("flag"), flag: z.string().min(1), value: z.boolean() }),
  z.object({ type: z.literal("money"), operator: comparisonOperatorSchema, valueCents: z.number().int() }),
  z.object({ type: z.literal("location"), value: locationSchema }),
  z.object({ type: z.literal("relationship"), relationshipId: z.string().min(1), dimension: relationshipDimensionSchema, operator: comparisonOperatorSchema, value: z.number() })
]);

const immediateEffectSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("stat"), stat: statKeySchema, delta: z.number() }),
  z.object({ type: z.literal("money"), deltaCents: z.number().int() }),
  z.object({ type: z.literal("flag"), flag: z.string().min(1), value: z.boolean() }),
  z.object({ type: z.literal("advance_time"), minutes: z.number().int().nonnegative() }),
  z.object({ type: z.literal("set_clock"), clock: clockSchema }),
  z.object({ type: z.literal("set_location"), location: locationSchema }),
  z.object({ type: z.literal("relationship"), relationshipId: z.string().min(1), dimension: relationshipDimensionSchema, delta: z.number() }),
  z.object({ type: z.literal("promote_person"), relationshipId: z.string().min(1), category: z.enum(["scene", "known", "important"]) })
]);

const scheduleConsequenceSchema = z.object({
  type: z.literal("schedule_consequence"), consequenceId: z.string().min(1), delayMinutes: z.number().int().positive(), title: z.string().min(1), text: z.string().min(1), effects: z.array(immediateEffectSchema)
});
const effectSchema = z.union([immediateEffectSchema, scheduleConsequenceSchema]);
const outcomeTierSchema = z.enum(["critical_failure", "failure", "partial_success", "success", "exceptional_success"]);
const skillOutcomeSchema = z.object({ nextNodeId: z.string().min(1), effects: z.array(immediateEffectSchema) });
const skillCheckSchema = z.object({
  eventId: z.string().min(1), stat: statKeySchema, difficulty: z.number().int().min(0).max(100),
  bonusFlags: z.array(z.object({ flag: z.string().min(1), label: z.string().min(1), value: z.number().int() })),
  outcomes: z.record(outcomeTierSchema, skillOutcomeSchema)
});

export const storyNodeSchema = z.object({
  id: z.string().min(1),
  moduleId: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  activity: z.string().min(1),
  contextPersonId: z.string().min(1).optional(),
  nextCommitment: z.object({ label: z.string().min(1), clock: clockSchema }).optional(),
  ending: z.boolean().optional(),
  choices: z.array(z.object({
    id: z.string().min(1), label: z.string().min(1), conditions: z.array(conditionSchema), effects: z.array(effectSchema), nextNodeId: z.string().min(1), skillCheck: skillCheckSchema.optional()
  }))
});
