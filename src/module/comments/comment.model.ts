import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../db/database";

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>>{
    declare id: CreationOptional<number>;
    declare text: string;
    declare postId: number;
    declare userId: number;
}

Comment.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize
});


export function associate(sequelize: Sequelize) {
    Comment.belongsTo(sequelize.models.Post, {
        foreignKey: {
            name: 'postId'
        }
    });

    Comment.belongsTo(sequelize.models.User, {
        foreignKey: {
            name: 'userId'
        }
    });
}