import { Router } from "../../lib/router";
import { isAuthorized } from "../../middlewares/isAuthorized";
import { createComment } from "./comments.handlers";

export const router = new Router({
    prefix: '/comments'
});

router.post('/')
    .use([isAuthorized])
    .handle(createComment);
