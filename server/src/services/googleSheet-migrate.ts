import axios from "axios";
import express, { type Request, type Response } from "express";

const router: express.Router = express.Router();

router.post("/migrate/googlesheet", async (req: Request, res: Response) => {
  try {
    const googleSheetUrl = req.body.googleSheetUrl;
    console.log(googleSheetUrl);
    const sheetId = getSheetIdFromUrl(googleSheetUrl);
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;
    const response = await axios.get(url);
    const rawData = response.data;
    console.log(rawData);
    const jsonData = JSON.parse(
            rawData.substring(
                rawData.indexOf("{"),
                rawData.lastIndexOf("}") + 1
            )
        );

        const rows = jsonData.table.rows;

        const headers = rows[0].c.map(cell =>
            cell?.v?.toString().trim().toLowerCase()
        );
        const sheetQuesitonsData = rows.slice(1).map((row, index) => {

            const values = row.c.map(cell => cell?.v ?? "");

            const obj:any = {};

            headers.forEach((header, i) => {
                obj[header] = values[i];
            });

            return {
                id: index + 1,
                name: obj.name,
                link: obj.link,
                difficulty: obj.difficuilty,
                remark: obj.remark
            };
        });
        console.log(sheetQuesitonsData);
        res.status(200).json({
            success: true,
            total: sheetQuesitonsData.length,
            data: sheetQuesitonsData
        });
  } catch (error: any) {
    console.error("Google Sheets API Error:", error.message || error);

    return res.status(500).json({
      message: "Failed to retrieve Google Sheet data",
      error: error.message || "Internal Server Error",
    });
  }
});
function getSheetIdFromUrl(url) {
  // Matches the characters between /d/ and the next forward slash or end of string
  const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return matches ? matches[1] : null;
}
export default router;
