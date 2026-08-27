import express from "express";
import {
  getAllTags,
  createTag,
  editTag,
  deleteTag,
} from "../controller/tag.controller.js";

const router: express.Router = express.Router();

router.get("/", getAllTags);
router.post("/", createTag);
router.post("/:id", editTag);
router.get("/:id", deleteTag);

export default router;
