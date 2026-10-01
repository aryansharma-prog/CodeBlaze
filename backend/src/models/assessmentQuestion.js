const mongoose = require('mongoose');
const { Schema } = mongoose;

const assessmentQuestionSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    topic: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    subtopic: {
        type: String,
        required: true,
        index: true
    },
    concepts: [{
        type: String
    }],
    type: {
        type: String,
        enum: ['conceptual', 'code-output', 'complexity', 'bug-hunt', 'fill-blank'],
        default: 'conceptual'
    },
    question: {
        type: String,
        required: true
    },
    codeSnippet: {
        type: String,
        default: ''
    },
    options: [{
        id: { type: String, required: true },
        text: { type: String, required: true }
    }],
    correctOption: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    hints: [{
        type: String
    }],
    expectedTimeSeconds: {
        type: Number,
        default: 120
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

assessmentQuestionSchema.index({ topic: 1, difficulty: 1, subtopic: 1 });

const AssessmentQuestion = mongoose.model('assessmentQuestion', assessmentQuestionSchema);

module.exports = AssessmentQuestion;
