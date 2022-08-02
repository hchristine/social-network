import { Router as expressRouter } from 'express';
import { Middleware } from '../core/engine';
import { EngineRouter, RouteHandler, RouteProcessor, RouterConfig } from '../core/engine-router';

type RouteType = ReturnType<ReturnType<typeof expressRouter>['route']>;
type RequesType = 'get' | 'post' | 'put' | 'delete';

class RouteProcessorImpl implements RouteProcessor {
    private route: RouteType;
    private method: RequesType;

    constructor(route: RouteType, method: RequesType) {
        this.route = route;
        this.method = method;
    }

    use(middleware: Middleware[]): RouteProcessor {
        this.route[this.method](...middleware);
        return this;
    }

    handle(handler: RouteHandler): void {
        this.route[this.method](handler as any);
    }
}

export class Router implements EngineRouter {
    private router: ReturnType<typeof expressRouter>;
    private config: RouterConfig;

    constructor(config: RouterConfig) {
        this.router = expressRouter();
        this.config = config;
    }

    get(path: string): RouteProcessor {
        const route = this.router.route(path);
        return new RouteProcessorImpl(route, 'get');
    }

    post(path: string): RouteProcessor {
        const route = this.router.route(path);
        return new RouteProcessorImpl(route, 'post');
    }

    put(path: string): RouteProcessor {
        const route = this.router.route(path);
        return new RouteProcessorImpl(route, 'put');
    }

    delete(path: string): RouteProcessor {
        const route = this.router.route(path);
        return new RouteProcessorImpl(route, 'delete');
    }

    getRouter(): expressRouter {
        return this.router;
    }
    
    getConfig(): RouterConfig {
        return this.config;
    }
}