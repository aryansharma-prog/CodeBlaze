const Assessment = require('../models/assessment');
const AssessmentQuestion = require('../models/assessmentQuestion');
const Problem = require('../models/problem');
const User = require('../models/user');
const Submission = require('../models/submission');
const assessmentEngine = require('../services/assessmentEngine');
const aiService = require('../services/aiService');

/**
 * Start a new assessment session
 */
const startAssessment = async (req, res) => {
  try {
    const userId = req.result._id;
    const { mode = 'standard', topic = '' } = req.body;

    const user = await User.findById(userId);
    const userWeaknesses = user?.topicPerformance
      ?.filter(t => t.status === 'weak' || t.status === 'needs-practice')
      ?.map(t => t.topic) || [];

    const initialQuestions = await assessmentEngine.generateInitialQuestionSet({
      mode,
      topic,
      userWeaknesses
    });

    const targetTotal = initialQuestions.length;

    const newAssessment = await Assessment.create({
      userId,
      mode,
      topic: topic || '',
      status: 'in-progress',
      totalQuestions: targetTotal,
      questions: [],
      score: 0
    });

    // Return the first question (with options, without correct answer)
    const firstQ = initialQuestions[0];
    const clientFirstQ = {
      _id: firstQ._id,
      title: firstQ.title,
      difficulty: firstQ.difficulty,
      topic: firstQ.topic,
      subtopic: firstQ.subtopic,
      type: firstQ.type,
      question: firstQ.question,
      codeSnippet: firstQ.codeSnippet,
      options: firstQ.options,
      expectedTimeSeconds: firstQ.expectedTimeSeconds,
      hints: firstQ.hints
    };

    return res.status(201).json({
      success: true,
      assessmentId: newAssessment._id,
      totalQuestions: targetTotal,
      currentQuestionIndex: 0,
      question: clientFirstQ
    });

  } catch (err) {
    console.error('[startAssessment] Error:', err);
    return res.status(500).json({ success: false, message: "Failed to start assessment: " + err.message });
  }
};

/**
 * Submit answer for current question and get next question adaptively
 */
const submitAnswer = async (req, res) => {
  try {
    const userId = req.result._id;
    const assessmentId = req.params.assessmentId || req.body.assessmentId || req.params.id;
    let { questionId, userAnswer, selectedOptionIndex, timeSpent = 0, hintsUsed = 0, aiHelpUsed = 0 } = req.body;

    const assessment = await Assessment.findOne({ _id: assessmentId, userId });
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment session not found" });
    }

    if (assessment.status === 'completed') {
      return res.status(400).json({ success: false, message: "Assessment is already completed" });
    }

    const questionDoc = await AssessmentQuestion.findById(questionId);
    if (!questionDoc) {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    // If selectedOptionIndex is provided instead of letter, convert 0 -> A, 1 -> B, etc.
    if (userAnswer === undefined && selectedOptionIndex !== undefined) {
      const letters = ['A', 'B', 'C', 'D'];
      userAnswer = letters[selectedOptionIndex] || 'A';
    }

    // Check correctness
    const isCorrect = String(userAnswer || '').trim().toUpperCase() === String(questionDoc.correctOption || '').trim().toUpperCase();

    // Record answer
    assessment.questions.push({
      questionId: questionDoc._id,
      title: questionDoc.title,
      difficulty: questionDoc.difficulty,
      topic: questionDoc.topic,
      subtopic: questionDoc.subtopic,
      userAnswer,
      isCorrect,
      timeSpent,
      hintsUsed,
      aiHelpUsed
    });

    assessment.timeSpentSeconds = (assessment.timeSpentSeconds || 0) + timeSpent;
    if (isCorrect) {
      assessment.correctCount = (assessment.correctCount || 0) + 1;
    }

    await assessment.save();

    const isLastQuestion = assessment.questions.length >= assessment.totalQuestions;

    if (isLastQuestion) {
      return res.status(200).json({
        success: true,
        isCorrect,
        correctOption: questionDoc.correctOption,
        explanation: questionDoc.explanation,
        isCompleted: true,
        message: "All questions completed! Please view final results."
      });
    }

    // Fetch next adaptive question
    const answeredIds = assessment.questions.map(q => q.questionId);
    const nextQ = await assessmentEngine.getNextAdaptiveQuestion({ assessment, answeredQuestionIds: answeredIds });

    let clientNextQ = null;
    if (nextQ) {
      clientNextQ = {
        _id: nextQ._id,
        title: nextQ.title,
        difficulty: nextQ.difficulty,
        topic: nextQ.topic,
        subtopic: nextQ.subtopic,
        type: nextQ.type,
        question: nextQ.question,
        codeSnippet: nextQ.codeSnippet,
        options: nextQ.options,
        expectedTimeSeconds: nextQ.expectedTimeSeconds,
        hints: nextQ.hints
      };
    }

    return res.status(200).json({
      success: true,
      isCorrect,
      correctOption: questionDoc.correctOption,
      explanation: questionDoc.explanation,
      isCompleted: false,
      currentQuestionIndex: assessment.questions.length,
      totalQuestions: assessment.totalQuestions,
      nextQuestion: clientNextQ
    });

  } catch (err) {
    console.error('[submitAnswer] Error:', err);
    return res.status(500).json({ success: false, message: "Error submitting answer: " + err.message });
  }
};

/**
 * Complete Assessment, calculate performance metrics, and update user recommendations
 */
const completeAssessment = async (req, res) => {
  try {
    const userId = req.result._id;
    const assessmentId = req.params.assessmentId || req.body.assessmentId || req.params.id;

    const assessment = await Assessment.findOne({ _id: assessmentId, userId });
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }

    // Calculate score, topic breakdown, weak/strong subtopics
    const performance = assessmentEngine.calculatePerformance(assessment.questions);

    // Generate Roadmap & Recommended Problems
    const recommendations = await assessmentEngine.generateLearningRoadmap({
      weakTopics: performance.weakTopics,
      weakSubtopics: performance.weakSubtopics,
      topicBreakdown: performance.topicBreakdown
    });

    // Generate AI Coach Summary
    const aiAnalysis = await aiService.analyzeAssessment({
      score: performance.overallScore,
      topicBreakdown: performance.topicBreakdown,
      weakTopics: performance.weakTopics,
      weakSubtopics: performance.weakSubtopics,
      strongTopics: performance.strongTopics
    });

    assessment.status = 'completed';
    assessment.score = performance.overallScore;
    assessment.topicBreakdown = performance.topicBreakdown;
    assessment.weakTopics = performance.weakTopics;
    assessment.weakSubtopics = performance.weakSubtopics;
    assessment.strongTopics = performance.strongTopics;
    assessment.recommendations = recommendations;
    assessment.aiAnalysis = aiAnalysis;
    assessment.completedAt = new Date();

    await assessment.save();

    // Update user's persistent topic performance in User document
    const user = await User.findById(userId);
    if (user) {
      for (const tb of performance.topicBreakdown) {
        const existingIdx = user.topicPerformance?.findIndex(tp => tp.topic === tb.topic);
        const entry = {
          topic: tb.topic,
          score: tb.score,
          status: tb.status,
          weakSubtopics: tb.weakSubtopics,
          strongSubtopics: tb.strongSubtopics,
          lastTestedAt: new Date()
        };

        if (existingIdx > -1) {
          user.topicPerformance[existingIdx] = { ...user.topicPerformance[existingIdx].toObject(), ...entry };
        } else {
          user.topicPerformance.push(entry);
        }
      }
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: assessment
    });

  } catch (err) {
    console.error('[completeAssessment] Error:', err);
    return res.status(500).json({ success: false, message: "Error finalizing assessment: " + err.message });
  }
};

/**
 * Get user's assessment history
 */
const getAssessmentHistory = async (req, res) => {
  try {
    const userId = req.result._id;
    const history = await Assessment.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .select('_id mode topic score totalQuestions correctCount timeSpentSeconds weakTopics strongTopics completedAt')
      .lean();

    return res.status(200).json({ success: true, data: history });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get assessment details by ID
 */
const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.result._id;
    const assessment = await Assessment.findOne({ _id: id, userId }).populate('questions.questionId');
    if (!assessment) {
      return res.status(404).json({ success: false, message: "Assessment not found" });
    }
    return res.status(200).json({ success: true, data: assessment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get personalized recommendations & learning roadmap
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.result._id;

    // 1. Get latest completed assessment
    const latestAssessment = await Assessment.findOne({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .lean();

    // 2. Fallback: if no assessment yet, generate initial roadmap based on all problems & foundational topics
    if (!latestAssessment) {
      const defaultProblems = await Problem.find()
        .select('_id title difficulty topic subtopic')
        .limit(6)
        .lean();

      return res.status(200).json({
        success: true,
        hasAssessment: false,
        data: {
          overallScore: 0,
          weakTopics: ["Arrays", "Sliding Window", "Dynamic Programming"],
          weakSubtopics: ["Array Traversal", "Two Pointers", "State Transitions"],
          strongTopics: [],
          topicBreakdown: [
            { topic: "arrays", score: 50, status: "needs-practice", weakSubtopics: ["Prefix Sum", "Kadane"] },
            { topic: "sliding-window", score: 35, status: "weak", weakSubtopics: ["Variable Window", "Frequency Window"] },
            { topic: "dp", score: 30, status: "weak", weakSubtopics: ["1D DP", "State Transitions"] }
          ],
          recommendations: [
            {
              topic: "arrays",
              subtopic: "Prefix Sum & Kadane",
              priority: 1,
              reason: "Take an assessment test to personalize your weaknesses, or start with array fundamentals.",
              learningSteps: [
                "1. Study continuous subarray scanning.",
                "2. Practice 2 Sum and Maximum Subarray.",
                "3. Take a Quick Assessment to measure progress."
              ],
              recommendedProblems: defaultProblems.map(p => ({
                problemId: p._id,
                title: p.title,
                difficulty: p.difficulty,
                topic: p.topic,
                subtopic: p.subtopic || p.topic,
                reason: "Recommended starting problem"
              }))
            }
          ],
          aiAnalysis: {
            summary: "Welcome to CodeBlaze Personalized DSA Coach! Take a 5-minute Quick Assessment to unlock precise weakness diagnostics.",
            strengths: ["Ready to learn"],
            actionPlan: ["Take your first DSA Assessment to generate a personalized learning roadmap."]
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      hasAssessment: true,
      data: latestAssessment
    });

  } catch (err) {
    console.error('[getRecommendations] Error:', err);
    return res.status(500).json({ success: false, message: "Error fetching recommendations: " + err.message });
  }
};

/**
 * Get comprehensive user progress & statistics
 */
const getProgressStats = async (req, res) => {
  try {
    const userId = req.result._id;

    const [user, submissions, totalProblems] = await Promise.all([
      User.findById(userId).populate('problemSolved', 'difficulty topic subtopic'),
      Submission.find({ userId }).sort({ createdAt: -1 }).lean(),
      Problem.countDocuments()
    ]);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const solvedList = user.problemSolved || [];
    const solvedCount = solvedList.length;

    let easySolved = 0;
    let mediumSolved = 0;
    let hardSolved = 0;

    const topicSolvedMap = {};

    for (const p of solvedList) {
      const diff = (p.difficulty || 'easy').toLowerCase();
      if (diff === 'easy') easySolved++;
      else if (diff === 'medium') mediumSolved++;
      else if (diff === 'hard') hardSolved++;

      const t = (p.topic || 'other').toLowerCase();
      topicSolvedMap[t] = (topicSolvedMap[t] || 0) + 1;
    }

    // Acceptance rate from real submissions
    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(s => s.status === 'accepted').length;
    const acceptanceRate = totalSubmissions > 0
      ? parseFloat(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1))
      : 0;

    // Real Submission Activity Heatmap (last 365 days)
    const activityMap = {};
    for (const sub of submissions) {
      if (sub.createdAt) {
        const d = new Date(sub.createdAt).toISOString().split('T')[0];
        activityMap[d] = (activityMap[d] || 0) + 1;
      }
    }

    // Build standard list of topics with mastery percentages
    const ALL_TOPICS = [
      'arrays', 'strings', 'hashing', 'two-pointers', 'sliding-window',
      'stack', 'queue', 'linked-list', 'binary-search', 'recursion',
      'backtracking', 'trees', 'bst', 'heap', 'greedy', 'graphs', 'dp',
      'bit-manipulation', 'trie', 'union-find'
    ];

    const topicStats = ALL_TOPICS.map(topic => {
      const solvedInTopic = topicSolvedMap[topic] || 0;
      const userPerf = user.topicPerformance?.find(tp => tp.topic.toLowerCase() === topic);
      const score = userPerf ? userPerf.score : Math.min(100, solvedInTopic * 20);

      let status = 'needs-practice';
      if (score >= 80) status = 'strong';
      else if (score >= 60) status = 'good';
      else if (score < 40) status = 'weak';

      return {
        topic,
        name: topic.replace('-', ' ').toUpperCase(),
        solvedCount: solvedInTopic,
        score,
        status,
        weakSubtopics: userPerf?.weakSubtopics || [],
        strongSubtopics: userPerf?.strongSubtopics || []
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalProblems,
        solvedCount,
        easySolved,
        mediumSolved,
        hardSolved,
        totalSubmissions,
        acceptedSubmissions,
        acceptanceRate,
        streak: user.streak || 0,
        activityMap,
        topicStats,
        recentSubmissions: submissions.slice(0, 10)
      }
    });

  } catch (err) {
    console.error('[getProgressStats] Error:', err);
    return res.status(500).json({ success: false, message: "Error fetching progress: " + err.message });
  }
};

module.exports = {
  startAssessment,
  submitAnswer,
  completeAssessment,
  getAssessmentHistory,
  getAssessmentById,
  getRecommendations,
  getProgressStats
};
