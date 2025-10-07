import Channel from "../models/Channel.js";
import Server from "../models/Server.js";

export const getServerChannels = async (req, res, next) => {
    try {
        const { serverId } = req.params;
        const serverChannels = await Channel.findAll({
            where: { serverId },
        });

        return res.status(200).json({
            serverChannels,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createChannel = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { serverId } = req.params;

        if (!name) {
            return res.status(400).json({ message: "Missing required field" });
        }

        const server = await Server.findByPk(serverId);

        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }

        const channel = await Channel.create({
            name,
            serverId,
        });

        return res
            .status(201)
            .json({ channel, message: "Channel created successfully" });
    } catch (error) {
        console.error("Error creating channel:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const updateChannel = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const { name } = req.body;

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID is required" });
        }

        if (!name) {
            return res.status(400).json({ error: "No fields to update" });
        }

        const channel = await Channel.findByPk(channelId);

        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        const updateData = {};
        if (name) updateData.name = name;

        await channel.update(updateData);

        return res
            .status(200)
            .json({ message: "Channel updated successfully", channel });
    } catch (error) {
        console.error("Error updating channel:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteChannel = async (req, res, next) => {
    try {
        const { channelId } = req.params;

        if (!channelId) {
            return res.status(400).json({ error: "Channel not found" });
        }

        const channel = await Channel.findByPk(channelId);

        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        await channel.destroy();

        return res
            .status(200)
            .json({ message: "Channel has been deleted successfully" });
    } catch (error) {
        console.error("Error deleting channel:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
