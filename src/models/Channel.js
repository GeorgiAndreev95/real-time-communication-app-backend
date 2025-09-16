import { DataTypes } from "sequelize";
import dbConnection from "../../utils/database.js";

const Channel = dbConnection.define("Channel", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    serverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Channel;
