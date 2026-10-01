const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch, submitToken, getStatusDescription } = require("../utils/problemUtility");

const normalizeLanguage = (lang) => {
  if (!lang) return 'c++';
  const lower = lang.toLowerCase().trim();
  if (lower === 'c++' || lower === 'cpp') return 'c++';
  if (lower === 'javascript' || lower === 'js') return 'javascript';
  if (lower === 'java') return 'java';
  if (lower === 'python' || lower === 'py') return 'python';
  return lower;
};

const mapJudgeStatusToDb = (statusId) => {
  switch (statusId) {
    case 3: return 'accepted';
    case 4: return 'wrong';
    case 5: return 'tle';
    case 6: return 'compilation_error';
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12: return 'runtime_error';
    default: return 'error';
  }
};

/**
 * RUN CODE (Runs against visible or custom testcases)
 */
const runCode = async (req, res) => {
  try {
    const problemId = req.params.id;
    const { code, language, customTestCases } = req.body;

    if (!code || !language) {
      return res.status(400).json({ success: false, message: "Code and language are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const normalizedLang = normalizeLanguage(language);
    const languageId = getLanguageById(normalizedLang);

    // Determine testcases to run: custom testcases if provided, else problem's visibleTestCases
    let testCasesToRun = [];
    if (customTestCases && Array.isArray(customTestCases) && customTestCases.length > 0) {
      testCasesToRun = customTestCases.map(tc => ({
        input: tc.input || "",
        output: tc.output || ""
      }));
    } else {
      testCasesToRun = (problem.visibleTestCases && problem.visibleTestCases.length > 0)
        ? problem.visibleTestCases
        : [{ input: "", output: "" }];
    }

    const submissions = testCasesToRun.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output || undefined
    }));

    const tokens = await submitBatch(submissions);
    const results = await submitToken(tokens);

    let allPassed = true;
    let totalRuntime = 0;
    let maxMemory = 0;
    let primaryError = null;

    const formattedTestCases = results.map((test, index) => {
      const tcExpected = testCasesToRun[index]?.output || '';
      const tcInput = testCasesToRun[index]?.input || '';
      const statusDesc = getStatusDescription(test.status_id);
      const passed = test.status_id === 3;

      if (!passed) {
        allPassed = false;
        if (!primaryError) {
          primaryError = test.compile_output || test.stderr || test.message || statusDesc;
        }
      }

      totalRuntime += parseFloat(test.time || 0);
      maxMemory = Math.max(maxMemory, test.memory || 0);

      return {
        index: index + 1,
        stdin: tcInput,
        expected_output: tcExpected,
        stdout: test.stdout || '',
        stderr: test.stderr || '',
        compile_output: test.compile_output || '',
        status_id: test.status_id,
        status: statusDesc,
        passed,
        time: parseFloat(test.time || 0),
        memory: test.memory || 0
      };
    });

    return res.status(200).json({
      success: true,
      allPassed,
      testCases: formattedTestCases,
      runtime: parseFloat((totalRuntime * 1000).toFixed(1)), // ms
      memory: maxMemory, // kB
      error: primaryError
    });

  } catch (err) {
    console.error('[RUN] Execution Error:', err);
    return res.status(500).json({
      success: false,
      message: "Code execution failed: " + err.message,
      error: err.message
    });
  }
};

/**
 * SUBMIT CODE (Runs against full test suite including hidden testcases)
 */
const submitCode = async (req, res) => {
  try {
    const userId = req.result?._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User authentication required to submit" });
    }

    if (!code || !language) {
      return res.status(400).json({ success: false, message: "Code and language are required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const normalizedLang = normalizeLanguage(language);
    const languageId = getLanguageById(normalizedLang);

    // Combine hidden and visible testcases for full evaluation
    const fullTestSuite = [
      ...(problem.visibleTestCases || []),
      ...(problem.hiddenTestCases || [])
    ];

    if (fullTestSuite.length === 0) {
      fullTestSuite.push({ input: "", output: "" });
    }

    const submissions = fullTestSuite.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output
    }));

    const tokens = await submitBatch(submissions);
    const results = await submitToken(tokens);

    let testCasesPassed = 0;
    let totalRuntime = 0;
    let maxMemory = 0;
    let overallStatus = 'accepted';
    let errorMessage = null;

    const testCaseResults = results.map((test, index) => {
      const isPassed = test.status_id === 3;
      if (isPassed) {
        testCasesPassed++;
        totalRuntime += parseFloat(test.time || 0);
        maxMemory = Math.max(maxMemory, test.memory || 0);
      } else {
        if (overallStatus === 'accepted') {
          overallStatus = mapJudgeStatusToDb(test.status_id);
          errorMessage = test.compile_output || test.stderr || test.message || getStatusDescription(test.status_id);
        }
      }

      return {
        testCaseIndex: index + 1,
        passed: isPassed,
        stdout: test.stdout || '',
        expected: fullTestSuite[index]?.output || '',
        stderr: test.stderr || '',
        compile_output: test.compile_output || '',
        time: parseFloat(test.time || 0),
        memory: test.memory || 0,
        status_id: test.status_id
      };
    });

    const submissionDoc = await Submission.create({
      userId,
      problemId,
      code,
      language: normalizedLang,
      status: overallStatus,
      runtime: parseFloat((totalRuntime * 1000).toFixed(1)),
      memory: maxMemory,
      errorMessage: errorMessage || '',
      testCasesPassed,
      testCasesTotal: fullTestSuite.length,
      testCaseResults
    });

    // If Accepted: update user statistics and streaks
    if (overallStatus === 'accepted') {
      const user = await User.findById(userId);
      if (user) {
        if (!user.problemSolved.some(id => id.toString() === problemId.toString())) {
          user.problemSolved.push(problemId);
        }

        // Streak calculation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastSolved = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
        if (lastSolved) {
          lastSolved.setHours(0, 0, 0, 0);
          const diffDays = Math.round((today - lastSolved) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            user.streak = (user.streak || 0) + 1;
          } else if (diffDays > 1) {
            user.streak = 1;
          }
        } else {
          user.streak = 1;
        }
        user.lastSolvedDate = new Date();
        await user.save();
      }

      // Update problem acceptance statistics
      if (problem.acceptance) {
        problem.acceptance.submissionsCount = (problem.acceptance.submissionsCount || 0) + 1;
        problem.acceptance.acceptedCount = (problem.acceptance.acceptedCount || 0) + 1;
        problem.acceptance.rate = parseFloat(((problem.acceptance.acceptedCount / problem.acceptance.submissionsCount) * 100).toFixed(1));
        await problem.save();
      }
    } else {
      if (problem.acceptance) {
        problem.acceptance.submissionsCount = (problem.acceptance.submissionsCount || 0) + 1;
        problem.acceptance.rate = parseFloat(((problem.acceptance.acceptedCount / problem.acceptance.submissionsCount) * 100).toFixed(1));
        await problem.save();
      }
    }

    return res.status(201).json({
      success: true,
      accepted: overallStatus === 'accepted',
      status: overallStatus,
      statusDescription: getStatusDescription(results[0]?.status_id || 3),
      totalTestCases: fullTestSuite.length,
      passedTestCases: testCasesPassed,
      runtime: submissionDoc.runtime,
      memory: submissionDoc.memory,
      error: overallStatus !== 'accepted' ? errorMessage : null,
      submissionId: submissionDoc._id
    });

  } catch (err) {
    console.error('[SUBMIT] Submission Error:', err);
    return res.status(500).json({
      success: false,
      message: "Submission processing failed: " + err.message,
      error: err.message
    });
  }
};

/**
 * Get all submissions for current user with optional filtering
 */
const getAllUserSubmissions = async (req, res) => {
  try {
    const userId = req.result._id;
    const { status, language, limit = 50, page = 1 } = req.query;

    const filter = { userId };
    if (status && status !== 'all') filter.status = status;
    if (language && language !== 'all') filter.language = normalizeLanguage(language);

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [submissions, total] = await Promise.all([
      Submission.find(filter)
        .populate('problemId', 'title problemNumber difficulty topic')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Submission.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      data: submissions,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10))
    });
  } catch (err) {
    console.error('[getAllUserSubmissions] Error:', err);
    return res.status(500).json({ success: false, message: "Failed to fetch submissions" });
  }
};

/**
 * Get submission by ID
 */
const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id).populate('problemId', 'title difficulty topic');
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }
    return res.status(200).json({ success: true, data: submission });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  submitCode,
  runCode,
  getAllUserSubmissions,
  getSubmissionById
};