const redisClient = require('../config/redisClient');
const User = require("../models/user");
const Submission = require("../models/submission");
const Problem = require("../models/problem");
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const getCookieOptions = () => {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
};

const register = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, lastName, emailId, password, age } = req.body;

        const existingUser = await User.findOne({ emailId: emailId.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName: firstName.trim(),
            lastName: lastName ? lastName.trim() : '',
            emailId: emailId.toLowerCase().trim(),
            password: hashedPassword,
            age: age ? Number(age) : undefined,
            role: 'user'
        });

        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, getCookieOptions());

        return res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                role: user.role,
                problemSolved: user.problemSolved || [],
                streak: user.streak || 0
            },
            message: "Account created successfully"
        });
    } catch (err) {
        console.error("Register Error:", err);
        return res.status(400).json({ success: false, message: err.message || "Registration failed" });
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ emailId: emailId.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, getCookieOptions());

        return res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                role: user.role,
                problemSolved: user.problemSolved || [],
                bookmarkedProblems: user.bookmarkedProblems || [],
                streak: user.streak || 0
            },
            message: "Logged in successfully"
        });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};

const logout = async (req, res) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

        if (token) {
            try {
                if (redisClient.isOpen) {
                    const payload = jwt.decode(token);
                    if (payload && payload.exp) {
                        await redisClient.set(`token:${token}`, 'Blocked');
                        await redisClient.expireAt(`token:${token}`, payload.exp);
                    }
                }
            } catch (redisErr) {
                console.warn('[logout] Redis blacklisting bypassed:', redisErr.message);
            }
        }

        res.cookie("token", "", { ...getCookieOptions(), maxAge: 0 });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        res.cookie("token", "", { ...getCookieOptions(), maxAge: 0 });
        return res.status(200).json({ success: true, message: "Logged out" });
    }
};

const getProfile = async (req, res) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        try {
            if (redisClient.isOpen) {
                const blocked = await redisClient.get(`token:${token}`);
                if (blocked) {
                    return res.status(401).json({ success: false, message: "Session expired. Please login again." });
                }
            }
        } catch (rErr) {
            // Redis error bypass
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(payload._id)
            .select("-password")
            .populate('problemSolved', 'title difficulty topic problemNumber');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user,
            data: user
        });
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid session or token: " + err.message });
    }
};

const adminRegister = async (req, res) => {
    try {
        validate(req.body);
        const { firstName, lastName, emailId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            emailId: emailId.toLowerCase().trim(),
            password: hashedPassword,
            role: 'admin'
        });

        const token = jwt.sign(
            { _id: user._id, emailId: user.emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, getCookieOptions());
        return res.status(201).json({ success: true, message: "Admin registered successfully", token });
    } catch (err) {
        return res.status(400).json({ success: false, message: "Error: " + err.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        await Submission.deleteMany({ userId });
        res.cookie("token", "", { ...getCookieOptions(), maxAge: 0 });
        return res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = {
    register,
    login,
    logout,
    adminRegister,
    getProfile,
    deleteProfile
};
