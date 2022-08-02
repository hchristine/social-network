import { Request, Response, NextFunction } from "express";
import { auth } from "../services/auth";

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.status(403).send();
        return;
    }

    try {
        const data = await auth.verify(req.headers.authorization);
        req.user = data;
        next();
    }
    catch (error) {
        res.status(401).send(error);
    }
}