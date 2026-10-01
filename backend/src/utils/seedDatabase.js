require('dotenv').config({ path: __dirname + '/../../.env' });
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Problem = require('../models/problem');
const AssessmentQuestion = require('../models/assessmentQuestion');
const ALL_ASSESSMENT_QUESTIONS = require('./allAssessmentQuestions');
const PROBLEMS_DATA = require('./problemsData');

async function seed() {
    try {
        console.log("🔄 Connecting to MongoDB for seeding...");
        await connectDB();

        // 1. Seed Assessment Questions
        console.log(`📝 Seeding ${ALL_ASSESSMENT_QUESTIONS.length} Assessment Questions...`);
        let questionsInserted = 0;
        for (const q of ALL_ASSESSMENT_QUESTIONS) {
            await AssessmentQuestion.findOneAndUpdate(
                { title: q.title },
                { $set: q },
                { upsert: true, new: true }
            );
            questionsInserted++;
        }
        console.log(`✅ Assessment Questions Seeded: ${questionsInserted} total`);

        // 2. Seed Coding Problems
        console.log(`📝 Seeding ${PROBLEMS_DATA.length} Core Coding Problems...`);
        let problemsInserted = 0;
        for (const p of PROBLEMS_DATA) {
            await Problem.findOneAndUpdate(
                { slug: p.slug },
                { $set: p },
                { upsert: true, new: true }
            );
            problemsInserted++;
        }
        console.log(`✅ Coding Problems Seeded: ${problemsInserted} total`);

        const totalQ = await AssessmentQuestion.countDocuments();
        const totalP = await Problem.countDocuments();
        console.log(`🎉 Seeding complete! Total in DB => AssessmentQuestions: ${totalQ}, Problems: ${totalP}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
}

seed();
