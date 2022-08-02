import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../../db/database";
import { User } from "../../users/user.model";

type BasicInfo = Pick<User, 'id' | 'name'>;

export class PostLike extends Model<InferAttributes<PostLike>, InferCreationAttributes<PostLike>>{
    declare postId: number;
    declare userId: number;
    declare User?: User;

    static async findUsersForPost(postId: number): Promise<BasicInfo[]> {
       // TODO: Get All likes for postId
       // Join with users since we need users' names
       // Map over the result and return an array of users with BasicInfo type
       return [];
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