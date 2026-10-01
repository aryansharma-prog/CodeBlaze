import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Assessment flow states: 'overview' | 'testing' | 'completed'
  const [viewState, setViewState] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [recommendationsData, setRecommendationsData] = useState(null);

  // Active Assessment Testing Session States
  const [assessmentId, setAssessmentId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null); // { isCorrect, explanation }
  const [timeSpent, setTimeSpent] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  // Topic test modal
  const [topicTestModalOpen, setTopicTestModalOpen] = useState(false);
  const [selectedTopicTest, setSelectedTopicTest] = useState('arrays');

  // Load existing recommendations & history
  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get('/recommendations/recommendations');
      if (data && data.data) {
        setRecommendationsData(data.data);
      }
    } catch (e) {
      console.error('Failed to load recommendations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Timer tick during active test
  useEffect(() => {
    let interval = null;
    if (viewState === 'testing' && !answerFeedback) {
      interval = setInterval(() => {
        setTimeSpent((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewState, answerFeedback]);

  // Start Assessment Session
  const handleStartAssessment = async (mode = 'standard', topic = '') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setTopicTestModalOpen(false);
    try {
      const { data } = await axiosClient.post('/assessment/start', { mode, topic });
      if (data && data.success) {
        setAssessmentId(data.assessmentId);
        setCurrentQuestion(data.question);
        setQuestionIndex(0);
        setTotalQuestions(data.totalQuestions);
        setSelectedOption(null);
        setAnswerFeedback(null);
        setTimeSpent(0);
        setHintsUsed(0);
        setShowHint(false);
        setViewState('testing');
      }
    } catch (err) {
      console.error('Start assessment error:', err);
      alert(err.response?.data?.message || 'Failed to start assessment');
    } finally {
      setLoading(false);
    }
  };

  // Submit Answer for Current Question
  const handleSubmitAnswer = async () => {
    if (!selectedOption || submittingAnswer) return;
    setSubmittingAnswer(true);

    try {
      const { data } = await axiosClient.post('/assessment/submit-answer', {
        assessmentId,
        questionId: currentQuestion._id,
        userAnswer: selectedOption,
        timeSpent,
        hintsUsed
      });

      if (data && data.success) {
        setAnswerFeedback({
          isCorrect: data.isCorrect,
          correctOption: data.correctOption,
          explanation: data.explanation,
          isCompleted: data.isCompleted,
          nextQuestion: data.nextQuestion
        });
      }
    } catch (err) {
      console.error('Submit answer error:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Move to Next Adaptive Question or Finish
  const handleProceedNext = async () => {
    if (answerFeedback?.isCompleted) {
      // Finalize assessment
      setLoading(true);
      try {
        const { data } = await axiosClient.post('/assessment/complete', { assessmentId });
        if (data && data.data) {
          setRecommendationsData(data.data);
          setViewState('completed');
        }
      } catch (err) {
        console.error('Complete assessment error:', err);
      } finally {
        setLoading(false);
      }
    } else if (answerFeedback?.nextQuestion) {
      setCurrentQuestion(answerFeedback.nextQuestion);
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerFeedback(null);
      setTimeSpent(0);
      setHintsUsed(0);
      setShowHint(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'strong':
        return <span className="badge-strong px-2.5 py-0.5 rounded text-xs font-mono font-bold">Strong (80-100)</span>;
      case 'good':
        return <span className="badge-good px-2.5 py-0.5 rounded text-xs font-mono font-bold">Good (60-79)</span>;
      case 'needs-practice':
        return <span className="badge-needs-practice px-2.5 py-0.5 rounded text-xs font-mono font-bold">Needs Practice (40-59)</span>;
      default:
        return <span className="badge-weak px-2.5 py-0.5 rounded text-xs font-mono font-bold">Weak (0-39)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 md:px-6 py-8 flex-1 flex flex-col space-y-6">
        {/* ========================================================= */}
        {/* 1. OVERVIEW / DASHBOARD VIEW                              */}
        {/* ========================================================= */}
        {viewState === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-purple-950/40 via-[#131620] to-[#131620] border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold">
                  <span>✨</span>
                  <span>Personalized DSA Learning Engine</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Personalized DSA Coach
                </h1>
                <p className="text-xs md:text-sm text-[#9aa0b8] leading-relaxed">
                  Test your algorithmic problem-solving skills across 20 core topics. CodeBlaze analyzes your subtopic weaknesses, repeated failure patterns, and generates a personalized learning roadmap with curated practice problems.
                </p>
              </div>

              {/* Assessment Mode Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#262b3d]/60">
                <div className="bg-[#0e1017]/90 border border-[#262b3d] hover:border-purple-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Quick Assessment</span>
                      <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">~15m</span>
                    </div>
                    <div className="text-[11px] text-[#5e6480] font-mono mt-1">5 Adaptive Questions</div>
                    <p className="text-xs text-[#9aa0b8] mt-2">
                      Fast diagnostic test to quickly identify high-level weak topics.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartAssessment('quick')}
                    className="btn-secondary text-xs py-1.5 w-full justify-center"
                  >
                    Start Quick Test
                  </button>
                </div>

                <div className="bg-[#0e1017]/90 border border-purple-500/50 hover:border-purple-400 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3 shadow-lg shadow-purple-500/10 relative">
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-purple-600 text-white font-mono text-[10px] font-bold rounded-full uppercase">
                    Recommended
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Standard Assessment</span>
                      <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">~30m</span>
                    </div>
                    <div className="text-[11px] text-[#5e6480] font-mono mt-1">10 Adaptive Questions</div>
                    <p className="text-xs text-[#9aa0b8] mt-2">
                      In-depth evaluation probing subtopic mastery and boundary edge cases.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartAssessment('standard')}
                    className="btn-primary text-xs py-1.5 w-full justify-center"
                  >
                    Start Standard Test
                  </button>
                </div>

                <div className="bg-[#0e1017]/90 border border-[#262b3d] hover:border-purple-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Topic-Specific Test</span>
                      <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Custom</span>
                    </div>
                    <div className="text-[11px] text-[#5e6480] font-mono mt-1">5–10 Focused Qs</div>
                    <p className="text-xs text-[#9aa0b8] mt-2">
                      Drill down on a specific topic (e.g. Sliding Window, Trees, DP).
                    </p>
                  </div>
                  <button
                    onClick={() => setTopicTestModalOpen(true)}
                    className="btn-secondary text-xs py-1.5 w-full justify-center"
                  >
                    Select Topic Test
                  </button>
                </div>
              </div>
            </div>

            {/* Current Diagnostic Analysis & Roadmap Section */}
            {loading ? (
              <div className="py-16 text-center text-xs font-mono text-[#5e6480]">
                <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin-custom mx-auto mb-2"></div>
                Analyzing performance telemetry...
              </div>
            ) : recommendationsData ? (
              <div className="space-y-6">
                {/* AI Summary Card */}
                {recommendationsData.aiAnalysis && (
                  <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>🧠</span>
                        <span>AI Diagnostic Assessment Summary</span>
                      </h2>
                      {recommendationsData.score !== undefined && (
                        <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                          Overall Score: {recommendationsData.score}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#ced3e8] leading-relaxed">
                      {recommendationsData.aiAnalysis.summary}
                    </p>

                    {/* Action Plan */}
                    {recommendationsData.aiAnalysis.actionPlan && (
                      <div className="pt-2 border-t border-[#1c202e] space-y-2">
                        <div className="text-[11px] font-mono font-bold text-[#5e6480] uppercase tracking-wider">
                          Recommended Action Plan
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {recommendationsData.aiAnalysis.actionPlan.map((step, idx) => (
                            <div key={idx} className="bg-[#131620] p-3 rounded-xl border border-[#1c202e] text-xs text-[#9aa0b8]">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Topic Breakdown & Weak Subtopics */}
                {recommendationsData.topicBreakdown && recommendationsData.topicBreakdown.length > 0 && (
                  <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 space-y-4">
                    <h2 className="text-sm font-bold text-white">Topic Mastery & Subtopic Diagnostics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {recommendationsData.topicBreakdown.map((tb, idx) => (
                        <div key={idx} className="bg-[#131620] border border-[#1c202e] rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white capitalize">{tb.topic}</span>
                            {getStatusBadge(tb.status)}
                          </div>
                          <div className="w-full bg-[#1a1e2b] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                tb.score >= 80 ? 'bg-emerald-500' : tb.score >= 60 ? 'bg-indigo-500' : tb.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${tb.score}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-[#5e6480]">
                            <span>Score: {tb.score}%</span>
                            <span>{tb.correctQuestions || 0}/{tb.totalQuestions || 0} Qs</span>
                          </div>

                          {tb.weakSubtopics && tb.weakSubtopics.length > 0 && (
                            <div className="pt-2 text-[11px] text-red-400 font-mono">
                              ⚠️ Weak in: {tb.weakSubtopics.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Practice Problems */}
                {recommendationsData.recommendations && recommendationsData.recommendations.length > 0 && (
                  <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 space-y-4">
                    <h2 className="text-sm font-bold text-white">Recommended Problem Sets</h2>
                    <div className="space-y-4">
                      {recommendationsData.recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-[#131620] border border-[#262b3d] rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 font-mono text-xs font-bold capitalize">
                                {rec.topic}
                              </span>
                              <span className="text-xs font-semibold text-white">
                                {rec.subtopic}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-[#5e6480] bg-[#0e1017] px-2.5 py-1 rounded border border-[#1c202e]">
                              Priority {rec.priority}
                            </span>
                          </div>

                          <p className="text-xs text-[#9aa0b8] font-sans">
                            💡 {rec.reason}
                          </p>

                          {/* Problem Cards */}
                          {rec.recommendedProblems && rec.recommendedProblems.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              {rec.recommendedProblems.map((rp, pIdx) => (
                                <div
                                  key={pIdx}
                                  onClick={() => navigate(`/problems/${rp.problemId}`)}
                                  className="p-3 bg-[#0e1017] hover:bg-[#1a1e2b] border border-[#1c202e] hover:border-indigo-500/40 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                                >
                                  <div>
                                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300">
                                      {rp.title}
                                    </div>
                                    <div className="text-[11px] text-[#5e6480] font-mono mt-0.5 capitalize">
                                      {rp.difficulty} • {rp.subtopic || rp.topic}
                                    </div>
                                  </div>
                                  <span className="text-xs font-mono text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                                    Solve →
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. ACTIVE ADAPTIVE TESTING VIEW                           */}
        {/* ========================================================= */}
        {viewState === 'testing' && currentQuestion && (
          <div className="max-w-3xl w-full mx-auto space-y-6 animate-fade-in font-sans">
            {/* Top Testing Header Bar */}
            <div className="flex items-center justify-between bg-[#0e1017] border border-[#262b3d] rounded-2xl px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-purple-400 font-bold">
                  Question {questionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-[11px] font-mono capitalize px-2 py-0.5 rounded bg-[#1a1e2b] text-[#9aa0b8] border border-[#262b3d]">
                  {currentQuestion.topic}
                </span>
                {currentQuestion.subtopic && (
                  <span className="text-[11px] font-mono text-[#5e6480]">
                    • {currentQuestion.subtopic}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#9aa0b8]">⏱ {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                <button
                  onClick={() => {
                    if (window.confirm("Exit assessment test? Your progress will be abandoned.")) {
                      setViewState('overview');
                    }
                  }}
                  className="text-[#5e6480] hover:text-red-400 text-xs cursor-pointer"
                >
                  Exit
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 space-y-5 shadow-2xl">
              {/* Question Title & Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {currentQuestion.title}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    currentQuestion.difficulty === 'easy' ? 'badge-easy' : currentQuestion.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#ced3e8] leading-relaxed">
                  {currentQuestion.question}
                </p>
              </div>

              {/* Code Snippet if present */}
              {currentQuestion.codeSnippet && (
                <pre className="p-3.5 bg-[#131620] border border-[#262b3d] rounded-xl font-mono text-xs text-[#f1f3f9] overflow-x-auto whitespace-pre leading-relaxed">
                  {currentQuestion.codeSnippet}
                </pre>
              )}

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options?.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  let optStyle = "bg-[#131620] hover:bg-[#1a1e2b] border-[#262b3d] text-[#ced3e8]";

                  if (answerFeedback) {
                    if (opt.id === answerFeedback.correctOption) {
                      optStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-semibold";
                    } else if (isSelected && !answerFeedback.isCorrect) {
                      optStyle = "bg-red-500/15 border-red-500 text-red-300";
                    }
                  } else if (isSelected) {
                    optStyle = "bg-indigo-600/20 border-indigo-500 text-white font-semibold";
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => !answerFeedback && setSelectedOption(opt.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-[#1a1e2b] border border-[#262b3d] flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 mt-0.5">
                        {opt.id}
                      </span>
                      <span className="text-xs leading-relaxed flex-1">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Hint Accordion */}
              {currentQuestion.hints && currentQuestion.hints.length > 0 && !answerFeedback && (
                <div className="pt-2">
                  {!showHint ? (
                    <button
                      onClick={() => {
                        setShowHint(true);
                        setHintsUsed((h) => h + 1);
                      }}
                      className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                    >
                      <span>💡</span>
                      <span>Need a hint? (-2 pts penalty)</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-purple-500/10 border border-purple-500/25 rounded-xl text-xs text-purple-300 animate-fade-in font-sans">
                      <strong>💡 Hint:</strong> {currentQuestion.hints[0]}
                    </div>
                  )}
                </div>
              )}

              {/* Answer Feedback & Explanation */}
              {answerFeedback && (
                <div className={`p-4 rounded-xl border space-y-2 animate-fade-in ${
                  answerFeedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  <div className="font-bold text-xs flex items-center gap-2">
                    <span>{answerFeedback.isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}</span>
                  </div>
                  <p className="text-xs text-[#ced3e8] leading-relaxed font-sans">
                    {answerFeedback.explanation}
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1c202e]">
                {!answerFeedback ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOption || submittingAnswer}
                    className="btn-primary text-xs py-2 px-5"
                  >
                    {submittingAnswer ? "Evaluating..." : "Submit Answer"}
                  </button>
                ) : (
                  <button
                    onClick={handleProceedNext}
                    className="btn-primary text-xs py-2 px-5 bg-indigo-600 hover:bg-indigo-500"
                  >
                    {answerFeedback.isCompleted ? "View Assessment Results →" : "Next Adaptive Question →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. FINAL ASSESSMENT RESULTS VIEW                          */}
        {/* ========================================================= */}
        {viewState === 'completed' && recommendationsData && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0e1017] border border-purple-500/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#262b3d] pb-6">
                <div>
                  <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                    Assessment Complete
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
                    Your DSA Skill Analysis
                  </h1>
                </div>

                <div className="flex items-center gap-4 bg-[#131620] p-4 rounded-2xl border border-[#262b3d]">
                  <div className="text-center">
                    <div className="text-[10px] font-mono text-[#5e6480] uppercase">Overall Score</div>
                    <div className="font-mono text-2xl font-bold text-purple-400 mt-0.5">
                      {recommendationsData.score}%
                    </div>
                  </div>
                  <div className="w-px h-8 bg-[#262b3d]" />
                  <div className="text-center">
                    <div className="text-[10px] font-mono text-[#5e6480] uppercase">Performance</div>
                    <div className="font-mono text-sm font-bold text-white mt-1">
                      {recommendationsData.score >= 80 ? 'Strong' : recommendationsData.score >= 60 ? 'Good' : recommendationsData.score >= 40 ? 'Needs Practice' : 'Weak'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths and Weaknesses Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#131620] border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <span>✓</span>
                    <span>Strong Topics & Subtopics</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#ced3e8]">
                    {recommendationsData.strongTopics?.length > 0 ? (
                      recommendationsData.strongTopics.map((st, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-emerald-400">•</span>
                          <span className="capitalize">{st}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#5e6480]">Continue practicing to unlock strong masteries.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-[#131620] border border-red-500/30 rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs font-bold text-red-400 flex items-center gap-2 font-mono uppercase tracking-wider">
                    <span>⚠️</span>
                    <span>Areas Requiring Focus</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#ced3e8]">
                    {recommendationsData.weakSubtopics?.length > 0 ? (
                      recommendationsData.weakSubtopics.map((wt, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-red-400">•</span>
                          <span>{wt}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#5e6480]">No critical weaknesses detected!</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Learning Roadmap */}
              {recommendationsData.recommendations && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-white">Recommended Learning Path</h3>
                  <div className="space-y-3">
                    {recommendationsData.recommendations.map((rec, i) => (
                      <div key={i} className="bg-[#131620] border border-[#262b3d] rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white capitalize">{rec.topic} • {rec.subtopic}</span>
                          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/25">
                            Priority {rec.priority}
                          </span>
                        </div>
                        <p className="text-xs text-[#9aa0b8]">{rec.reason}</p>
                        {rec.recommendedProblems && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {rec.recommendedProblems.map((rp, pi) => (
                              <div
                                key={pi}
                                onClick={() => navigate(`/problems/${rp.problemId}`)}
                                className="p-2.5 bg-[#0e1017] hover:bg-[#1a1e2b] rounded-lg border border-[#1c202e] cursor-pointer flex justify-between items-center text-xs"
                              >
                                <span className="text-white font-medium">{rp.title}</span>
                                <span className="text-indigo-400 font-mono text-[11px]">Solve →</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action: Return or Retake */}
              <div className="flex items-center justify-between pt-4 border-t border-[#262b3d]">
                <button
                  onClick={() => setViewState('overview')}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Back to Coach Overview
                </button>
                <button
                  onClick={() => handleStartAssessment('standard')}
                  className="btn-primary text-xs py-2 px-5"
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topic-Specific Test Modal */}
        {topicTestModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
            <div className="fixed inset-0" onClick={() => setTopicTestModalOpen(false)} />
            <div className="relative w-full max-w-md bg-[#131620] border border-[#262b3d] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Select DSA Topic to Test</h3>
                <button onClick={() => setTopicTestModalOpen(false)} className="text-[#5e6480] hover:text-white text-xs">✕</button>
              </div>
              <p className="text-xs text-[#9aa0b8]">
                Generate an adaptive 10-question assessment focused exclusively on your selected topic.
              </p>

              <select
                value={selectedTopicTest}
                onChange={(e) => setSelectedTopicTest(e.target.value)}
                className="w-full bg-[#0e1017] border border-[#262b3d] rounded-xl p-3 text-xs font-mono text-white outline-none"
              >
                {[
                  'arrays', 'strings', 'hashing', 'two-pointers', 'sliding-window',
                  'stack', 'queue', 'linked-list', 'binary-search', 'recursion',
                  'backtracking', 'trees', 'bst', 'heap', 'greedy', 'graphs', 'dp',
                  'bit-manipulation', 'trie', 'union-find'
                ].map((t) => (
                  <option key={t} value={t}>{t.replace('-', ' ').toUpperCase()}</option>
                ))}
              </select>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setTopicTestModalOpen(false)} className="btn-secondary text-xs py-1.5 px-3">
                  Cancel
                </button>
                <button
                  onClick={() => handleStartAssessment('standard', selectedTopicTest)}
                  className="btn-primary text-xs py-1.5 px-4"
                >
                  Start Topic Test
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
