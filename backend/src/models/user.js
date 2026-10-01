const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 30,
        trim: true
    },
    lastName: {
        type: String,
        maxLength: 30,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    age: {
        type: Number,
        min: 6,
        max: 100
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    problemSolved: [{
        type: Schema.Types.ObjectId,
        ref: 'problem'
    }],
    bookmarkedProblems: [{
        type: Schema.Types.ObjectId,
        ref: 'problem'
    }],
    streak: {
        type: Number,
        default: 0
    },
    lastSolvedDate: {
        type: Date
    },
    topicPerformance: [{
        topic: { type: String, required: true },
        score: { type: Number, default: 0 },
        status: { type: String, enum: ['weak', 'needs-practice', 'good', 'strong'], default: 'needs-practice' },
        solvedCount: { type: Number, default: 0 },
        attemptCount: { type: Number, default: 0 },
        weakSubtopics: [String],
        strongSubtopics: [String],
        lastTestedAt: { type: Date, default: Date.now }
    }],
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// userSchema index handled by unique: true on emailId
const User = mongoose.model("user", userSchema);

module.exports = User;
