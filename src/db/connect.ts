import { sequelize } from "./database";
import { associate as userAssociate } from "../module/users/user.model";
import { associate as postAssociate } from "../module/posts/models/post.model";
import { associate as commentAssociate } from "../module/comments/comment.model";
import { associate as postLikeAssociate } from "../module/posts/models/post-likes.model";

export async function connect() {
    await sequelize.authenticate();
    userAssociate(sequelize);
    postAssociate(sequelize);
    commentAssociate(sequelize);
    postLikeAssociate(sequelize);
    await sequelize.sync();
}