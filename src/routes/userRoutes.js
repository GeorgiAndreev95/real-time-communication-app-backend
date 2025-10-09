import express from "express";
import { body } from "express-validator";

import User from "../models/User.js";
import { signupUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post(
    "/signup",
    [
        body("email")
            .isEmail()
            .withMessage("Please enter a valid email.")
            .normalizeEmail()
            .custom(async (value) => {
                const existingUser = await User.findOne({
                    where: { email: value },
                });
                if (existingUser) {
                    throw new Error("A user with this email already exists.");
                }
                return true;
            }),
        body("username")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Username too short.")
            .custom(async (value) => {
                const existingUsername = await User.findOne({
                    where: { username: value },
                });
                if (existingUsername) {
                    throw new Error("This username is already taken.");
                }
                return true;
            }),
        body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Password too short."),
        body("confirmPassword")
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords do not match.");
                }
                return true;
            }),
    ],
    signupUser
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please enter a valid email."),
        body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Please enter a valid password."),
    ],
    loginUser
);

export default router;
