import { Sequelize } from "sequelize";

const dbConnection = new Sequelize("rtc-app", "root", "rootpassword", {
    dialect: "mysql",
    host: "localhost",
    logging: false,
    port: 3307,
});

export default dbConnection;
