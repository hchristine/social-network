import { Router } from "../../lib/router";
import { isAuthorized } from "../../middlewares/isAuthorized";
import { sendFriendRequest, acceptRequest, rejectRequest, getPendingRequests } from "./friends.handlers";

export const router = new Router({
    prefix: '/friends'
});

router.post('/')
    .use([isAuthorized])
    .handle(sendFriendRequest);

router.patch('/')
    .use([isAuthorized])
    .handle(acceptRequest);

router.delete('/:sendBy')
    .use([isAuthorized])
    .handle(rejectRequest);

router.get('/')
    .use([isAuthorized])
    .handle(getPendingRequests);