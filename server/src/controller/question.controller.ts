import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js"

export const alluser = async (req:Request,res:Response) => {
  const user = await prisma.session.findMany();
  res.status(200).json({userid:user[0]?.userId});
}