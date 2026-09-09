import type { Request, Response } from "express";
import { createQuestionSchema } from "../types/question.types.js";
import { prisma } from "../utils/prisma.js";

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
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

    const {
      name,
      url,
      platform,
      difficulty,
      userDifficulty,
      remark,
      solvedRemark,
    } = result.data;

    const currQuestionTags: string[] = Array.isArray(req.body.tags)
      ? req.body.tags
      : [];

    const uniqueTagNames = [
      ...new Set(
        currQuestionTags
          .filter((tag) => typeof tag === "string")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ];

    const question = await prisma.$transaction(async (tx) => {
      const existingQuestion = await tx.question.findFirst({
        where: {
          userId,
          name,
          url,
        },
      });

      if (existingQuestion) {
        throw new Error("QUESTION_ALREADY_EXISTS");
      }

      const newQuestion = await tx.question.create({
        data: {
          name,
          url,
          platform,
          difficulty: difficulty ?? null,
          userDifficulty: userDifficulty ?? null,
          remark: remark ?? null,
          solvedRemark: solvedRemark ?? null,
          userId,
        },
      });

      const tags = await Promise.all(
        uniqueTagNames.map((tagName) =>
          tx.tag.upsert({
            where: {
              userId_name: {
                userId,
                name: tagName,
              },
            },
            update: {},
            create: {
              name: tagName,
              userId,
            },
          }),
        ),
      );

      if (tags.length > 0) {
        await tx.questionTag.createMany({
          data: tags.map((tag) => ({
            questionId: newQuestion.id,
            tagId: tag.id,
          })),
        });
      }

      return newQuestion;
    });

    const createdQuestion = await prisma.question.findUnique({
      where: {
        id: question.id,
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

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: createdQuestion,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "QUESTION_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Question already added",
      });
    }

    console.error("Create question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question",
    });
  }
};

export const updateRevision = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
        error: "Unauthorized user",
      });
    }

    const { questionId, name, url, revisionRemark } = req.body;

    const existingQuestion = await prisma.question.findFirst({
      where: {
        userId,
        ...(questionId ? { id: questionId } : { name, url }),
      },
    });

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found..............",
      });
    }

    const latestRevision = await prisma.revision.findFirst({
      where: {
        questionId: existingQuestion.id,
      },
      orderBy: {
        revisionCount: "desc",
      },
    });

    const nextRevisionCount = latestRevision
      ? latestRevision.revisionCount + 1
      : 1;

    const revision = await prisma.revision.create({
      data: {
        questionId: existingQuestion.id,
        revisionCount: nextRevisionCount,
        revisionRemark: revisionRemark ?? null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Revision added successfully",
      data: revision,
    });
  } catch (error) {
    console.error("Update revision error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add revision",
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
      message: "Questions ....fetched .... successfully...",
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
        message: "Question not found..",
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
        message: "Question not found..",
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

export const alluser = async (req: Request, res: Response) => {
  const user = await prisma.session.findMany();
  res.status(200).json({ userid: user[0]?.userId });
};

export const qestionSolved = async (req: Request, res: Response) => {
  console.log("SOLVED ROUTE HIT");
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }
    const quetionTitle = req.body.title;
    const quetionUrl = req.body.url;
    const solved = await prisma.question.findFirst({
      where: {
        userId: userId,
        name: quetionTitle,
        url: quetionUrl,
      },
    });
    if (!solved) {
      return res.status(201).json({
        success: true,
        solved: false,
        message: "quesion is not solved yet",
      });
    }
    return res.status(200).json({
      success: true,
      solved: true,
      questionId: solved.id,
      message: "question already sovled ",
    });
  } catch (error) {
    console.error(" question issolved  error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to see question solved or not ",
    });
  }
};
