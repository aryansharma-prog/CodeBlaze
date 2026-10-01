const mongoose = require('mongoose');
const { Schema } = mongoose;

const draftSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

draftSchema.index({ userId: 1, problemId: 1, language: 1 }, { unique: true });

const Draft = mongoose.model('draft', draftSchema);

module.exports = Draft;
