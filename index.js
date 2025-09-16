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

// app.use(enemyUnitRoutes);
// app.use("/user", userRoutes);
// app.use(factionRoutes);

User.hasMany(Server, { as: "ownedServers", foreignKey: "ownerId" });
Server.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.belongsToMany(Server, { through: Membership, foreignKey: "userId" });
Server.belongsToMany(User, { through: Membership, foreignKey: "serverId" });
Role.hasMany(Membership, { foreignKey: "roleId" });
Membership.belongsTo(Role, { foreignKey: "roleId" });

Server.hasMany(Channel, { foreignKey: "serverId" });
Channel.belongsTo(Server, { foreignKey: "serverId" });

User.hasMany(Channel, { foreignKey: "createdBy" });
Channel.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

Channel.hasMany(Message, { foreignKey: "channelId" });
Message.belongsTo(Channel, { foreignKey: "channelId" });

User.hasMany(Message, { foreignKey: "senderId" });
Message.belongsTo(User, { as: "sender", foreignKey: "senderId" });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

await dbConnection.sync();

await seedRoles();
