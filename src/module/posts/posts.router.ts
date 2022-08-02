import multer from "multer";

import { config } from "../../config";
import { Router } from "../../lib/router";
import { isAuthorized } from "../../middlewares/isAuthorized";
import { createPost, getPost, uploadPostImage, getById, likePost, getPostLikes } from './posts.handlers';

export const router = new Router({
    prefix: '/posts'
});

const upload = multer({ dest: config.FILE_UPLOAD_PATH });

router.post('/upload')
    .use([isAuthorized, upload.single('image')])
    .handle(uploadPostImage);

router.post('/')
    .use([isAuthorized])
    .handle(createPost);

router.get('/')
    .use([isAuthorized])
    .handle(getPost);

router.get('/:id')
    .use([isAuthorized])
    .handle(getById);

router.get('/:id/likes')
    .use([isAuthorized])
    .handle(getPostLikes);

router.post('/likes')
    .use([isAuthorized])
    .handle(likePost);
