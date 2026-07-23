import { z } from "zod";

const statKeySchema = z.enum([
  "knowledge",
  "communication",
  "discipline",
  "ethics",
  "energy",
  "stress",
  "health",
  "reputation"
]);

const conditionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("stat"), stat: statKeySchema, operator: z.enum([">=", "<=", ">", "<", "=="]), value: z.number() }),
  z.object({ type: z.literal("flag"), flag: z.string().min(1), value: z.boolean() }),
  z.object({ type: z.literal("money"), operator: z.enum([">=", "<=", ">", "<", "=="]), valueCents: z.number().int() }),
  z.object({ type: z.literal("location"), value: z.enum(["home", "school", "library", "work", "public_transport", "street"]) })
]);

const effectSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("stat"), stat: statKeySchema, delta: z.number() }),
  z.object({ type: z.literal("money"), deltaCents: z.number().int() }),
  z.object({ type: z.literal("flag"), flag: z.string().min(1), value: z.boolean() }),
  z.object({ type: z.literal("advance_time"), minutes: z.number().int().nonnegative() }),
  z.object({ type: z.literal("set_location"), location: z.enum(["home", "school", "library", "work", "public_transport", "street"]) })
]);

export const storyNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  ending: z.boolean().optional(),
  choices: z.array(z.object({
    id: z.string().min(1),
    label: z.string().min(1),
    conditions: z.array(conditionSchema),
    effects: z.array(effectSchema),
    nextNodeId: z.string().min(1)
  }))
});
