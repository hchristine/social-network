import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../../db/database";
import { User } from "../../users/user.model";

type BasicInfo = Pick<User, 'id' | 'name'>;

export class CommentLike extends Model<InferAttributes<CommentLike>, InferCreationAttributes<CommentLike>>{
    declare commentId: number;
    declare userId: number;
    declare User?: User;

    static async findUsersForComment(commentId: number): Promise<BasicInfo[]> {
        const likes = await CommentLike.findAll({
            where: { commentId },
            include: [{
                model: User,
                attributes: ['id', 'name']
            }]
        });
        return likes.map((like) => like.User!);
    }
}

CommentLike.init({
    commentId: {
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
        fields: ['commentId', 'userId']
    }]
});

CommentLike.removeAttribute('id');

export function associate(sequelize: Sequelize) {
    CommentLike.belongsTo(sequelize.models.Comment, {
        foreignKey: {
            name: 'commentId'
        }
    });

    CommentLike.belongsTo(sequelize.models.User, {
        foreignKey: {
            name: 'userId'
        }
    });
}