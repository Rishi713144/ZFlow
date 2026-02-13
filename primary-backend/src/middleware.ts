import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization as string;

    try {
        const payload = jwt.verify(token, JWT_PASSWORD) as { id: string };
        (req as any).id = payload.id
        next();
    } catch (e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}
