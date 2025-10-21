import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import seedRoles from "./utils/seedRoles.js";
import dbConnection from "./utils/database.js";

import User from "./src/models/User.js";
import Server from "./src/models/Server.js";
import Role from "./src/models/Role.js";
import Membership from "./src/models/Membership.js";
import Channel from "./src/models/Channel.js";
import Message from "./src/models/Message.js";
import UserServerPreference from "./src/models/UserServerPreference.js";

import userRoutes from "./src/routes/userRoutes.js";
import serverRoutes from "./src/routes/serverRoutes.js";
import channelRoutes from "./src/routes/channelRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import userPreferenceRoutes from "./src/routes/userPreferenceRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter }).single("image")); //image is the name property of the input field submitting the file
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204); // No content
    }
    next();
});

app.use("/user", userRoutes);
app.use(serverRoutes);
app.use("/server", channelRoutes);
app.use("/server", userPreferenceRoutes);
app.use(messageRoutes);

// User <-> Server (ownership and memberships)

User.belongsToMany(Server, { through: Membership, foreignKey: "userId" });
Server.belongsToMany(User, { through: Membership, foreignKey: "serverId" });

Server.hasMany(Membership, {
    as: "memberships",
    foreignKey: "serverId",
    onDelete: "CASCADE",
});
Membership.belongsTo(Server, { as: "server", foreignKey: "serverId" });

User.hasMany(Membership, { as: "memberships", foreignKey: "userId" });
Membership.belongsTo(User, { foreignKey: "userId" });

// Role <-> Membership
Role.hasMany(Membership, { as: "memberships", foreignKey: "roleId" });
Membership.belongsTo(Role, { as: "role", foreignKey: "roleId" });

// Server <-> Channel
Server.hasMany(Channel, {
    as: "channels",
    foreignKey: "serverId",
    onDelete: "CASCADE",
});
Channel.belongsTo(Server, { as: "server", foreignKey: "serverId" });

// Channel <-> User (creator)
// User.hasMany(Channel, { as: "channels", foreignKey: "createdBy" });
// Channel.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

// Channel <-> Message
Channel.hasMany(Message, { as: "messages", foreignKey: "channelId" });
Message.belongsTo(Channel, { as: "channel", foreignKey: "channelId" });

// User <-> Message (sender)
User.hasMany(Message, { as: "messages", foreignKey: "senderId" });
Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

// User <-> Server Preferences (last selected channel)
User.hasMany(UserServerPreference, {
    as: "preferences",
    foreignKey: "userId",
    onDelete: "CASCADE",
});
UserServerPreference.belongsTo(User, { foreignKey: "userId" });

Server.hasMany(UserServerPreference, {
    as: "preferences",
    foreignKey: "serverId",
    onDelete: "CASCADE",
});
UserServerPreference.belongsTo(Server, { foreignKey: "serverId" });

Channel.hasMany(UserServerPreference, {
    as: "preferences",
    foreignKey: "lastChannelId",
});
UserServerPreference.belongsTo(Channel, {
    as: "lastChannel",
    foreignKey: "lastChannelId",
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

await dbConnection.sync();

await seedRoles();
