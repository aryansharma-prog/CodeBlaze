const express = require('express');
const aiRouter = express.Router();
const userMiddleware = require('../middleware/userAuthentication');
const {
  chat,
  getHint,
  debugCode,
  explainCode,
  analyzeComplexity,
  analyzeTestcase,
  optimizeCode,
  explainConcept,
  solveDoubt
} = require('../controllers/solveDoubt');

// Optional auth or open AI routes with user context
aiRouter.post('/chat', chat);
aiRouter.post('/doubt', solveDoubt); // Legacy route
aiRouter.post('/hint', getHint);
aiRouter.post('/debug', debugCode);
aiRouter.post('/explain', explainCode);
aiRouter.post('/complexity', analyzeComplexity);
aiRouter.post('/testcase', analyzeTestcase);
aiRouter.post('/optimize', optimizeCode);
aiRouter.post('/concept', explainConcept);

module.exports = aiRouter;