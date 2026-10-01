const express = require('express');
const assessmentRouter = express.Router();
const userMiddleware = require('../middleware/userAuthentication');
const {
  startAssessment,
  submitAnswer,
  completeAssessment,
  getAssessmentHistory,
  getAssessmentById,
  getRecommendations,
  getProgressStats
} = require('../controllers/assessmentController');

// Assessment Testing Session Endpoints
assessmentRouter.post('/start', userMiddleware, startAssessment);
assessmentRouter.post('/submit-answer', userMiddleware, submitAnswer);
assessmentRouter.post('/:assessmentId/answer', userMiddleware, submitAnswer);
assessmentRouter.post('/complete', userMiddleware, completeAssessment);
assessmentRouter.post('/:assessmentId/complete', userMiddleware, completeAssessment);

// Personalized Recommendations & Roadmap
assessmentRouter.get('/recommendations', userMiddleware, getRecommendations);
assessmentRouter.get('/recommendations/latest', userMiddleware, getRecommendations);

// Progress & Analytics Dashboard
assessmentRouter.get('/stats', userMiddleware, getProgressStats);
assessmentRouter.get('/progress-stats', userMiddleware, getProgressStats);

// Assessment History & Review
assessmentRouter.get('/history', userMiddleware, getAssessmentHistory);
assessmentRouter.get('/details/:id', userMiddleware, getAssessmentById);
assessmentRouter.get('/:id', userMiddleware, getAssessmentById);

module.exports = assessmentRouter;
