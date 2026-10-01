const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../middleware/userAuthentication');
const {
  submitCode,
  runCode,
  getAllUserSubmissions,
  getSubmissionById
} = require('../controllers/userSubmission');

// Run code (allows testing before submission)
submitRouter.post('/run/:id', userMiddleware, runCode);
submitRouter.post('/run', userMiddleware, runCode);

// Submit code against full test suite
submitRouter.post('/submit/:id', userMiddleware, submitCode);
submitRouter.post('/:id', userMiddleware, submitCode); // Legacy alias

// Submission history endpoints
submitRouter.get('/history', userMiddleware, getAllUserSubmissions);
submitRouter.get('/details/:id', userMiddleware, getSubmissionById);

module.exports = submitRouter;
