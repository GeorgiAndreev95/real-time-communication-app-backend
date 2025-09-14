import { DataTypes } from "sequelize";
import dbConnection from "../../utils/database.js";

const Role = dbConnection.define("Role", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
});

export default Role;
