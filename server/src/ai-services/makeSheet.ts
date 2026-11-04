
import {
  HumanMessage,
  initChatModel,
  SystemMessage,
} from "langchain";

import dotenv from "dotenv";
import { sheetStruct, systemPrompt } from "./sheetStuct.js";

dotenv.config();

const isValidUrl = (value: string | null): boolean => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const textTOsheet = async (input: string | object) => {
  try {
    const model = await initChatModel("gpt-5.5");

    const modelWithStruct = model.withStructuredOutput(sheetStruct);

    const inputText =
      typeof input === "string"
        ? input
        : JSON.stringify(input, null, 2);

    const response = await modelWithStruct.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(
        `Extract ALL DSA questions from the following document. Do not extract only the first question.\n\n${inputText}`
      ),
    ]);

    const problems = response.problems.map((problem) => {
      const isValid =
        Boolean(problem.name?.trim()) &&
        Boolean(problem.difficulty?.trim()) &&
        isValidUrl(problem.url);

      return {
        ...problem,
        validData: isValid,
      };
    });

    return {
      totalProblems: problems.length,
      validCount: problems.filter((p) => p.validData).length,
      invalidCount: problems.filter((p) => !p.validData).length,
      problems,
    };

  } catch (error) {
    console.error("Text to sheet error:", error);
    throw error;
  }
};

export default textTOsheet;
