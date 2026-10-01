const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'problem',
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'js', 'c++', 'cpp', 'java', 'python', 'py'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong', 'tle', 'error', 'compilation_error', 'runtime_error'],
    default: 'pending'
  },
  runtime: {
    type: Number,  // milliseconds
    default: 0
  },
  memory: {
    type: Number,  // kB
    default: 0
  },
  errorMessage: {
    type: String,
    default: ''
  },
  testCasesPassed: {
    type: Number,
    default: 0
  },
  testCasesTotal: {
    type: Number,
    default: 0
  },
  testCaseResults: [{
    testCaseIndex: Number,
    passed: Boolean,
    stdout: String,
    expected: String,
    stderr: String,
    compile_output: String,
    time: Number,
    memory: Number,
    status_id: Number
  }]
}, { 
  timestamps: true
});

submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ createdAt: -1 });

const Submission = mongoose.model('submission', submissionSchema);

module.exports = Submission;