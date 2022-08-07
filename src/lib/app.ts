import express from "express";
import chalk from 'chalk';
import cors from 'cors';
import http, { Server } from 'http';

import { Engine, Middleware } from "../core/engine";
import { EngineRouter } from "../core/engine-router";
import { SocketHandler } from "./socket";
import { cache } from "./cache";

export class App implements Engine {
    private app: ReturnType<typeof express>;
    private http: Server;
    private socketHandler: SocketHandler;
    private routers: EngineRouter[] = [];

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(cors({
            origin: 'http://localhost:3001',
        }));
        this.http = http.createServer(this.app);
        this.socketHandler = new SocketHandler(this.http, cache);
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
            this.http.listen(port, () => {
                this.logRegisteredHandlers();

                resolve();
            });
        });
    }
}