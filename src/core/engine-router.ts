import { Request, Response, Router } from "express";
import { Middleware } from "./engine";

export type RouteHandler = (req: Request, res: Response) => any;

export interface RouteProcessor {
    use(middleware: Middleware[]): RouteProcessor;
    handle(handler: RouteHandler): void;
}

export type RouterConfig = {
    prefix: string;
}

export interface EngineRouter {
    get(path: string): RouteProcessor;
    post(path: string): RouteProcessor;
    put(path: string): RouteProcessor;
    delete(path: string): RouteProcessor;
    getRouter(): Router;
    getConfig(): RouterConfig;
}