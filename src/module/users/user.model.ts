import { sequelize } from "../../db/database";
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

interface LoginCredentials {
    email: string;
    password: string;
}

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;

    static register(info: Omit<InferCreationAttributes<User>, 'id'>) {
        return this.create(info);
    }

    static async login(payload: LoginCredentials) {
        const { email, password } = payload;
        const user = await User.findOne({
            where: {
                email,
            }
        });

        if (!user) {
            throw new Error('Not found.');
        }

        const isIdentical = await user.comparePassword(password);

        if (isIdentical) {
            return user;
        }

        throw new Error('Not found.');
    };

    async comparePassword(passwordToCompare: string) {
        return bcrypt.compare(passwordToCompare, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},
    {
        sequelize,
        hooks: {
            beforeCreate: async (user) => {
                try {
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(user.password, salt);
                    user.password = hash;
                }
                catch {
                    throw new Error("Error occured when trying to hash the password.")
                }
            }
        }
    },
);

export function associate(sequelize: Sequelize) {
    User.hasMany(sequelize.models.Post, {
        foreignKey: {
            name: 'userId'
        }
    });

    User.hasMany(sequelize.models.Comment, {
        foreignKey: {
            name: 'userId'
        }
    });

    User.hasMany(sequelize.models.PostLike, {
        foreignKey: {
            name: 'userId'
        }
    });
};