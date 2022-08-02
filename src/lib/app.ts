import express from "express";
import { Engine, Middleware } from "../core/engine";
import { EngineRouter } from "../core/engine-router";

export class App implements Engine {
    private app: ReturnType<typeof express>;

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    useMiddleware(middleware: Middleware) {
        this.app.use(middleware);
    }

    useRouter(router: EngineRouter) {
        this.app.use(router.getConfig().prefix, router.getRouter());
    }

    start(port: string | number): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(port, () => {
                resolve();
            });
        });
    }
}