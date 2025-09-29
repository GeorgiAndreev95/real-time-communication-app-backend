import Membership from "../models/Membership";
import Channel from "../models/Channel";
import Message from "../models/Message";
import Server from "../models/Server";
import User from "../models/User";

export const createMessage = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        if (!content || typeof content !== "string") {
            return res
                .status(400)
                .json({ error: "Message content is required" });
        }

        const channel = await Channel.findOne({
            include: [
                {
                    as: "server",
                    model: Server,
                    required: true,
                    include: [
                        {
                            as: "membership",
                            model: Membership,
                            required: true,
                            where: { userId },
                        },
                    ],
                },
            ],
            where: { id: channelId },
        });

        if (!channel) {
            return res.status(403).json({
                message: "Channel not found or access denied",
            });
        }

        const message = await Message.create({
            content,
            channelId,
            senderId: userId,
        });

        const messageWithAuthor = await Message.findByPk(message.id, {
            include: [
                {
                    as: "user",
                    attributes: ["id", "username"],
                    model: User,
                },
            ],
        });

        return res.status(201).json({ message: messageWithAuthor });
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ message: "Failed to create message" });
    }
};

export const getMessage = async (req, res, next) => {
    try {
        const { channelId } = req.params;

        if (isNaN(Number(channelId))) {
            return res.status(400).json({ message: "Invalid channel ID" });
        }

        const messages = await Message.findAll({
            attributes: ["id", "content", "createdAt", "updatedAt"],
            include: [
                {
                    as: "user",
                    attributes: ["id", "username"],
                    model: User,
                },
            ],
            order: [["createdAt", "DESC"]],
            where: { channelId },
        });

        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const userId = req.userId;

        const message = await Message.findByPk(messageId, {
            include: [
                {
                    as: "user",
                    attributes: ["id", "username"],
                    model: User,
                },
                {
                    as: "channel",
                    model: Channel,
                    include: [
                        {
                            as: "server",
                            model: Server,
                            include: [
                                {
                                    as: "memberships",
                                    model: Membership,
                                    where: { userId },
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId !== userId) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this message" });
        }

        await message.destroy();

        return res
            .status(200)
            .json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(500).json({ message: "Failed to delete message" });
    }
};
