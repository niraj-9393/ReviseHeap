import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

// later cache all the tag in frontend then search as you type 
export const getAllTags = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
        error: "Unauthorized user",
      });
    }

    const tags = await prisma.tag.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "All tags fetched successfully",
      data: tags,
    });
  } catch (error) {
    console.error("Get all tags error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get tags",
    });
  }
};

export const editTag = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;
    const newTagname = req.body.tagName;

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
        message: "Tag id required",
      });
    }

    if (!newTagname || !newTagname.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const tag = await prisma.tag.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    const updatedTag = await prisma.tag.update({
      where: {
        id: tag.id,
      },
      data: {
        name: newTagname.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      data: updatedTag,
    });
  } catch (error) {
    console.error("Edit tag error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update tag",
    });
  }
};
export const deleteTag = async (req: Request, res: Response) => {
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
        message: "Tag id required",
      });
    }

    const tag = await prisma.tag.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    await prisma.tag.delete({
      where: {
        id: tag.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete tag error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete tag",
    });
  }
};



// then there is not tag type the new tag and click on the small icon in the extension field where the icon seems like to save the tag or some thing like that hit this endpoint when you click on the icon ok 
export const createTag = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tagName = req.body.tagName;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please sign in",
        error: "Unauthorized user",
      });
    }

    if (!tagName || !tagName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tag name is required",
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name: tagName.trim(),
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: tag,
    });
  } catch (error) {
    console.error("Create tag error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create tag",
    });
  }
};
