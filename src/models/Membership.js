import { DataTypes } from "sequelize";
import dbConnection from "../../utils/database.js";

const Membership = dbConnection.define("Membership", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    serverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Membership;
