import EnemyUnit from "../models/EnemyUnit.js";
import deleteFile from "../../utils/file.js";

export const getEnemyUnit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const enemyUnit = await EnemyUnit.findByPk(id);
        return res.status(200).json({
            enemyUnit,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getEnemyUnits = async (req, res, next) => {
    try {
        const enemyUnits = await EnemyUnit.findAll();
        return res.status(200).json({
            enemyUnits,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createEnemyUnit = async (req, res, next) => {
    const {
        name,
        description,
        spawning,
        behavior,
        health,
        damage,
        minimumDifficulty,
        armor,
        factionId,
    } = req.body;
    const userId = req.userId;

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Attached file is not an image.",
            });
        }

        const imageUrl = `/images/${req.file.filename}`;

        const enemyUnit = await EnemyUnit.create({
            name,
            description,
            spawning,
            behavior,
            health,
            damage,
            minimumDifficulty,
            armor,
            factionId,
            image: imageUrl,
            userId,
        });
        console.log(req.body);
        return res.status(201).json({
            enemyUnit,
        });
    } catch (error) {
        if (req.file) {
            deleteFile(`/images/${req.file.filename}`);
        }

        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateEnemyUnit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            spawning,
            behavior,
            health,
            damage,
            minimumDifficulty,
            armor,
            factionId,
        } = req.body;

        const enemyUnit = await EnemyUnit.findByPk(id);

        if (!enemyUnit) {
            return res.status(404).json({ message: "Enemy unit not found" });
        }

        const updates = {
            name,
            description,
            spawning,
            behavior,
            health,
            damage,
            minimumDifficulty,
            armor,
            factionId,
        };

        if (req.file) {
            const newImageUrl = `/images/${req.file.filename}`;

            if (enemyUnit.image && enemyUnit.image !== newImageUrl) {
                deleteFile(enemyUnit.image);
            }

            updates.image = newImageUrl;
        }

        await enemyUnit.update(updates);

        return res
            .status(200)
            .json({ message: "Enemy unit updated", enemyUnit });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteEnemyUnit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const enemyUnit = await EnemyUnit.findByPk(id);

        if (!enemyUnit) {
            return res
                .status(404)
                .json({ message: "Enemy unit with this ID not found." });
        }

        await enemyUnit.destroy();
        return res.status(200).json({
            message: `Unit with id: ${req.params.id} deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
