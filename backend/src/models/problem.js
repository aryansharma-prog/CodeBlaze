const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    problemNumber: {
        type: Number,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
        lowercase: true
    },
    topic: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    subtopic: {
        type: String,
        trim: true,
        index: true
    },
    concepts: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    constraints: [{
        type: String
    }],
    examples: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String }
    }],
    visibleTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            explanation: { type: String }
        }
    ],
    hiddenTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true }
        }
    ],
    startCode: [
        {
            language: { type: String, required: true },
            initialCode: { type: String, required: true }
        }
    ],
    referenceSolution: [
        {
            language: { type: String, required: true },
            completeCode: { type: String, required: true }
        }
    ],
    hints: [{
        type: String
    }],
    editorial: {
        approach: { type: String },
        timeComplexity: { type: String },
        spaceComplexity: { type: String },
        hints: [{ type: String }],
        solutionCode: { type: String }
    },
    acceptance: {
        submissionsCount: { type: Number, default: 0 },
        acceptedCount: { type: Number, default: 0 },
        rate: { type: Number, default: 65.0 }
    },
    expectedTimeMinutes: {
        type: Number,
        default: 20
    },
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, {
    timestamps: true
});

// Composite index for fast searching and filtering
problemSchema.index({ difficulty: 1, topic: 1, subtopic: 1 });
problemSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Problem = mongoose.model('problem', problemSchema);

module.exports = Problem;