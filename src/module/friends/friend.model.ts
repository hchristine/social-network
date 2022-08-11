import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import { sequelize } from "../../db/database";
import { User } from "../users/user.model";

type BasicInfo = Pick<User, 'id' | 'name'>;

enum Status {
    AcceptedRequest = 'Accepted',
    PendingRequest = 'Pending'
}

export class Friends extends Model<InferAttributes<Friends>, InferCreationAttributes<Friends>> {
    declare sendBy: number;
    declare sendTo: number;
    declare requestStatus: CreationOptional<Status>;
    senderUser?: User;

    static async acceptRequest(sendBy: number, sendTo: number) {
        const request = await Friends.findOne({
            where: {
                sendTo,
                sendBy
            }
        });

        if (request) {
            request.requestStatus = Status.AcceptedRequest;
            await request.save();
        } else {
            throw new Error('No such friend request.')
        }
    }

    static async rejectRequest(sendBy: number, sendTo: number) {
        await Friends.destroy({
            where: {
                sendTo,
                sendBy
            }
        });
    }

    static async getPendingRequests(sendBy: number): Promise<BasicInfo[]> {
        const requests = await Friends.findAll({
            where: {
                sendBy,
                requestStatus: Status.PendingRequest
            },
            include: [{
                as: 'senderUser',
                model: User,
                attributes: ['id', 'name'],
            }]
        });
        return requests.map((item) => item.senderUser!);
    }
}

Friends.init({
    sendBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sendTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    requestStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.PendingRequest,
        validate: {
            isIn: [[Status.AcceptedRequest, Status.PendingRequest]]
        },
    }
}, {
    sequelize,
    indexes: [{
        unique: true,
        fields: ['sendBy', 'sendTo']
    }]
});


Friends.removeAttribute('id');

export function associate(sequelize: Sequelize) {
    Friends.belongsTo(sequelize.models.User, {
        as: 'senderUser',
        foreignKey: {
            name: 'sendBy'
        }
    });

    Friends.belongsTo(sequelize.models.User, {
        as: 'receiverUser',
        foreignKey: {
            name: 'sendTo'
        }
    });
}