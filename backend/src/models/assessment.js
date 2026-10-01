const mongoose = require('mongoose');
const { Schema } = mongoose;

const assessmentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    mode: {
        type: String,
        enum: ['quick', 'standard', 'deep', 'topic'],
        default: 'standard'
    },
    topic: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'in-progress'
    },
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 10
    },
    correctCount: {
        type: Number,
        default: 0
    },
    timeSpentSeconds: {
        type: Number,
        default: 0
    },
    questions: [{
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'assessmentQuestion'
        },
        title: String,
        difficulty: String,
        topic: String,
        subtopic: String,
        userAnswer: Schema.Types.Mixed,
        isCorrect: Boolean,
        timeSpent: Number,
        hintsUsed: { type: Number, default: 0 },
        aiHelpUsed: { type: Number, default: 0 }
    }],
    topicBreakdown: [{
        topic: String,
        subtopic: String,
        score: Number,
        status: { type: String, enum: ['weak', 'needs-practice', 'good', 'strong'] },
        totalQuestions: Number,
        correctQuestions: Number,
        weakSubtopics: [String],
        strongSubtopics: [String]
    }],
    weakTopics: [String],
    weakSubtopics: [String],
    strongTopics: [String],
    recommendations: [{
        topic: String,
        subtopic: String,
        priority: Number,
        reason: String,
        learningSteps: [String],
        recommendedProblems: [{
            problemId: { type: Schema.Types.ObjectId, ref: 'problem' },
            title: String,
            difficulty: String,
            topic: String,
            subtopic: String,
            reason: String
        }]
    }],
    aiAnalysis: {
        summary: String,
        strengths: [String],
        actionPlan: [String]
    },
    completedAt: Date
}, {
    timestamps: true
});

assessmentSchema.index({ userId: 1, createdAt: -1 });

const Assessment = mongoose.model('assessment', assessmentSchema);

module.exports = Assessment;
