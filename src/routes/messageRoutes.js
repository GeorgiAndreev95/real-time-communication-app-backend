import express from "express";

import {
    createMessage,
    getMessage,
    deleteMessage,
} from "../controllers/messageController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/channel/:channelId/message", isAuth, createMessage);
router.get("/channel/:channelId/message", isAuth, getMessage);
router.delete("/message/:messageId", isAuth, deleteMessage);

export default router;
