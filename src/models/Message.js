import { DataTypes } from "sequelize";
import dbConnection from "../../utils/database.js";

const Message = dbConnection.define("Message", {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    channelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Message;
