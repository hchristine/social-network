import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { Comment } from '../../comments/models/comment.model';
import { sequelize } from "../../../db/database";


export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
    declare id: CreationOptional<number>;
    declare description: string;
    declare photos: [string];
    declare userId: number;

    static findWithComments(postId: number) {
        return this.findByPk(postId, {
            include: [{
                model: Comment,
                attributes: ['id', 'text'],
                as: 'comments',
            }],
        });
    }
}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize
});


export function associate(sequelize: Sequelize) {
    Post.belongsTo(sequelize.models.User, {
        foreignKey: {
            name: 'userId'
        }
    });

    Post.hasMany(sequelize.models.Comment, {
        foreignKey: {
            name: 'postId'
        },
        as: 'comments'
    });

    Post.hasMany(sequelize.models.PostLike, {
        foreignKey: {
            name: 'postId'
        }
    });
}