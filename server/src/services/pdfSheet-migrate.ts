import express, { type Request, type Response } from "express";
import { upload } from "../middleware/upload.js";
import { PDFParse } from "pdf-parse";
const router: express.Router = express.Router();
router.post(
  "/upload",
  upload.single("sheet"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "sheet file is required" });
        return;
      }
      const parser = new PDFParse({ data: file.buffer });
      const pdfData = await parser.getText();
      await parser.destroy();
     
      const extractedText = pdfData.text;
      console.log(extractedText);
      res.status(200).json({ message: "revived " });
    } catch (error) {
      res.status(400).json({
        error: error,
      });
    }
  },
);

export default router;
