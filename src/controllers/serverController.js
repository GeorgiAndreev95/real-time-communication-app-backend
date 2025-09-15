import Server from "../models/Server";

export const getUserServers = async (req, res, next) => {
    try {
        const userServers = await Server.findAll({
            where: { userId: req.userId },
        });
        return res.status(200).json({
            userServers,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createServer = async (req, res, next) => {
    const { name } = req.body;
    const userId = req.userId;

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Attached file is not an image.",
            });
        }

        const imageUrl = `/images/${req.file.filename}`;

        const server = await Server.create({
            name,
            image: imageUrl,
            userId,
        });

        console.log(req.body);
        return res.status(201).json({
            server,
        });
    } catch (error) {
        if (req.file) {
            deleteFile(`/images/${req.file.filename}`);
        }

        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateServer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const server = await Server.findByPk(id);

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const updates = {
            name,
        };

        if (req.file) {
            const newImageUrl = `/images/${req.file.filename}`;

            if (server.image && server.image !== newImageUrl) {
                deleteFile(server.image);
            }

            updates.image = newImageUrl;
        }

        await server.update(updates);

        return res.status(200).json({ message: "Server updated", server });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteServer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const server = await Server.findByPk(id);

        if (!server) {
            return res
                .status(404)
                .json({ message: "Server with this ID not found." });
        }

        await server.destroy();
        return res.status(200).json({
            message: `Server with id: ${req.params.id} deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
