import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({ email: decoded.email })
            .select("email fullName profilePic publicKey status lastSeen");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user.email;
        req.authUser = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired session" });
    }
};
