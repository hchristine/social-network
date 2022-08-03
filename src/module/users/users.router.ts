import { Router } from "../../lib/router";
import { isAuthorized } from "../../middlewares/isAuthorized";
import { register, login, edit } from './users.handlers';

export const router = new Router({
    prefix: '/users'
});

router.post('/register')
    .handle(register);

router.post('/login')
    .handle(login);

router.put('/')
    .use([isAuthorized])
    .handle(edit);