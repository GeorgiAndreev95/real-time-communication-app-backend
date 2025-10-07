import express from "express";

import {
    getServerChannels,
    createChannel,
    updateChannel,
    deleteChannel,
} from "../controllers/channelController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.get("/:serverId/channel", isAuth, getServerChannels);
router.post("/:serverId/channel", isAuth, createChannel);
router.put("/channel/:channelId", isAuth, updateChannel);
router.delete("/channel/:channelId", isAuth, deleteChannel);

export default router;
