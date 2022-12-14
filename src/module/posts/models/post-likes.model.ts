import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../../db/database";
import { User } from "../../users/user.model";

type BasicInfo = Pick<User, 'id' | 'name'>;

export class PostLike extends Model<InferAttributes<PostLike>, InferCreationAttributes<PostLike>>{
    declare postId: number;
    declare userId: number;
    declare User?: User;

    static async findUsersForPost(postId: number): Promise<BasicInfo[]> {
        const likes = await PostLike.findAll({
            where: { postId },
            include: [{
                model: User,
                attributes: ['id', 'name']
            }]
        });
        return likes.map((like) => like.User!);
    }
}

PostLike.init({
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    indexes: [{
        unique: true,
        fields: ['userId', 'postId']
    }]
});

PostLike.removeAttribute('id');

export function associate(sequelize: Sequelize) {
    PostLike.belongsTo(sequelize.models.Post, {
        foreignKey: {
            name: 'postId'
        }
    });

    PostLike.belongsTo(sequelize.models.User, {
        foreignKey: {
            name: 'userId'
        }
    });
}