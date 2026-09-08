import env from "dotenv"
env.config();
export const backendUrl = process.env.PLASMO_BACKEND_URL ?? "http://localhost:5000/";
console.log(backendUrl);
