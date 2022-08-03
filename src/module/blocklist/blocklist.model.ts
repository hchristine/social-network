import { DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../db/database";
import { User } from "../users/user.model";

type BasicInfo = Pick<User, 'id' | 'name'>;

export class BlockList extends Model<InferAttributes<BlockList>, InferCreationAttributes<BlockList>> {
    declare blockedBy: number;
    declare blockedTo: number;
    blockedUser?: User;

    static async getBlockedUsers(blockedBy: number): Promise<BasicInfo[]> {
        const list = await BlockList.findAll({
            where: { blockedBy },
            include: [{
                as: 'blockedUser',
                model: User,
                attributes: ['id', 'name']
            }]
        });
        return list.map((item) => item.blockedUser!);
    }
}

BlockList.init({
    blockedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    blockedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    indexes: [{
        unique: true,
        fields: ['blockedBy', 'blockedTo']
    }]
});

BlockList.removeAttribute('id');

export function associate(sequelize: Sequelize) {
    BlockList.belongsTo(sequelize.models.User, {
        as: 'user',
        foreignKey: {
            name: 'blockedBy'
        }
    });

    BlockList.belongsTo(sequelize.models.User, {
        as: 'blockedUser',
        foreignKey: {
            name: 'blockedTo'
        }
    });
}