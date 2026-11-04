import axios from "axios";
import express, { type Request, type Response } from "express";
import textTOsheet from "../ai-services/makeSheet.js";

const router: express.Router = express.Router();

router.post("/upload", async (req: Request, res: Response) => {
  try {
    const googleSheetUrl = req.body.googleSheetUrl;
    console.log(googleSheetUrl);
    const sheetId = getSheetIdFromUrl(googleSheetUrl);
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const response = await axios.get(url);
    const rawData = response.data;
    console.log(rawData);

    const aiData = await textTOsheet(rawData);
    console.log(aiData);
    if (aiData.totalProblems == 0) {
      res.status(200).json({
        message: "upload file where dsa question available",
      });
      return;
    }
    // add to db 
    
    res.status(200).json({
      message: `we succesfull extract ${aiData.totalProblems} question from you sheet`,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to retrieve Google Sheet data",
      error: error.message || "Internal Server Error",
    });
  }
});
function getSheetIdFromUrl(url: any) {
  const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return matches ? matches[1] : null;
}
export default router;
