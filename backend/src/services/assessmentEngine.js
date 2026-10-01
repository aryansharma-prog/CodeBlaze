const AssessmentQuestion = require('../models/assessmentQuestion');
const Problem = require('../models/problem');
const aiService = require('./aiService');

class AssessmentEngine {
  /**
   * Select initial batch of questions adaptively based on mode or target topic
   */
  async generateInitialQuestionSet({ mode = 'standard', topic = null, userWeaknesses = [] }) {
    let targetCount = 10;
    if (mode === 'quick') targetCount = 5;
    if (mode === 'deep') targetCount = 20;

    const query = {};
    if (topic && topic !== 'all') {
      query.topic = topic.toLowerCase();
    }

    // Fetch pool of candidate questions
    const allQuestions = await AssessmentQuestion.find(query).lean();
    if (!allQuestions || allQuestions.length === 0) {
      throw new Error(`No assessment questions found for topic: ${topic || 'all'}`);
    }

    // Shuffle pool
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());

    // If user has known weaknesses, prioritize questions matching weak topics/subtopics
    if (userWeaknesses && userWeaknesses.length > 0) {
      shuffled.sort((a, b) => {
        const aMatch = userWeaknesses.some(w => a.topic === w || a.subtopic === w);
        const bMatch = userWeaknesses.some(w => b.topic === w || b.subtopic === w);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }

    // Difficulty distribution: ~40% Easy, ~45% Medium, ~15% Hard
    const easyCount = Math.max(1, Math.round(targetCount * 0.4));
    const hardCount = Math.max(1, Math.round(targetCount * 0.15));
    const medCount = targetCount - easyCount - hardCount;

    const easyPool = shuffled.filter(q => q.difficulty === 'easy');
    const medPool = shuffled.filter(q => q.difficulty === 'medium');
    const hardPool = shuffled.filter(q => q.difficulty === 'hard');

    const selected = [
      ...easyPool.slice(0, easyCount),
      ...medPool.slice(0, medCount),
      ...hardPool.slice(0, hardCount)
    ];

    // Fallback fill if some pool didn't have enough
    while (selected.length < targetCount && shuffled.length > selected.length) {
      const remaining = shuffled.find(q => !selected.some(s => s._id.toString() === q._id.toString()));
      if (remaining) selected.push(remaining);
      else break;
    }

    return selected.slice(0, targetCount);
  }

  /**
   * Get next adaptive question based on current performance
   */
  async getNextAdaptiveQuestion({ assessment, answeredQuestionIds = [] }) {
    const lastAnswer = assessment.questions[assessment.questions.length - 1];
    let nextDifficulty = 'medium';
    let targetSubtopic = null;

    if (lastAnswer) {
      if (lastAnswer.isCorrect) {
        // Step up difficulty or expand topic
        nextDifficulty = lastAnswer.difficulty === 'easy' ? 'medium' : 'hard';
      } else {
        // Probe deeper into the failed subtopic with easier or fundamental question
        nextDifficulty = lastAnswer.difficulty === 'hard' ? 'medium' : 'easy';
        targetSubtopic = lastAnswer.subtopic;
      }
    }

    const query = {
      _id: { $nin: answeredQuestionIds }
    };

    if (assessment.topic && assessment.topic !== 'all') {
      query.topic = assessment.topic;
    }

    if (targetSubtopic) {
      query.subtopic = targetSubtopic;
    }

    query.difficulty = nextDifficulty;

    let candidate = await AssessmentQuestion.findOne(query).lean();
    if (!candidate) {
      // Relax subtopic/difficulty filter
      delete query.subtopic;
      delete query.difficulty;
      candidate = await AssessmentQuestion.findOne(query).lean();
    }

    return candidate;
  }

  /**
   * Calculate 0-100 Topic Performance & Subtopic Mastery
   */
  calculatePerformance(questions) {
    const topicMap = {};

    for (const item of questions) {
      const topic = item.topic || 'general';
      const subtopic = item.subtopic || 'core';
      const isCorrect = !!item.isCorrect;
      const difficulty = item.difficulty || 'medium';

      if (!topicMap[topic]) {
        topicMap[topic] = {
          total: 0,
          correct: 0,
          earnedPoints: 0,
          maxPossiblePoints: 0,
          subtopics: {}
        };
      }

      if (!topicMap[topic].subtopics[subtopic]) {
        topicMap[topic].subtopics[subtopic] = { total: 0, correct: 0 };
      }

      topicMap[topic].total++;
      topicMap[topic].subtopics[subtopic].total++;

      let maxPoints = 15;
      if (difficulty === 'easy') maxPoints = 10;
      if (difficulty === 'hard') maxPoints = 25;

      topicMap[topic].maxPossiblePoints += maxPoints;

      if (isCorrect) {
        topicMap[topic].correct++;
        topicMap[topic].subtopics[subtopic].correct++;

        // Deduction for hints used & AI help
        const hintPenalty = (item.hintsUsed || 0) * 2;
        const aiPenalty = (item.aiHelpUsed || 0) * 3;
        const earned = Math.max(2, maxPoints - hintPenalty - aiPenalty);
        topicMap[topic].earnedPoints += earned;
      }
    }

    const topicBreakdown = [];
    const weakTopics = [];
    const strongTopics = [];
    const weakSubtopics = [];
    const strongSubtopics = [];

    let overallEarned = 0;
    let overallMax = 0;

    for (const [topic, data] of Object.entries(topicMap)) {
      const score = data.maxPossiblePoints > 0
        ? Math.round((data.earnedPoints / data.maxPossiblePoints) * 100)
        : 0;

      overallEarned += data.earnedPoints;
      overallMax += data.maxPossiblePoints;

      let status = 'needs-practice';
      if (score >= 80) status = 'strong';
      else if (score >= 60) status = 'good';
      else if (score < 40) status = 'weak';

      const topicWeakSub = [];
      const topicStrongSub = [];

      for (const [sub, subData] of Object.entries(data.subtopics)) {
        const subRate = subData.total > 0 ? (subData.correct / subData.total) : 0;
        if (subRate < 0.5) {
          topicWeakSub.push(sub);
          weakSubtopics.push(`${topic}: ${sub}`);
        } else {
          topicStrongSub.push(sub);
          strongSubtopics.push(`${topic}: ${sub}`);
        }
      }

      if (status === 'weak' || status === 'needs-practice') {
        weakTopics.push(topic);
      } else {
        strongTopics.push(topic);
      }

      topicBreakdown.push({
        topic,
        score,
        status,
        totalQuestions: data.total,
        correctQuestions: data.correct,
        weakSubtopics: topicWeakSub,
        strongSubtopics: topicStrongSub
      });
    }

    const overallScore = overallMax > 0 ? Math.round((overallEarned / overallMax) * 100) : 0;

    return {
      overallScore,
      topicBreakdown,
      weakTopics,
      weakSubtopics,
      strongTopics,
      strongSubtopics
    };
  }

  /**
   * Generate Recommended Problems and Learning Steps matching Weaknesses
   */
  async generateLearningRoadmap({ weakTopics, weakSubtopics, topicBreakdown }) {
    const recommendations = [];

    for (const tb of topicBreakdown) {
      if (tb.status === 'weak' || tb.status === 'needs-practice') {
        // Find matching problems from database
        const matchingProblems = await Problem.find({
          $or: [
            { topic: tb.topic },
            { subtopic: { $in: tb.weakSubtopics } }
          ]
        })
          .select('_id title difficulty topic subtopic')
          .limit(4)
          .lean();

        const learningSteps = [
          `1. Review core definitions and space-time complexity of ${tb.topic}.`,
          `2. Practice fundamental ${tb.weakSubtopics[0] || tb.topic} patterns.`,
          `3. Solve medium difficulty problems with time constraints.`,
          `4. Verify edge cases (empty arrays, boundary limits, duplicates).`
        ];

        recommendations.push({
          topic: tb.topic,
          subtopic: tb.weakSubtopics[0] || 'Fundamentals',
          priority: tb.status === 'weak' ? 1 : 2,
          reason: `Recommended because you struggled with ${tb.weakSubtopics.join(', ') || tb.topic} questions during assessment.`,
          learningSteps,
          recommendedProblems: matchingProblems.map(p => ({
            problemId: p._id,
            title: p.title,
            difficulty: p.difficulty,
            topic: p.topic,
            subtopic: p.subtopic || tb.topic,
            reason: `Direct practice for ${p.subtopic || p.topic} mastery`
          }))
        });
      }
    }

    // Sort by priority (weakest first)
    recommendations.sort((a, b) => a.priority - b.priority);

    return recommendations;
  }
}

module.exports = new AssessmentEngine();
