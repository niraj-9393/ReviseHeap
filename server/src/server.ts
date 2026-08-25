import express from "express";
import dotenv from "dotenv";
import router from "./router/question.routes.js";


dotenv.config();
const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "TypeScript server is running" });
});
app.use('/api/question',router);
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ message: "working" });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});