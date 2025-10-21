import express from "express";
import {
    saveUserPreference,
    getUserPreference,
} from "../controllers/userPreferenceController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/:serverId/:channelId/preference", isAuth, saveUserPreference);
router.get("/:serverId/preference", isAuth, getUserPreference);

export default router;
