import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

export default function Homepage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [problems, setProblems] = useState([]);
  const [recentDraft, setRecentDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, recsRes, probsRes] = await Promise.allSettled([
        axiosClient.get('/progress/stats'),
        axiosClient.get('/assessment/recommendations'),
        axiosClient.get('/problem/getAllProblem')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.data);
      }
      if (recsRes.status === 'fulfilled' && recsRes.value.data?.success) {
        setRecommendations(recsRes.value.data.data);
      }
      if (probsRes.status === 'fulfilled') {
        const pData = Array.isArray(probsRes.value.data)
          ? probsRes.value.data
          : probsRes.value.data?.data || [];
        setProblems(pData.filter(Boolean));
      }

      // Check localStorage for last opened/drafted problem
      const lastProbId = localStorage.getItem('codeblaze_last_problem_id');
      const lastProbTitle = localStorage.getItem('codeblaze_last_problem_title');
      if (lastProbId) {
        setRecentDraft({ id: lastProbId, title: lastProbTitle || 'Two Sum' });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const solvedCount = stats?.solvedCount ?? (user?.problemSolved?.length || 0);
  const streak = stats?.streak ?? (user?.streak || 0);
  const acceptance = stats?.acceptanceRate || '0%';
  const topicPerf = stats?.topicPerformance || [];

  // Weak areas
  const weakTopics = recommendations?.weakTopics || topicPerf.filter((t) => t.score < 50);

  // Recommended problems
  const recommendedProblems = recommendations?.recommendedProblems?.length
    ? recommendations.recommendedProblems.slice(0, 4)
    : problems.slice(0, 4);

  // Continue problem fallback
  const continueProblem = recentDraft || (problems.length > 0 ? { id: problems[0]._id, title: problems[0].title } : null);

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6c8ef7';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0e', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #131620 0%, #10121a 100%)',
          border: '1px solid #1e2230',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '16px', background: 'rgba(108, 142, 247, 0.12)', border: '1px solid rgba(108, 142, 247, 0.25)', color: '#6c8ef7', fontSize: '12px', fontWeight: 700, marginBottom: '16px' }}>
              <span>⚡ Welcome to CodeBlaze</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.8px', marginBottom: '12px', lineHeight: 1.2 }}>
              Master DSA with Real-Time AI Mentorship & Personalized Coaching
            </h1>
            <p style={{ fontSize: '14px', color: '#888d9f', lineHeight: 1.6, marginBottom: '24px' }}>
              Solve curated algorithmic problems, debug code with an AI mentor that understands your runtime and syntax errors, and unlock adaptive assessments targeting your weak subtopics.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <NavLink
                to="/problems"
                style={{
                  padding: '11px 22px',
                  borderRadius: '8px',
                  background: '#6c8ef7',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(108, 142, 247, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>⚡ Browse Problems</span>
              </NavLink>

              <NavLink
                to="/recommendations"
                style={{
                  padding: '11px 22px',
                  borderRadius: '8px',
                  background: '#1a1d2b',
                  border: '1px solid #2a2e42',
                  color: '#e8eaf0',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🎯 Take DSA Assessment</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Solved */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                Problems Solved
              </span>
              <span style={{ fontSize: '18px' }}>⚡</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#e8eaf0', marginBottom: '4px' }}>
              {solvedCount}
            </div>
            <div style={{ fontSize: '12px', color: '#7a8099' }}>
              Across 20 algorithmic categories
            </div>
          </div>

          {/* Acceptance */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                Acceptance Rate
              </span>
              <span style={{ fontSize: '18px' }}>🎯</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#22c55e', marginBottom: '4px' }}>
              {acceptance}
            </div>
            <div style={{ fontSize: '12px', color: '#7a8099' }}>
              Accuracy over all submissions
            </div>
          </div>

          {/* Streak */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                Current Streak
              </span>
              <span style={{ fontSize: '18px' }}>🔥</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', marginBottom: '4px' }}>
              {streak} <span style={{ fontSize: '14px', fontWeight: 600, color: '#7a8099' }}>days</span>
            </div>
            <div style={{ fontSize: '12px', color: '#7a8099' }}>
              {streak > 0 ? 'Keep the momentum going!' : 'Solve 1 problem today to start'}
            </div>
          </div>

          {/* AI Mentor Callout */}
          <div style={{ background: 'rgba(108, 142, 247, 0.08)', border: '1px solid rgba(108, 142, 247, 0.25)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6c8ef7', fontFamily: "'JetBrains Mono', monospace" }}>
                AI Mentor Ready
              </span>
              <span style={{ fontSize: '18px' }}>🤖</span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8eaf0', marginBottom: '6px' }}>
              In-Editor Debug & Hints
            </div>
            <div style={{ fontSize: '12px', color: '#a0a5ba' }}>
              AI analyzes your actual code and compiler errors without spoiling solutions.
            </div>
          </div>
        </div>

        {/* Main Content Grid: Continue Coding & Weak Areas | Recommended Problems */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Continue Coding Card */}
            {continueProblem && (
              <div style={{
                background: '#131620',
                border: '1px solid #1e2230',
                borderRadius: '14px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>▶️</span>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0' }}>Continue Coding</h3>
                  </div>
                  <span style={{ fontSize: '11px', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                    Last Active
                  </span>
                </div>

                <div style={{
                  background: '#0d0e14',
                  border: '1px solid #1e2230',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0', marginBottom: '4px' }}>
                      {continueProblem.title}
                    </h4>
                    <span style={{ fontSize: '12px', color: '#7a8099' }}>
                      Pick up right where you left off with auto-saved editor drafts.
                    </span>
                  </div>

                  <NavLink
                    to={`/problem/${continueProblem.id}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#6c8ef7',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Resume →
                  </NavLink>
                </div>
              </div>
            )}

            {/* Weak Areas / Skills Diagnostic Card */}
            <div style={{
              background: '#131620',
              border: '1px solid #1e2230',
              borderRadius: '14px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0', marginBottom: '2px' }}>
                    Personalized Skill Diagnostics
                  </h3>
                  <p style={{ fontSize: '12px', color: '#7a8099' }}>
                    Topics and subtopics identified by your assessment performance
                  </p>
                </div>

                <NavLink to="/recommendations" style={{ fontSize: '12px', color: '#6c8ef7', textDecoration: 'none', fontWeight: 600 }}>
                  Take Test →
                </NavLink>
              </div>

              {weakTopics && weakTopics.length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {weakTopics.slice(0, 3).map((w, idx) => (
                    <div
                      key={w.topic || idx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.06)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#e8eaf0', marginBottom: '2px' }}>
                          🔴 {w.topic || w}
                        </div>
                        <div style={{ fontSize: '11px', color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>
                          Score: {w.score !== undefined ? `${w.score}%` : 'Needs Practice'}
                        </div>
                      </div>

                      <NavLink
                        to={`/recommendations?topic=${encodeURIComponent(w.topic || w)}`}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          fontSize: '11px',
                          fontWeight: 700,
                          textDecoration: 'none'
                        }}
                      >
                        Target Practice →
                      </NavLink>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  background: '#0d0e14',
                  borderRadius: '10px',
                  border: '1px solid #1e2230'
                }}>
                  <p style={{ fontSize: '13px', color: '#7a8099', marginBottom: '12px' }}>
                    Take a 5-question adaptive assessment to map out your DSA strengths and weaknesses.
                  </p>
                  <NavLink
                    to="/recommendations"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#6c8ef7',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    Start Quick Assessment →
                  </NavLink>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recommended Problems */}
          <div style={{
            background: '#131620',
            border: '1px solid #1e2230',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0', marginBottom: '2px' }}>
                  Recommended For You
                </h3>
                <p style={{ fontSize: '12px', color: '#7a8099' }}>
                  Curated problems tailored to boost your algorithmic intuition
                </p>
              </div>

              <NavLink to="/problems" style={{ fontSize: '12px', color: '#6c8ef7', textDecoration: 'none', fontWeight: 600 }}>
                View All →
              </NavLink>
            </div>

            {recommendedProblems.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#7a8099' }}>
                No recommendations available yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px', flex: 1 }}>
                {recommendedProblems.map((prob, idx) => {
                  const pId = prob._id || prob.id;
                  const diff = prob.difficulty || 'medium';
                  const diffColor = getDifficultyColor(diff);

                  return (
                    <NavLink
                      key={pId || idx}
                      to={`/problem/${pId}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px',
                        background: '#0d0e14',
                        border: '1px solid #1e2230',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        transition: 'border-color 0.15s, transform 0.15s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#2e334a';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#1e2230';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ minWidth: 0, paddingRight: '12px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#e8eaf0', marginBottom: '4px' }}>
                          {prob.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'capitalize',
                            color: diffColor,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: `${diffColor}15`,
                            fontFamily: "'JetBrains Mono', monospace"
                          }}>
                            {diff}
                          </span>
                          {prob.tags && (
                            <span style={{ fontSize: '11px', color: '#7a8099' }}>
                              {prob.tags}
                            </span>
                          )}
                          {prob.reason && (
                            <span style={{ fontSize: '11px', color: '#6c8ef7', fontStyle: 'italic' }}>
                              • {prob.reason}
                            </span>
                          )}
                        </div>
                      </div>

                      <span style={{ color: '#6c8ef7', fontSize: '14px' }}>→</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
