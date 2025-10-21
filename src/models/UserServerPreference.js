import { DataTypes } from "sequelize";
import dbConnection from "../../utils/database.js";

const UserServerPreference = dbConnection.define("UserServerPreference", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    serverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lastChannelId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});

export default UserServerPreference;
