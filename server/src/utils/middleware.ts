import type { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authMiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    req.userId= '1234';
    next();
}