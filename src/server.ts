import { connect } from "./db/connect";
import { App } from "./lib/app";
import { IAuthPayload } from "./services/auth";
import { router as userRouter } from './module/users/users.router';
import { router as postsRouter } from './module/posts/posts.router';
import { router as commentsRouter } from "./module/comments/comments.router";
import { router as blocklistRouter } from "./module/blocklist/blocklists.router";
import { router as friendRouter } from "./module/friends/friends.router";
import { router as messageRouter } from "./module/messages/messages.router";

const app = new App();
const port = process.env.PORT ?? 3000;

app.useRouter(userRouter);
app.useRouter(postsRouter);
app.useRouter(commentsRouter);
app.useRouter(blocklistRouter);
app.useRouter(friendRouter);
app.useRouter(messageRouter);

export async function bootstrap() {
    try {
        await connect();
        await app.start(port);
        console.log("Connection has been established successfully.")
    }
    catch (error) {
        console.log("Unable to connect to the database: ", error)
    }
}

bootstrap();

declare global {
    namespace Express {
        interface Request {
            user?: IAuthPayload
        }
    }
}