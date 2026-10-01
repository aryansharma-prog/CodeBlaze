const q1 = require('./assessmentQuestionsData');
const q2 = require('./assessmentQuestionsDataPart2');
const q3 = require('./assessmentQuestionsDataPart3');

const ALL_ASSESSMENT_QUESTIONS = [...q1, ...q2, ...q3];

console.log(`[Assessment Bank] Total questions loaded: ${ALL_ASSESSMENT_QUESTIONS.length}`);

module.exports = ALL_ASSESSMENT_QUESTIONS;
