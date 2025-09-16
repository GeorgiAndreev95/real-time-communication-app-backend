import Channel from "../models/Channel";
import Message from "../models/Message";
import Server from "../models/Server";
import User from "../models/User";

export const sendMessage = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const { content } = req.body;
        const userId = req.userId;

        if (!content) {
            return res
                .status(400)
                .json({ error: "Message content is required" });
        }

        const channel = await Channel.findOne();
    } catch (error) {}
};
