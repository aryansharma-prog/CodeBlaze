const express = require('express');
const { register, login, logout, adminRegister, getProfile, deleteProfile } = require("../controllers/userAuthent");
const userMiddleware = require('../middleware/userAuthentication');
const adminMiddleware = require('../middleware/adminAuthentication');
const authRouter = express.Router();

// Register & Login
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout); // Open logout to always clear cookie
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.get('/getProfile', getProfile);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

// Check current session
authRouter.get('/check', userMiddleware, async (req, res) => {
    const user = req.result;
    const reply = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        role: user.role,
        problemSolved: user.problemSolved || [],
        bookmarkedProblems: user.bookmarkedProblems || [],
        streak: user.streak || 0
    };

    return res.status(200).json({
        success: true,
        user: reply,
        message: "Valid User"
    });
});

module.exports = authRouter;
