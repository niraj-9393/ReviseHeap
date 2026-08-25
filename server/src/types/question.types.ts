import { z } from "zod";

export const createQuestionSchema = z.object({
  name: z.string({ error: "Question name is required" })
    .min(1, { error: "Question name cannot be empty" }),

  url: z.string({ error: "Please provide a valid URL" }),

  platform: z .string({ error: "Platform is required" })
    .min(1, { error: "Platform cannot be empty" }),

  difficulty: z.string().optional(),

  userDifficulty: z.string().optional(),

  remark: z.string().optional(),

  solvedRemark: z.string().optional(),
});
