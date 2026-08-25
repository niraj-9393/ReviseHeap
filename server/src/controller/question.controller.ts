import type { Request, Response } from "express";
import { createQuestionSchema } from "../types/question.types.js";
import { prisma } from "../utils/prisma.js";

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: " please sign in",
        error: "Unauthorized user",
      });
    }

    const result = createQuestionSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid question data",
        errors: result.error.issues,
      });
    }
    const question = await prisma.question.create({
      data: {
        ...result.data,
        difficulty: result.data.difficulty ?? null,
        userDifficulty: result.data.userDifficulty ?? null,
        remark: result.data.remark ?? null,
        solvedRemark: result.data.solvedRemark ?? null,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    console.error("Create question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question",
    });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: " please sign in",
        error: "Unauthorized user",
      });
    }
    if (!id) {
      return res.status(400).json({
        success: false,
        message: " question id required",
      });
    }
    const question = await prisma.question.findFirst({
      where: {
        userId,
        id,
      },
    });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "question notFound",
      });
    }
    await prisma.question.delete({
      where: {
        id: question.id,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete question",
    });
  }
};

export const getAllQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
        error: "Unauthorized user",
      });
    }

    const questions = await prisma.question.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Get all questions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get questions",
    });
  }
};

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
        error: "Unauthorized user",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: " question id required",
      });
    }

    const question = await prisma.question.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        revisions: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question fetched successfully",
      data: question,
    });
  } catch (error) {
    console.error("Get question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get question",
    });
  }
};
export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
        error: "Unauthorized user",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Question id required",
      });
    }

    const question = await prisma.question.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const latestRevision = await prisma.revision.findFirst({
      where: {
        questionId: question.id,
      },
      orderBy: {
        revisionCount: "desc",
      },
    });

    const nextRevisionCount = latestRevision
      ? latestRevision.revisionCount + 1
      : 1;

    const revisionRemark = req.body.revisionRemark ?? null;

    const revision = await prisma.revision.create({
      data: {
        questionId: question.id,
        revisionCount: nextRevisionCount,
        revisionRemark,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: revision,
    });
  } catch (error) {
    console.error("Update question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update question",
    });
  }
};
