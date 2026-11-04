import express, { type Request, type Response } from "express";
import { upload } from "../middleware/upload.js";
import { PDFParse } from "pdf-parse";
import textTOsheet from "../ai-services/makeSheet.js";
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
      const aiData = await textTOsheet(extractedText);
      console.log(aiData);
      if (aiData.totalProblems == 0) {
        res.status(200).json({
          message: "upload file where dsa question available",
        });
        return;
      }
      // add quesiton to db 
      
      res.status(200).json({
        message: `we succesfull extract ${aiData.totalProblems} question from you sheet`,
      });
    } catch (error) {
      res.status(400).json({
        error: error,
      });
    }
  },
);

export default router;
