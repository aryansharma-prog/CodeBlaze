import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

const ALL_TOPICS = [
  { id: 'arrays', label: 'Arrays', icon: '📊' },
  { id: 'strings', label: 'Strings', icon: '🔤' },
  { id: 'hashing', label: 'Hashing', icon: '🗝️' },
  { id: 'two-pointers', label: 'Two Pointers', icon: '👉👈' },
  { id: 'sliding-window', label: 'Sliding Window', icon: '🪟' },
  { id: 'stack', label: 'Stack', icon: '🥞' },
  { id: 'queue', label: 'Queue & Deque', icon: '🚶' },
  { id: 'linked-list', label: 'Linked List', icon: '🔗' },
  { id: 'binary-search', label: 'Binary Search', icon: '🔍' },
  { id: 'recursion', label: 'Recursion', icon: '🌀' },
  { id: 'backtracking', label: 'Backtracking', icon: '🌲' },
  { id: 'trees', label: 'Binary Trees', icon: '🌳' },
  { id: 'bst', label: 'BST', icon: '⚖️' },
  { id: 'heap', label: 'Heap / Priority Queue', icon: '🏔️' },
  { id: 'greedy', label: 'Greedy Algorithms', icon: '🎯' },
  { id: 'graphs', label: 'Graphs', icon: '🕸️' },
  { id: 'dp', label: 'Dynamic Programming', icon: '⚡' },
  { id: 'bit-manipulation', label: 'Bit Manipulation', icon: '0️⃣1️⃣' },
  { id: 'trie', label: 'Trie (Prefix Tree)', icon: '🔤' },
  { id: 'union-find', label: 'Union Find (DSU)', icon: '🧩' }
];

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // URL Topic Parameter (e.g. ?topic=Sliding%20Window or ?topic=graphs)
  const queryTopicParam = searchParams.get('topic') || '';

  // View States: 'overview' | 'testing' | 'completed'
  const [viewState, setViewState] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [recommendationsData, setRecommendationsData] = useState(null);

  // Active Assessment Testing Session States
  const [assessmentId, setAssessmentId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [activeTestMode, setActiveTestMode] = useState('standard');
  const [activeTestTopic, setActiveTestTopic] = useState('');

  // Topic test modal
  const [topicModalOpen, setTopicModalOpen] = useState(false);

  // Completed assessment summary
  const [completedReport, setCompletedReport] = useState(null);

  // Load existing recommendations & skill diagnostics
  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get('/assessment/recommendations');
      if (res.data?.success && res.data.data) {
        setRecommendationsData(res.data.data);
      } else if (res.data) {
        setRecommendationsData(res.data);
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

  // Timer tick during active test session
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
  const handleStartAssessment = async (mode = 'standard', topicName = '') => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setTopicModalOpen(false);
    setActiveTestMode(mode);
    setActiveTestTopic(topicName);

    try {
      const res = await axiosClient.post('/assessment/start', {
        mode,
        topic: topicName ? topicName.toLowerCase() : ''
      });

      if (res.data && res.data.success) {
        setAssessmentId(res.data.assessmentId);
        setCurrentQuestion(res.data.question);
        setQuestionIndex(0);
        setTotalQuestions(res.data.totalQuestions || (mode === 'quick' ? 5 : mode === 'deep' ? 20 : 10));
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
    if (!selectedOption || submittingAnswer || !assessmentId) return;
    setSubmittingAnswer(true);

    try {
      const res = await axiosClient.post(`/assessment/${assessmentId}/answer`, {
        questionId: currentQuestion._id,
        userAnswer: selectedOption,
        timeSpent,
        hintsUsed: showHint ? 1 : 0
      });

      if (res.data && res.data.success) {
        setAnswerFeedback({
          isCorrect: res.data.isCorrect,
          correctOption: res.data.correctOption,
          explanation: res.data.explanation,
          isCompleted: res.data.isCompleted,
          nextQuestion: res.data.nextQuestion
        });
      }
    } catch (err) {
      console.error('Submit answer error:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Proceed to Next Question or Complete Test
  const handleNextQuestion = async () => {
    if (!answerFeedback) return;

    if (answerFeedback.isCompleted || !answerFeedback.nextQuestion) {
      setLoading(true);
      try {
        const res = await axiosClient.post(`/assessment/${assessmentId}/complete`, {});
        const finalData = res.data?.data || res.data;
        setCompletedReport(finalData);
        setViewState('completed');
        loadRecommendations();
      } catch (err) {
        console.error('Complete assessment error:', err);
        setViewState('overview');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentQuestion(answerFeedback.nextQuestion);
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerFeedback(null);
      setShowHint(false);
      setTimeSpent(0);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#6c8ef7';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Strong (80–100%)';
    if (score >= 60) return 'Good (60–79%)';
    if (score >= 40) return 'Needs Practice (40–59%)';
    return 'Weak (0–39%)';
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Flatten recommended problems from roadmap
  const topicList = recommendationsData?.topicBreakdown || recommendationsData?.topicPerformance || [];
  const roadmaps = recommendationsData?.recommendations || [];
  const aiCoach = recommendationsData?.aiAnalysis || null;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0e', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* ========================================================= */}
        {/* 1. OVERVIEW & DIAGNOSTICS VIEW                             */}
        {/* ========================================================= */}
        {viewState === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Direct Topic Test Callout Banner (if query topic is specified) */}
            {queryTopicParam && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(108, 142, 247, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
                border: '1px solid rgba(108, 142, 247, 0.35)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 8px 24px rgba(108, 142, 247, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(108, 142, 247, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px'
                  }}>
                    🎯
                  </div>
                  <div>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#e8eaf0', marginBottom: '3px' }}>
                      Ready to test your <span style={{ color: '#6c8ef7' }}>{queryTopicParam}</span> mastery?
                    </h2>
                    <p style={{ fontSize: '12.5px', color: '#888d9f', margin: 0 }}>
                      Take an adaptive diagnostic test focused specifically on {queryTopicParam} subtopics, edge cases, and algorithm selection.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleStartAssessment('quick', queryTopicParam)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: '#1a1d2b',
                      color: '#e8eaf0',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: '1px solid #2e334a',
                      cursor: 'pointer'
                    }}
                  >
                    Quick Test (5 Qs)
                  </button>
                  <button
                    onClick={() => handleStartAssessment('standard', queryTopicParam)}
                    style={{
                      padding: '10px 22px',
                      borderRadius: '8px',
                      background: '#6c8ef7',
                      color: '#fff',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(108, 142, 247, 0.35)'
                    }}
                  >
                    Start Standard Test (10 Qs) →
                  </button>
                </div>
              </div>
            )}

            {/* Main Hero Header */}
            <div style={{
              background: 'linear-gradient(135deg, #131620 0%, #10121a 100%)',
              border: '1px solid #1e2230',
              borderRadius: '18px',
              padding: '32px',
              position: 'relative'
            }}>
              <div style={{ maxWidth: '720px', marginBottom: '24px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '16px', background: 'rgba(108, 142, 247, 0.12)', border: '1px solid rgba(108, 142, 247, 0.25)', color: '#6c8ef7', fontSize: '12px', fontWeight: 700, marginBottom: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>✨ Personalized DSA Coach & Assessment Engine</span>
                </div>
                <h1 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '8px', lineHeight: 1.2 }}>
                  Personalized DSA Coach
                </h1>
                <p style={{ fontSize: '13.5px', color: '#888d9f', lineHeight: 1.6, margin: 0 }}>
                  Evaluate your algorithmic problem-solving ability across 20 foundational domains. Our engine analyzes subtopic weaknesses, failure modes, and generates an adaptive learning roadmap with curated practice problems.
                </p>
              </div>

              {/* Assessment Mode Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
                borderTop: '1px solid #1e2230',
                paddingTop: '20px'
              }}>
                {/* Quick Assessment */}
                <div style={{ background: '#0d0e14', border: '1px solid #1e2230', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0' }}>Quick Assessment</span>
                      <span style={{ fontSize: '11px', color: '#6c8ef7', background: 'rgba(108, 142, 247, 0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>~15m</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#555870', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>5 Adaptive Questions</div>
                    <p style={{ fontSize: '12px', color: '#888d9f', margin: 0, lineHeight: 1.5 }}>
                      Fast diagnostic evaluation to quickly detect high-level topic mastery gaps.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartAssessment('quick')}
                    style={{ padding: '9px', borderRadius: '7px', background: '#1a1d2b', border: '1px solid #2a2e42', color: '#e8eaf0', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Start Quick Test (5 Qs)
                  </button>
                </div>

                {/* Standard Assessment (Recommended) */}
                <div style={{ background: '#0d0e14', border: '1px solid #6c8ef7', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', position: 'relative', boxShadow: '0 4px 20px rgba(108, 142, 247, 0.15)' }}>
                  <span style={{ position: 'absolute', top: '-10px', right: '14px', background: '#6c8ef7', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '10px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                    Recommended
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0' }}>Standard Assessment</span>
                      <span style={{ fontSize: '11px', color: '#6c8ef7', background: 'rgba(108, 142, 247, 0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>~30m</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#555870', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>10 Adaptive Questions</div>
                    <p style={{ fontSize: '12px', color: '#888d9f', margin: 0, lineHeight: 1.5 }}>
                      Comprehensive multi-topic test probing subtopic boundaries and algorithm selection.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartAssessment('standard')}
                    style={{ padding: '9px', borderRadius: '7px', background: '#6c8ef7', border: 'none', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Start Standard Test (10 Qs)
                  </button>
                </div>

                {/* Topic Specific Test */}
                <div style={{ background: '#0d0e14', border: '1px solid #1e2230', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0' }}>Topic-Specific Test</span>
                      <span style={{ fontSize: '11px', color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)', padding: '2px 8px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}>Custom</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#555870', fontFamily: "'JetBrains Mono', monospace", marginBottom: '8px' }}>5–10 Focused Qs</div>
                    <p style={{ fontSize: '12px', color: '#888d9f', margin: 0, lineHeight: 1.5 }}>
                      Drill down on a specific domain (Sliding Window, Binary Trees, DP, Graphs).
                    </p>
                  </div>
                  <button
                    onClick={() => setTopicModalOpen(true)}
                    style={{ padding: '9px', borderRadius: '7px', background: '#1a1d2b', border: '1px solid #2a2e42', color: '#a78bfa', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Choose Specific Topic →
                  </button>
                </div>
              </div>
            </div>

            {/* AI Coach Summary Card (if available) */}
            {aiCoach && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🤖</span>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>
                    AI Coach Diagnostic Summary
                  </h2>
                </div>
                {aiCoach.summary && (
                  <p style={{ fontSize: '13.5px', color: '#d4d8e8', lineHeight: 1.6, margin: 0 }}>
                    {aiCoach.summary}
                  </p>
                )}
                {aiCoach.actionPlan && aiCoach.actionPlan.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px', borderTop: '1px solid rgba(168, 85, 247, 0.15)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#c084fc', fontFamily: "'JetBrains Mono', monospace" }}>
                      Target Action Items:
                    </div>
                    {aiCoach.actionPlan.map((step, idx) => (
                      <div key={idx} style={{ fontSize: '12.5px', color: '#a0a5ba', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ color: '#c084fc', fontWeight: 700 }}>•</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Diagnostic Results & Recommendations Data */}
            {topicList.length > 0 && (
              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>
                      DSA Topic Mastery Diagnostics
                    </h2>
                    <p style={{ fontSize: '12px', color: '#7a8099', margin: '2px 0 0' }}>
                      Performance calibrated across evaluated algorithmic domains
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {topicList.map((tp, idx) => {
                    const score = tp.score || 0;
                    const color = getScoreColor(score);
                    const topicName = (tp.topic || 'Topic').replace('-', ' ');
                    return (
                      <div
                        key={tp.topic || idx}
                        style={{
                          background: '#0d0e14',
                          border: '1px solid #1e2230',
                          borderRadius: '10px',
                          padding: '14px 16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 700, fontSize: '13px', textTransform: 'capitalize' }}>{topicName}</span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            color,
                            background: `${color}15`,
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}>
                            {score}%
                          </span>
                        </div>

                        <div style={{ height: '5px', background: '#181b26', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                          <div style={{ width: `${Math.max(5, score)}%`, height: '100%', background: color }} />
                        </div>

                        {tp.weakSubtopics && tp.weakSubtopics.length > 0 && (
                          <div style={{ fontSize: '11px', color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>
                            🔴 Weak in: {tp.weakSubtopics.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Personalized Learning Roadmaps */}
            {roadmaps.length > 0 && (
              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>
                      Personalized Study Roadmaps
                    </h2>
                    <p style={{ fontSize: '12px', color: '#7a8099', margin: '2px 0 0' }}>
                      Prioritized learning sequences and curated problems tailored to your skill gaps
                    </p>
                  </div>
                  <NavLink to="/problems" style={{ fontSize: '12px', color: '#6c8ef7', textDecoration: 'none', fontWeight: 600 }}>
                    Browse All Problems →
                  </NavLink>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {roadmaps.map((rm, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#0d0e14',
                        border: '1px solid #1e2230',
                        borderRadius: '12px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: 'rgba(108, 142, 247, 0.15)',
                            color: '#6c8ef7',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace"
                          }}>
                            Priority #{rm.priority || idx + 1}
                          </span>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0', margin: 0, textTransform: 'capitalize' }}>
                            {rm.topic} — {rm.subtopic}
                          </h3>
                        </div>
                        <NavLink
                          to={`/problems?topic=${encodeURIComponent(rm.topic)}`}
                          style={{ fontSize: '12px', color: '#6c8ef7', textDecoration: 'none', fontWeight: 600 }}
                        >
                          View {rm.topic} Problems →
                        </NavLink>
                      </div>

                      {rm.reason && (
                        <p style={{ fontSize: '12.5px', color: '#888d9f', margin: 0, lineHeight: 1.5 }}>
                          {rm.reason}
                        </p>
                      )}

                      {/* Learning Steps */}
                      {rm.learningSteps && rm.learningSteps.length > 0 && (
                        <div style={{ background: '#11131c', border: '1px solid #1c202e', borderRadius: '8px', padding: '12px 14px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#5e6480', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
                            Action Plan
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {rm.learningSteps.map((step, sIdx) => (
                              <div key={sIdx} style={{ fontSize: '12px', color: '#cbd0e0', display: 'flex', gap: '6px' }}>
                                <span style={{ color: '#6c8ef7' }}>{sIdx + 1}.</span>
                                <span>{step.replace(/^\d+\.\s*/, '')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Problems */}
                      {rm.recommendedProblems && rm.recommendedProblems.length > 0 && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#5e6480', textTransform: 'uppercase', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
                            Target Practice Problems
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
                            {rm.recommendedProblems.map((p, pIdx) => {
                              const pId = p.problemId || p._id || p.id;
                              const diff = (p.difficulty || 'medium').toLowerCase();
                              const diffColor = diff === 'easy' ? '#22c55e' : diff === 'hard' ? '#ef4444' : '#f59e0b';

                              return (
                                <NavLink
                                  key={pId || pIdx}
                                  to={`/problem/${pId}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 14px',
                                    background: '#131620',
                                    border: '1px solid #1e2230',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    transition: 'border-color 0.15s'
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6c8ef7')}
                                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e2230')}
                                >
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#e8eaf0', marginBottom: '2px' }}>
                                      {p.title}
                                    </div>
                                    <span style={{ fontSize: '10px', color: diffColor, fontWeight: 700, textTransform: 'capitalize', fontFamily: "'JetBrains Mono', monospace" }}>
                                      {diff}
                                    </span>
                                  </div>
                                  <span style={{ color: '#6c8ef7', fontSize: '12px', fontWeight: 700 }}>Solve →</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. ACTIVE ASSESSMENT TESTING SESSION                      */}
        {/* ========================================================= */}
        {viewState === 'testing' && currentQuestion && (
          <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Testing Header Bar */}
            <div style={{
              background: '#131620',
              border: '1px solid #1e2230',
              borderRadius: '14px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: '#6c8ef7' }}>
                  Question {questionIndex + 1} of {totalQuestions}
                </span>
                <span style={{ color: '#3a3f58' }}>•</span>
                <span style={{ fontSize: '11px', textTransform: 'capitalize', color: '#888d9f', background: '#0d0e14', padding: '2px 8px', borderRadius: '4px', border: '1px solid #202434', fontFamily: "'JetBrains Mono', monospace" }}>
                  {currentQuestion.topic}
                </span>
              </div>

              {/* Timer & Exit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#f59e0b' }}>
                  <span>⏱</span>
                  <span>{formatTimer(timeSpent)}</span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to exit the assessment? Your current progress in this session will not be completed.')) {
                      setViewState('overview');
                    }
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid #262b3d',
                    borderRadius: '6px',
                    color: '#7a8099',
                    fontSize: '11px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  Exit Test
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div style={{
              background: '#131620',
              border: '1px solid #1e2230',
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Question Metadata */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: currentQuestion.difficulty === 'easy' ? '#22c55e' : currentQuestion.difficulty === 'hard' ? '#ef4444' : '#f59e0b'
                  }}>
                    {currentQuestion.difficulty}
                  </span>
                  {currentQuestion.subtopic && (
                    <span style={{ fontSize: '11px', color: '#7a8099', fontFamily: "'JetBrains Mono', monospace" }}>
                      • {currentQuestion.subtopic}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e8eaf0', lineHeight: 1.5, margin: 0 }}>
                  {currentQuestion.question || currentQuestion.title}
                </h2>
              </div>

              {/* Code Snippet (if present) */}
              {currentQuestion.codeSnippet && (
                <pre style={{
                  margin: 0,
                  background: '#0a0b0e',
                  border: '1px solid #1e2230',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#d4d8e8',
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto'
                }}>
                  {currentQuestion.codeSnippet}
                </pre>
              )}

              {/* Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentQuestion.options?.map((opt, idx) => {
                  const optId = opt.id || ['A', 'B', 'C', 'D'][idx] || String(idx);
                  const isSelected = selectedOption === optId || selectedOption === idx;

                  // Feedback border / coloring if answered
                  let borderStyle = '1px solid #1e2230';
                  let bgStyle = '#0d0e14';
                  let textColor = '#e8eaf0';

                  if (answerFeedback) {
                    if (optId === answerFeedback.correctOption) {
                      borderStyle = '1px solid #22c55e';
                      bgStyle = 'rgba(34, 197, 94, 0.1)';
                      textColor = '#22c55e';
                    } else if (isSelected && !answerFeedback.isCorrect) {
                      borderStyle = '1px solid #ef4444';
                      bgStyle = 'rgba(239, 68, 68, 0.1)';
                      textColor = '#ef4444';
                    }
                  } else if (isSelected) {
                    borderStyle = '1px solid #6c8ef7';
                    bgStyle = 'rgba(108, 142, 247, 0.12)';
                  }

                  return (
                    <button
                      key={optId}
                      disabled={!!answerFeedback}
                      onClick={() => setSelectedOption(optId)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '10px',
                        background: bgStyle,
                        border: borderStyle,
                        color: textColor,
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: answerFeedback ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSelected ? '#6c8ef7' : '#1a1d2b',
                        color: isSelected ? '#000' : '#888d9f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: "'JetBrains Mono', monospace",
                        flexShrink: 0
                      }}>
                        {optId}
                      </span>
                      <span style={{ flex: 1 }}>{opt.text || opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hint Box (if triggered) */}
              {showHint && currentQuestion.hints && currentQuestion.hints.length > 0 && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(167, 139, 250, 0.08)',
                  border: '1px solid rgba(167, 139, 250, 0.25)',
                  fontSize: '12px',
                  color: '#c084fc'
                }}>
                  <strong>💡 Hint:</strong> {currentQuestion.hints[0]}
                </div>
              )}

              {/* Answer Feedback Banner */}
              {answerFeedback && (
                <div style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: answerFeedback.isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: answerFeedback.isCorrect ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontWeight: 800,
                      color: answerFeedback.isCorrect ? '#22c55e' : '#ef4444',
                      fontSize: '14px',
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {answerFeedback.isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}
                    </span>
                  </div>

                  {answerFeedback.explanation && (
                    <p style={{ fontSize: '12.5px', color: '#ced3e8', lineHeight: 1.5, margin: 0 }}>
                      {answerFeedback.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #1e2230' }}>
                {!answerFeedback ? (
                  <>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: '#1a1d2b',
                        border: '1px solid #2a2e42',
                        color: '#c084fc',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {showHint ? 'Hide Hint' : '💡 Need a Hint?'}
                    </button>

                    <button
                      disabled={!selectedOption || submittingAnswer}
                      onClick={handleSubmitAnswer}
                      style={{
                        padding: '10px 22px',
                        borderRadius: '8px',
                        background: !selectedOption ? '#1a1d2b' : '#6c8ef7',
                        color: !selectedOption ? '#555870' : '#fff',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: !selectedOption ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {submittingAnswer ? 'Submitting...' : 'Submit Answer →'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#6c8ef7',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {answerFeedback.isCompleted || questionIndex + 1 >= totalQuestions
                      ? 'View Diagnostic Skill Report →'
                      : 'Next Adaptive Question →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. ASSESSMENT COMPLETED REPORT VIEW                       */}
        {/* ========================================================= */}
        {viewState === 'completed' && completedReport && (
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Score Banner */}
            <div style={{
              background: '#131620',
              border: '1px solid #1e2230',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>🎉</span>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#e8eaf0', marginBottom: '4px' }}>
                Diagnostic Assessment Complete
              </h1>
              <p style={{ fontSize: '13px', color: '#7a8099', marginBottom: '20px' }}>
                Here is your personalized DSA skill breakdown and study roadmap:
              </p>

              <div style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '18px 36px',
                borderRadius: '16px',
                background: '#0d0e14',
                border: '1px solid #1e2230',
                marginBottom: '16px'
              }}>
                <span style={{ fontSize: '11px', color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  Overall Skill Score
                </span>
                <span style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: getScoreColor(completedReport.overallScore ?? completedReport.score ?? 75),
                  lineHeight: 1.2
                }}>
                  {completedReport.overallScore ?? completedReport.score ?? 75}%
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: getScoreColor(completedReport.overallScore ?? completedReport.score ?? 75) }}>
                  {getScoreLabel(completedReport.overallScore ?? completedReport.score ?? 75)}
                </span>
              </div>
            </div>

            {/* AI Coach Analysis */}
            {completedReport.aiAnalysis && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🧠</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>
                    AI Coach Evaluation
                  </h3>
                </div>
                {completedReport.aiAnalysis.summary && (
                  <p style={{ fontSize: '13.5px', color: '#d4d8e8', lineHeight: 1.6, marginBottom: '14px' }}>
                    {completedReport.aiAnalysis.summary}
                  </p>
                )}
                {completedReport.aiAnalysis.actionPlan && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                      Next Steps:
                    </span>
                    {completedReport.aiAnalysis.actionPlan.map((act, aIdx) => (
                      <div key={aIdx} style={{ fontSize: '12.5px', color: '#a0a5ba', display: 'flex', gap: '6px' }}>
                        <span style={{ color: '#c084fc' }}>•</span>
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setViewState('overview')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#1a1d2b',
                  border: '1px solid #2a2e42',
                  color: '#e8eaf0',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                ← Back to Dashboard
              </button>

              <NavLink
                to="/problems"
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: '#6c8ef7',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Practice Recommended Problems →
              </NavLink>
            </div>
          </div>
        )}
      </main>

      {/* Topic-Specific Test Selection Modal */}
      {topicModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={() => setTopicModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              background: '#11131a',
              border: '1px solid #262a3d',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>
                  Choose Topic to Test
                </h3>
                <p style={{ fontSize: '12px', color: '#7a8099', margin: '2px 0 0' }}>
                  Select one of the 20 DSA domains to start a focused diagnostic test
                </p>
              </div>
              <button onClick={() => setTopicModalOpen(false)} style={{ background: 'none', border: 'none', color: '#7a8099', fontSize: '18px', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '10px',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {ALL_TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleStartAssessment('standard', t.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#0d0e14',
                    border: '1px solid #1e2230',
                    color: '#e8eaf0',
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'border-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6c8ef7')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e2230')}
                >
                  <span>{t.icon}</span>
                  <span style={{ fontWeight: 600 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
