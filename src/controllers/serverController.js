import User from "../models/User.js";
import Server from "../models/Server.js";
import Channel from "../models/Channel.js";
import Membership from "../models/Membership.js";
import UserServerPreference from "../models/UserServerPreference.js";

export const getUserServers = async (req, res, next) => {
    try {
        const userServers = await Membership.findAll({
            include: [
                {
                    as: "server",
                    attributes: ["id", "image", "name"],
                    model: Server,
                    include: [
                        {
                            as: "channels",
                            model: Channel,
                        },
                        {
                            as: "preferences",
                            model: UserServerPreference,
                            where: { userId: req.userId },
                            required: false,
                            attributes: ["lastChannelId"],
                            include: [
                                {
                                    as: "lastChannel",
                                    model: Channel,
                                    attributes: ["id", "name"],
                                },
                            ],
                        },
                        {
                            as: "memberships",
                            attributes: ["roleId"],
                            include: [
                                {
                                    as: "user",
                                    attributes: [
                                        "id",
                                        "username",
                                        "profilePicture",
                                    ],
                                    model: User,
                                },
                            ],
                            model: Membership,
                        },
                    ],
                },
            ],
            where: { userId: req.userId },
        });
        return res.status(200).json({
            userServers,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createServer = async (req, res, next) => {
    const { name } = req.body;
    const userId = req.userId;

    try {
        const imageUrl = req.file ? `/images/${req.file.filename}` : null;

        const server = await Server.create({
            name,
            image: imageUrl,
        });

        console.log(userId);

        const membership = await Membership.create({
            userId,
            serverId: server.id,
            roleId: 1,
        });

        const channel = await Channel.create({
            name: "General",
            serverId: server.id,
        });

        console.log(req.body);
        console.log(membership);
        return res.status(201).json({
            server,
            membership,
            channel,
        });
    } catch (error) {
        if (req.file) {
            deleteFile(`/images/${req.file.filename}`);
        }

        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateServer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const server = await Server.findByPk(id);

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const updates = {
            name,
        };

        if (req.file) {
            const newImageUrl = `/images/${req.file.filename}`;

            if (server.image && server.image !== newImageUrl) {
                deleteFile(server.image);
            }

            updates.image = newImageUrl;
        }

        await server.update(updates);

        return res.status(200).json({ message: "Server updated", server });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteServer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const server = await Server.findByPk(id);

        if (!server) {
            return res
                .status(404)
                .json({ message: "Server with this ID not found." });
        }

        await server.destroy();
        return res.status(200).json({
            message: `Server with id: ${req.params.id} deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
