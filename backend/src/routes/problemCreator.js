const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminAuthentication");
const userMiddleware = require("../middleware/userAuthentication");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem,
  toggleBookmark,
  getBookmarkedProblems,
  getNote,
  saveNote,
  getDraft,
  saveDraft
} = require("../controllers/userProblem");

// Optional auth helper middleware for public browsing with user context
const optionalAuth = async (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken');
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_KEY);
      req.result = { _id: payload._id };
      req.user = { _id: payload._id };
    }
  } catch (e) {
    // ignore token errors for optional routes
  }
  next();
};

// Admin Problem Management
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

// Public / User Problem Browsing
problemRouter.get("/getAllProblem", optionalAuth, getAllProblem);
problemRouter.get("/search", optionalAuth, getAllProblem);
problemRouter.get("/problemById/:id", optionalAuth, getProblemById);
problemRouter.get("/:id", optionalAuth, getProblemById);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);

// Bookmarks
problemRouter.post("/bookmark", userMiddleware, toggleBookmark);
problemRouter.get("/bookmarks", userMiddleware, getBookmarkedProblems);

// Notes
problemRouter.get("/notes/:problemId", userMiddleware, getNote);
problemRouter.post("/notes", userMiddleware, saveNote);

// Drafts
problemRouter.get("/draft", userMiddleware, getDraft);
problemRouter.get("/draft/:problemId", userMiddleware, getDraft);
problemRouter.post("/draft", userMiddleware, saveDraft);
problemRouter.post("/draft/:problemId", userMiddleware, saveDraft);

module.exports = problemRouter;
