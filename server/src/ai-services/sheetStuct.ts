
import { z } from "zod";

const problemSchema = z.object({
  name: z.string().nullable(),
  url: z.string().nullable(),
  difficulty: z.string().nullable(),
  platform: z.string().nullable(),
  remark: z.string().nullable(),
  validData: z.boolean(),
});

export const sheetStruct = z.object({
  problems: z.array(problemSchema),
});

export const systemPrompt = `
You are an expert DSA problem extraction assistant.

Extract ALL independently identifiable DSA problems from the
provided input.

Rules:
1. Extract every DSA problem, not just the first one.
2. Each problem must be a separate object in the problems array.
3. Preserve the original order.
4. Extract name, URL, difficulty, platform and remark.
5. Do not invent missing information.
6. A problem is valid when its name, URL and difficulty
   are identifiable.
7. If required information is missing, set validData to false.
8. If platform or remark is missing, use null.
9. Do not treat multiple problems as an invalid document.
10. If no DSA problems are found, return an empty problems array.

Return the result using the required structured schema.
`;
