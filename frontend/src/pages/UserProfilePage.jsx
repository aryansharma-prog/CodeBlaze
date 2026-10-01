import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import Navbar from '../components/Navbar';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [statsRes, assessRes, subRes] = await Promise.allSettled([
        axiosClient.get('/progress/stats'),
        axiosClient.get('/assessment/history'),
        axiosClient.get('/submission/history')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data?.success) {
        setStats(statsRes.value.data.data);
      }
      if (assessRes.status === 'fulfilled' && assessRes.value.data?.success) {
        setAssessments(assessRes.value.data.data);
      }
      if (subRes.status === 'fulfilled' && subRes.value.data?.success) {
        setSubmissions(subRes.value.data.data);
      }
    } catch (err) {
      console.error('Error loading profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (err) {
      navigate('/login');
    }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Member';

  const solvedTotal = stats?.solvedCount || user?.problemSolved?.length || 0;
  const streak = stats?.streak ?? (user?.streak || 0);
  const acceptance = stats?.acceptanceRate || '0%';
  const easySolved = stats?.easySolved || 0;
  const mediumSolved = stats?.mediumSolved || 0;
  const hardSolved = stats?.hardSolved || 0;
  const topicPerf = stats?.topicPerformance || [];

  const strongTopics = topicPerf.filter((t) => t.score >= 70);
  const weakTopics = topicPerf.filter((t) => t.score < 50);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0e', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px 64px' }}>
        {/* Profile Header */}
        <div style={{
          background: '#131620',
          border: '1px solid #1e2230',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c8ef7, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 8px 24px rgba(108, 142, 247, 0.3)'
            }}>
              {(user?.firstName || 'U')[0].toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800 }}>
                  {user?.firstName} {user?.lastName || ''}
                </h1>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: 'rgba(108, 142, 247, 0.12)',
                  color: '#6c8ef7',
                  border: '1px solid rgba(108, 142, 247, 0.25)',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {user?.role === 'admin' ? 'ADMIN' : 'CODER'}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#7a8099', fontFamily: "'JetBrains Mono', monospace", marginBottom: '6px' }}>
                {user?.emailId}
              </p>
              <div style={{ fontSize: '12px', color: '#555870' }}>
                Joined {joinDate} • Active on CodeBlaze
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <NavLink
              to="/recommendations"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#6c8ef7',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🎯 Take Assessment</span>
            </NavLink>
            <button
              onClick={handleLogout}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                background: '#1a1d2b',
                border: '1px solid #2a2e42',
                color: '#f87171',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Solved Card */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                Problems Solved
              </span>
              <span style={{ fontSize: '18px' }}>⚡</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#e8eaf0', marginBottom: '12px' }}>
              {solvedTotal}
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ color: '#22c55e' }}>{easySolved} Easy</span>
              <span style={{ color: '#f59e0b' }}>{mediumSolved} Med</span>
              <span style={{ color: '#ef4444' }}>{hardSolved} Hard</span>
            </div>
          </div>

          {/* Streak Card */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                Current Streak
              </span>
              <span style={{ fontSize: '18px' }}>🔥</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', marginBottom: '12px' }}>
              {streak} <span style={{ fontSize: '16px', fontWeight: 600, color: '#7a8099' }}>days</span>
            </div>
            <div style={{ fontSize: '12px', color: '#7a8099' }}>
              {streak > 0 ? 'Consistent practice leads to mastery!' : 'Solve a problem today to ignite your streak!'}
            </div>
          </div>

          {/* Accuracy Card */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                Acceptance Rate
              </span>
              <span style={{ fontSize: '18px' }}>🎯</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e', marginBottom: '12px' }}>
              {acceptance}
            </div>
            <div style={{ fontSize: '12px', color: '#7a8099' }}>
              {submissions.length} Total Submissions Analyzed
            </div>
          </div>

          {/* Assessment Count */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                Assessments Completed
              </span>
              <span style={{ fontSize: '18px' }}>📋</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#a78bfa', marginBottom: '12px' }}>
              {assessments.length}
            </div>
            <div style={{ fontSize: '12px', color: '#7a8099' }}>
              Diagnostic evaluations recorded
            </div>
          </div>
        </div>

        {/* Two-Column Section: Strengths & Weaknesses | Recent Assessments */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
          {/* Diagnostic Skill Radar */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>DSA Topic Diagnostics</h2>
              <NavLink to="/progress" style={{ fontSize: '12px', color: '#6c8ef7', textDecoration: 'none', fontWeight: 600 }}>
                View Full Analytics →
              </NavLink>
            </div>

            {topicPerf.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#7a8099' }}>
                <p style={{ marginBottom: '14px', fontSize: '13px' }}>
                  No topic performance data yet. Take an adaptive assessment to generate your skill breakdown.
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
                  Start Assessment →
                </NavLink>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {topicPerf.slice(0, 6).map((tp) => {
                  const score = tp.score || 0;
                  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#6c8ef7' : score >= 40 ? '#f59e0b' : '#ef4444';

                  return (
                    <div key={tp.topic}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ fontWeight: 600 }}>{tp.topic}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", color, fontWeight: 700 }}>
                          {score} / 100
                        </span>
                      </div>
                      <div style={{ height: '6px', background: '#0d0e14', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assessment History */}
          <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Assessment History</h2>
              <NavLink to="/recommendations" style={{ fontSize: '12px', color: '#6c8ef7', textDecoration: 'none', fontWeight: 600 }}>
                New Test →
              </NavLink>
            </div>

            {assessments.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#7a8099' }}>
                <p style={{ marginBottom: '14px', fontSize: '13px' }}>
                  You haven't completed any assessments yet.
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
                  Take 5-Min Diagnostic →
                </NavLink>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {assessments.slice(0, 5).map((a) => {
                  const dateStr = a.completedAt
                    ? new Date(a.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Recently';
                  const score = a.overallScore || 0;
                  const scoreColor = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';

                  return (
                    <div
                      key={a._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: '#0d0e14',
                        border: '1px solid #1e2230',
                        borderRadius: '10px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#e8eaf0', marginBottom: '2px' }}>
                          {a.mode ? a.mode.toUpperCase() : 'STANDARD'} ASSESSMENT
                        </div>
                        <div style={{ fontSize: '11px', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                          {dateStr} • {a.questions?.length || 0} Questions
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 800,
                          color: scoreColor,
                          fontFamily: "'JetBrains Mono', monospace"
                        }}>
                          {score}%
                        </span>
                      </div>
                    </div>
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
