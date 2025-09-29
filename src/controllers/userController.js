import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import User from "../models/User.js";
import deleteFile from "../../utils/file.js";

export const signupUser = async (req, res, next) => {
    const { email, username, password, confirmPassword } = req.body;
    const errors = validationResult(req);
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

    const existingUser = await User.findOne({ where: { email: email } });
    const existingUsername = await User.findOne({
        where: { username: username },
    });

    if (existingUser) {
        return res.status(400).json({
            message: "A user with this email already exists.",
        });
    }

    if (existingUsername) {
        return res.status(400).json({
            message: "This username is already taken.",
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed.",
            errors: errors.array(),
            oldInput: {
                email,
                username,
                password,
                confirmPassword,
            },
        });
    }

    try {
        const hashedPw = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            email,
            username,
            password: hashedPw,
            profilePicture: imageUrl,
        });

        res.status(201).json({
            message: "User created",
            user: {
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.log(error);

        if (req.file) {
            deleteFile(imageUrl);
        }

        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed.",
            errors: errors.array(),
        });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res
                .status(404)
                .json({ message: "Incorrect username or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!user || !isMatch) {
            return res.status(401).json({
                message: "Incorrect username or password.",
            });
        }

        const token = jwt.sign(
            { email: user.email, id: user.id, role: user.role },
            process.env.JWT_SECRET
            // { expiresIn: "12h" }
        );

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
