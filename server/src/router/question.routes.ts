import express from "express";

import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getAllQuestion,
  getQuestion,
} from "../controller/question.controller.js";
import { authMiddleware } from "../utils/middleware.js";

const router: express.Router = express.Router();

router.post("/", authMiddleware, createQuestion);

router.get("/", authMiddleware, getAllQuestion);

router.get("/:id", authMiddleware, getQuestion);

router.post("/:id", authMiddleware, updateQuestion);

router.get("/:id", authMiddleware, deleteQuestion);

export default router;
