import { Sequelize } from "sequelize";

const dbUrl = process.env.DB_URI;

export const sequelize = new Sequelize(dbUrl ?? "", {
    logging: false
});