import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../db/database";

export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
    declare id: CreationOptional<number>;
    declare content: string;
    declare senderId: number;
    declare receiverId: number;
    declare isRead: boolean;
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