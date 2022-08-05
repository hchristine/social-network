import { sequelize } from "./database";
import { associate as userAssociate } from "../module/users/user.model";
import { associate as postAssociate } from "../module/posts/models/post.model";
import { associate as commentAssociate } from "../module/comments/models/comment.model";
import { associate as postLikeAssociate } from "../module/posts/models/post-likes.model";
import { associate as commentLikeAssociate } from "../module/comments/models/comment-like.model";
import { associate as blocklistAssociate } from "../module/blocklist/blocklist.model";
import { associate as friendAssociate } from "../module/friends/friend.model";
import { associate as messageAssociate } from "../module/messages/message.model";

export async function connect() {
    await sequelize.authenticate();
    userAssociate(sequelize);
    postAssociate(sequelize);
    commentAssociate(sequelize);
    postLikeAssociate(sequelize);
    commentLikeAssociate(sequelize);
    blocklistAssociate(sequelize);
    friendAssociate(sequelize);
    messageAssociate(sequelize);
    await sequelize.sync();
}