import Membership from "../models/Membership.js";
import Role from "../models/Role.js";

const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            const serverId = req.params.id;

            console.log(userId, serverId);

            if (!userId || !serverId) {
                return res.status(403).json({
                    message: "Forbidden: Missing user or server ID",
                });
            }

            const membership = await Membership.findOne({
                include: { model: Role, as: "role" },
                where: { serverId, userId },
            });

            if (!membership || !allowedRoles.includes(membership.role.name)) {
                return res.status(403).json({
                    message: "Forbidden: Insufficient permissions",
                });
            }

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
};

export default checkRole;
