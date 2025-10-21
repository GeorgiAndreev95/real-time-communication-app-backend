import UserServerPreference from "../models/UserServerPreference.js";

// Save or update last selected channel for a user in a given server

export const saveUserPreference = async (req, res) => {
    try {
        const userId = req.userId;
        const { serverId, channelId } = req.params;

        if (!serverId || !channelId) {
            return res
                .status(400)
                .json({ message: "serverId and channelId are required" });
        }

        const [pref, created] = await UserServerPreference.findOrCreate({
            where: { userId, serverId },
            defaults: { lastChannelId: channelId },
        });

        if (!created && pref.lastChannelId !== channelId) {
            pref.lastChannelId = channelId;
            await pref.save();
        }

        res.status(200).json(pref);
    } catch (error) {
        console.error("Error saving preference:", error);
        res.status(500).json({ message: "Error saving preference" });
    }
};

// Get last selected channel for a user in a given server

export const getUserPreference = async (req, res) => {
    try {
        const userId = req.userId;
        const { serverId } = req.params;

        const pref = await UserServerPreference.findOne({
            where: { userId, serverId },
        });

        res.status(200).json({ lastChannelId: pref?.lastChannelId || null });
    } catch (error) {
        console.error("Error fetching preference:", error);
        res.status(500).json({ message: "Error fetching preference" });
    }
};
