import { Router } from "../../lib/router";
import { isAuthorized } from "../../middlewares/isAuthorized";
import { blockUser, getSelfBlocklist } from './blocklists.handlers';

export const router = new Router({
    prefix: '/blocklists'
});

router.post('/')
    .use([isAuthorized])
    .handle(blockUser);

router.get('/')
    .use([isAuthorized])
    .handle(getSelfBlocklist);