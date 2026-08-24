import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth.js";
import cors from "cors"
import { alluser } from "./controller/question.controller.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods:["GET","POST","PUT","DELETE"]
}))
app.use(express.json());
app.all("/api/auth/{*any}", toNodeHandler(auth));
app.get('/all/user',alluser)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});