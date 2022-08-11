import { Router } from "../../lib/router";
import { isAuthorized } from "../../middlewares/isAuthorized";
import { getConversation } from './messages.handlers';

export const router = new Router({
    prefix: '/messages'
});

router.get('/:id')
    .use([isAuthorized])
    .handle(getConversation);