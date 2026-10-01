const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const Note = require("../models/note");
const Draft = require("../models/draft");
const SolutionVideo = require("../models/solutionVideo");

/**
 * Get all problems with rich search, difficulty, topic, and solved status filters
 */
const getAllProblem = async (req, res) => {
  try {
    const {
      search,
      difficulty,
      topic,
      subtopic,
      status, // 'solved', 'unsolved', 'attempted'
      page = 1,
      limit = 50,
      sortBy = 'problemNumber',
      order = 'asc'
    } = req.query;

    const query = {};

    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty.toLowerCase();
    }

    // Topic filter
    if (topic && topic !== 'all') {
      query.topic = topic.toLowerCase();
    }

    // Subtopic filter
    if (subtopic && subtopic !== 'all') {
      query.subtopic = new RegExp(subtopic, 'i');
    }

    // Search query (title, topic, subtopic, tags, description)
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: new RegExp(term, 'i') },
        { topic: new RegExp(term, 'i') },
        { subtopic: new RegExp(term, 'i') },
        { tags: new RegExp(term, 'i') }
      ];
      if (!isNaN(term)) {
        query.$or.push({ problemNumber: Number(term) });
      }
    }

    // User-specific solved/attempted filtering if user is authenticated
    const userId = req.result?._id || req.user?._id;
    let userSolvedIds = [];
    let userAttemptedIds = [];

    if (userId) {
      const user = await User.findById(userId).select('problemSolved');
      if (user && user.problemSolved) {
        userSolvedIds = user.problemSolved.map(id => id.toString());
      }
      const attempts = await Submission.find({ userId }).distinct('problemId');
      userAttemptedIds = attempts.map(id => id.toString());

      if (status === 'solved') {
        query._id = { $in: userSolvedIds };
      } else if (status === 'unsolved') {
        query._id = { $nin: userSolvedIds };
      } else if (status === 'attempted') {
        const attemptedOnly = userAttemptedIds.filter(id => !userSolvedIds.includes(id));
        query._id = { $in: attemptedOnly };
      }
    }

    const sortOptions = {};
    const sortOrder = order === 'desc' ? -1 : 1;
    if (sortBy === 'acceptance') {
      sortOptions['acceptance.rate'] = sortOrder;
    } else if (sortBy === 'difficulty') {
      sortOptions.difficulty = sortOrder;
    } else if (sortBy === 'title') {
      sortOptions.title = sortOrder;
    } else {
      sortOptions.problemNumber = sortOrder;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .select('_id problemNumber title slug difficulty topic subtopic acceptance tags')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Problem.countDocuments(query)
    ]);

    // Attach user solved / attempted status to response items
    const enrichedProblems = problems.map(p => ({
      ...p,
      isSolved: userSolvedIds.includes(p._id.toString()),
      isAttempted: userAttemptedIds.includes(p._id.toString())
    }));

    return res.status(200).json({
      success: true,
      data: enrichedProblems,
      total,
      page: parseInt(page, 10),
      pages: Math.ceil(total / parseInt(limit, 10))
    });

  } catch (err) {
    console.error('[getAllProblem] Error:', err);
    return res.status(500).json({ success: false, message: "Error fetching problems: " + err.message });
  }
};

/**
 * Get problem by ID or Slug with all details
 */
const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ success: false, message: "Problem ID is missing" });
    }

    let problem;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await Problem.findById(id).lean();
    } else {
      problem = await Problem.findOne({ slug: id }).lean();
    }

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Attach video if present
    const video = await SolutionVideo.findOne({ problemId: problem._id });
    if (video) {
      problem.secureUrl = video.secureUrl;
      problem.thumbnailUrl = video.thumbnailUrl;
      problem.duration = video.duration;
    }

    // Check if current user has solved it
    const userId = req.result?._id || req.user?._id;
    let isSolved = false;
    let isBookmarked = false;
    if (userId) {
      const user = await User.findById(userId).select('problemSolved bookmarkedProblems');
      if (user) {
        isSolved = user.problemSolved?.some(pId => pId.toString() === problem._id.toString());
        isBookmarked = user.bookmarkedProblems?.some(pId => pId.toString() === problem._id.toString());
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...problem,
        isSolved,
        isBookmarked
      }
    });

  } catch (err) {
    console.error('[getProblemById] Error:', err);
    return res.status(500).json({ success: false, message: "Internal server error: " + err.message });
  }
};

/**
 * Toggle Bookmark
 */
const toggleBookmark = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId } = req.body;

    if (!problemId) {
      return res.status(400).json({ success: false, message: "Problem ID required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const index = user.bookmarkedProblems.findIndex(id => id.toString() === problemId.toString());
    let bookmarked = false;

    if (index > -1) {
      user.bookmarkedProblems.splice(index, 1);
      bookmarked = false;
    } else {
      user.bookmarkedProblems.push(problemId);
      bookmarked = true;
    }

    await user.save();
    return res.status(200).json({
      success: true,
      bookmarked,
      message: bookmarked ? "Problem bookmarked" : "Bookmark removed"
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get all bookmarked problems for user
 */
const getBookmarkedProblems = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: 'bookmarkedProblems',
      select: '_id problemNumber title difficulty topic subtopic acceptance'
    });

    return res.status(200).json({
      success: true,
      data: user?.bookmarkedProblems || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get & Save Problem Notes
 */
const getNote = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId } = req.params;
    const note = await Note.findOne({ userId, problemId });
    return res.status(200).json({ success: true, content: note?.content || '' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const saveNote = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId, content } = req.body;
    const note = await Note.findOneAndUpdate(
      { userId, problemId },
      { content: content || '' },
      { upsert: true, new: true }
    );
    return res.status(200).json({ success: true, note });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get & Save Code Drafts
 */
const getDraft = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId, language } = req.query;
    const draft = await Draft.findOne({ userId, problemId, language });
    return res.status(200).json({ success: true, code: draft?.code || null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const saveDraft = async (req, res) => {
  try {
    const userId = req.result._id;
    const { problemId, language, code } = req.body;
    await Draft.findOneAndUpdate(
      { userId, problemId, language },
      { code },
      { upsert: true, new: true }
    );
    return res.status(200).json({ success: true, message: "Draft saved" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get problems solved by user
 */
const solvedAllProblembyUser = async (req, res) => {
  try {
    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path: 'problemSolved',
      select: '_id problemNumber title difficulty topic subtopic acceptance'
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({
      success: true,
      data: user.problemSolved || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server Error: ' + err.message });
  }
};

/**
 * Get submissions for a specific problem by user
 */
const submittedProblem = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.pid;

    const submissions = await Submission.find({ userId, problemId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: submissions || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Admin: Create Problem
 */
const createProblem = async (req, res) => {
  try {
    const newProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result?._id
    });
    return res.status(201).json({ success: true, data: newProblem, message: "Problem saved successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, message: "Error: " + err.message });
  }
};

/**
 * Admin: Update Problem
 */
const updateProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Problem not found" });
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error: " + err.message });
  }
};

/**
 * Admin: Delete Problem
 */
const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Problem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Problem not found" });
    return res.status(200).json({ success: true, message: "Successfully deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error: " + err.message });
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  solvedAllProblembyUser,
  submittedProblem,
  toggleBookmark,
  getBookmarkedProblems,
  getNote,
  saveNote,
  getDraft,
  saveDraft
};
