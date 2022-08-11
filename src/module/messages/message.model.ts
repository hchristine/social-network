import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Op, Sequelize } from "sequelize";
import { sequelize } from "../../db/database";
import { User } from "../users/user.model";

export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
    declare id: CreationOptional<number>;
    declare content: string;
    declare senderId: number;
    declare receiverId: number;
    declare isRead: boolean;

    static async getHistory(senderId: number, receiverId: number) {
        const conversation = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: receiverId },
                    { receiverId: senderId }
                ]
            },
            include: [{
                as: 'sender',
                model: User,
                attributes: ['name']
            }]
        });
        return conversation.map((item) => item.content);
    }
}

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    indexes: [{
        fields: ['senderId', 'receiverId']
    }]
});

export function associate(sequelize: Sequelize) {
    Message.belongsTo(sequelize.models.User, {
        as: 'sender',
        foreignKey: {
            name: 'senderId'
        }
    });

    Message.belongsTo(sequelize.models.User, {
        as: 'receiver',
        foreignKey: {
            name: 'receiverId'
        }
    });
}