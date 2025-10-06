import express from "express";

import {
    getUserServers,
    createServer,
    updateServer,
    deleteServer,
} from "../controllers/serverController.js";
import isAuth from "../middleware/isAuth.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

router.get("/server", isAuth, getUserServers);
router.post("/server", isAuth, createServer);
router.put("/server/:id", isAuth, updateServer);
router.delete("/server/:id", isAuth, checkRole(["owner"]), deleteServer);

export default router;
