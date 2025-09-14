import { DataTypes } from "sequelize";
import dbConnection from "../../utils/database.js";

const Server = dbConnection.define("Server", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default Server;
