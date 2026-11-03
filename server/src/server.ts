import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import questionRouter from "./router/question.routes.js";
import tagRouter from "./router/tag.routes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import migrateGooglesheetRouter from "./services/googleSheet-migrate.js"
import migratePdfSheetRouter from "./services/pdfSheet-migrate.js"
import cors from "cors";
import { alluser } from "./controller/question.controller.js";


const app = express();
const port = process.env.PORT ?? 3000;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "chrome-extension://fkbfodboipcbhldoamaaimkkbhljjljj",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.get("/", (_req, res) => {
  res.json({ message: "TypeScript server is running" });
});
app.use("/api/question", questionRouter);
app.use("/api/tags", tagRouter);
app.use("/api/migrate/googleSheet",migrateGooglesheetRouter)
app.use("/api/migrate/pdf",migratePdfSheetRouter)
app.get("/health", (_req, res) => {
  console.log(_req);
  console.log("HEALTH API CALLED");

  res.json({ status: "ok" });
});
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.get("/all/user", alluser);



app.post("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.json({ message: "working" });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
