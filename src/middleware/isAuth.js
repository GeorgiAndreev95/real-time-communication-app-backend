import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default isAuth;
