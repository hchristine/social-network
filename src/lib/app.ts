import express from "express";
import chalk from 'chalk';

import { Engine, Middleware } from "../core/engine";
import { EngineRouter } from "../core/engine-router";

export class App implements Engine {
    private app: ReturnType<typeof express>;
    private routers: EngineRouter[] = [];

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    useMiddleware(middleware: Middleware) {
        this.app.use(middleware);
    }

    useRouter(router: EngineRouter) {
        this.routers.push(router);
        this.app.use(router.getConfig().prefix, router.getRouter());
    }

    logRegisteredHandlers() {
        this.routers.forEach((router) => {
            const routes = router.getRoutesList();
            console.log(chalk.green(`${chalk.bold(`${router.getConfig().prefix}`)}`));
            routes.forEach((route) => {
                console.log(`\t${chalk.bgBlue(chalk.white.bold(`[${route.method.toUpperCase()}]`))}: ${chalk.italic.bold.green(route.url)}`);
            });
            console.log('\n');
        });
    }

    start(port: string | number): Promise<void> {
        return new Promise((resolve) => {
            this.app.listen(port, () => {
                this.logRegisteredHandlers();
                resolve();
            });
        });
    }
}