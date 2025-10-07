import express from "express";

import {
    createMessage,
    getMessage,
    updateMessage,
    deleteMessage,
} from "../controllers/messageController.js";

import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/channel/:channelId/message", isAuth, createMessage);
router.get("/channel/:channelId/message", isAuth, getMessage);
router.put("/message/:messageId", isAuth, updateMessage);
router.delete("/message/:messageId", isAuth, deleteMessage);

export default router;
