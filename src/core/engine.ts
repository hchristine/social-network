import { Request, Response, NextFunction, Router } from "express";
import { EngineRouter } from "./engine-router";

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;
export type AppRouter = ReturnType<typeof Router>;

export interface Engine {
    useMiddleware(middleware: Middleware): void;
    useRouter(router: EngineRouter): void;
    start(port: number | string): Promise<void>;
}