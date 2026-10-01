const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redisClient");

const userMiddleware = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        // Fallback to Bearer token in Authorization header
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Authentication token missing" });
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        if (!_id) {
            return res.status(401).json({ success: false, message: "Invalid token payload" });
        }

        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ success: false, message: "User does not exist" });
        }

        // Check if token is blacklisted in Redis (with graceful try-catch if Redis is offline)
        try {
            if (redisClient.isOpen) {
                const isBlocked = await redisClient.exists(`token:${token}`);
                if (isBlocked) {
                    return res.status(401).json({ success: false, message: "Session expired, please log in again" });
                }
            }
        } catch (redisErr) {
            console.warn('[userMiddleware] Redis check bypassed:', redisErr.message);
        }

        req.result = user;
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized: " + err.message });
    }
};

module.exports = userMiddleware;
