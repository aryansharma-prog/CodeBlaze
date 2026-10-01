const aiService = require('../services/aiService');

const chat = async (req, res) => {
  try {
    const { messages, title, description, code, language, errors, userWeaknesses } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Messages array is required' });
    }

    const reply = await aiService.chatWithMentor({
      messages,
      title,
      description,
      code,
      language,
      errors,
      userWeaknesses
    });

    return res.status(200).json({
      success: true,
      message: reply.content,
      data: reply
    });
  } catch (error) {
    console.error('[BlazeAI Controller] chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'AI Mentor is temporarily unavailable. Your code is still saved.',
      error: error.message
    });
  }
};

const getHint = async (req, res) => {
  try {
    const { title, description, code, language, userWeaknesses } = req.body;
    const data = await aiService.generateHint({ title, description, code, language, userWeaknesses });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[BlazeAI Controller] getHint error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const debugCode = async (req, res) => {
  try {
    const { title, description, code, language, testcase, stdout, stderr, compileError, runtimeError } = req.body;
    const data = await aiService.debugCode({
      title,
      description,
      code,
      language,
      testcase,
      stdout,
      stderr,
      compileError,
      runtimeError
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[BlazeAI Controller] debugCode error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const explainCode = async (req, res) => {
  try {
    const { title, description, code, language } = req.body;
    const data = await aiService.explainCode({ title, description, code, language });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[BlazeAI Controller] explainCode error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const analyzeComplexity = async (req, res) => {
  try {
    const { title, description, code, language } = req.body;
    const data = await aiService.analyzeComplexity({ title, description, code, language });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[BlazeAI Controller] analyzeComplexity error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const analyzeTestcase = async (req, res) => {
  try {
    const { title, description, code, language, testcase, expectedOutput, actualOutput } = req.body;
    const data = await aiService.analyzeTestcase({
      title,
      description,
      code,
      language,
      testcase,
      expectedOutput,
      actualOutput
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[BlazeAI Controller] analyzeTestcase error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const optimizeCode = async (req, res) => {
  try {
    const { title, description, code, language } = req.body;
    const data = await aiService.optimizeCode({ title, description, code, language });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[BlazeAI Controller] optimizeCode error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const explainConcept = async (req, res) => {
  try {
    const { concept, topic, subtopic } = req.body;
    const data = await aiService.explainConcept({ concept, topic, subtopic });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[BlazeAI Controller] explainConcept error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Legacy alias to ensure backwards compatibility
const solveDoubt = chat;

module.exports = {
  chat,
  getHint,
  debugCode,
  explainCode,
  analyzeComplexity,
  analyzeTestcase,
  optimizeCode,
  explainConcept,
  solveDoubt
};