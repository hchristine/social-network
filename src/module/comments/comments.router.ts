import { Router } from "../../lib/router";
import { isAuthorized } from "../../middlewares/isAuthorized";
import { createComment, likeComment, getCommentLikes } from "./comments.handlers";

export const router = new Router({
    prefix: '/comments'
});

router.post('/')
    .use([isAuthorized])
    .handle(createComment);

router.post('/likes')
    .use([isAuthorized])
    .handle(likeComment);

router.get('/:id/likes')
    .use([isAuthorized])
    .handle(getCommentLikes);
