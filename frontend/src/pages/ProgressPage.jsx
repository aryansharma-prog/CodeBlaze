import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

export default function ProgressPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get('/progress/progress-stats');
        if (data && data.data) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch progress stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Build 26-week activity heatmap from real submission data
  const renderHeatmap = () => {
    const activityMap = stats?.activityMap || {};
    const today = new Date();
    const cells = [];

    for (let i = 181; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = activityMap[dateStr] || 0;

      let bg = '#131620';
      let border = '1px solid #1e2230';
      if (count === 1) {
        bg = 'rgba(16, 185, 129, 0.3)';
        border = '1px solid rgba(16, 185, 129, 0.4)';
      } else if (count === 2) {
        bg = 'rgba(16, 185, 129, 0.6)';
        border = '1px solid rgba(16, 185, 129, 0.7)';
      } else if (count >= 3) {
        bg = '#10b981';
        border = '1px solid #34d399';
      }

      cells.push(
        <div
          key={dateStr}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '3px',
            background: bg,
            border,
            cursor: 'pointer',
            transition: 'transform 0.1s'
          }}
          title={`${dateStr}: ${count} submission${count === 1 ? '' : 's'}`}
        />
      );
    }

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-start' }}>
        {cells}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0e', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, BlinkMacSystemFont, sans-serif", display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px 64px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#131620',
          border: '1px solid #1e2230',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#e8eaf0', letterSpacing: '-0.5px', margin: '0 0 4px' }}>
              Progress & Mastery Analytics
            </h1>
            <p style={{ fontSize: '13px', color: '#7a8099', margin: 0 }}>
              Detailed tracking of your problem-solving volume, submission accuracy, and topic strengths.
            </p>
          </div>

          <NavLink
            to="/recommendations"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#6c8ef7',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(108, 142, 247, 0.25)'
            }}
          >
            <span>🎯</span>
            <span>Assess Weaknesses</span>
          </NavLink>
        </div>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#5e6480', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '3px solid rgba(108, 142, 247, 0.2)',
              borderTopColor: '#6c8ef7',
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Loading analytics...
          </div>
        ) : stats ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top Stat Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Problems Solved
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#e8eaf0', fontFamily: "'JetBrains Mono', monospace", marginTop: '6px' }}>
                  {stats.solvedCount} <span style={{ fontSize: '13px', fontWeight: 400, color: '#5e6480' }}>/ {stats.totalProblems}</span>
                </div>
              </div>

              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Acceptance Rate
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#22c55e', fontFamily: "'JetBrains Mono', monospace", marginTop: '6px' }}>
                  {stats.acceptanceRate}%
                </div>
              </div>

              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Active Streak
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace", marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔥</span>
                  <span>{stats.streak} days</span>
                </div>
              </div>

              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '14px', padding: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Total Submissions
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#6c8ef7', fontFamily: "'JetBrains Mono', monospace", marginTop: '6px' }}>
                  {stats.totalSubmissions}
                </div>
              </div>
            </div>

            {/* Difficulty Breakdown & Heatmap Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {/* Difficulty Breakdown Card */}
              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>Difficulty Breakdown</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa0b8', marginBottom: '6px' }}>
                      <span style={{ color: '#22c55e', fontWeight: 700 }}>Easy</span>
                      <span>{stats.easySolved} Solved</span>
                    </div>
                    <div style={{ width: '100%', background: '#0d0e14', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#22c55e', borderRadius: '4px', width: `${Math.min(100, Math.max(stats.easySolved > 0 ? 8 : 0, stats.easySolved * 15))}%` }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa0b8', marginBottom: '6px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>Medium</span>
                      <span>{stats.mediumSolved} Solved</span>
                    </div>
                    <div style={{ width: '100%', background: '#0d0e14', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#f59e0b', borderRadius: '4px', width: `${Math.min(100, Math.max(stats.mediumSolved > 0 ? 8 : 0, stats.mediumSolved * 20))}%` }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9aa0b8', marginBottom: '6px' }}>
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>Hard</span>
                      <span>{stats.hardSolved} Solved</span>
                    </div>
                    <div style={{ width: '100%', background: '#0d0e14', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#ef4444', borderRadius: '4px', width: `${Math.min(100, Math.max(stats.hardSolved > 0 ? 8 : 0, stats.hardSolved * 30))}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submission Heatmap Card */}
              <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>Submission Activity Heatmap</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#5e6480' }}>
                    <span>Less</span>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#131620', border: '1px solid #1e2230' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(16, 185, 129, 0.3)' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(16, 185, 129, 0.6)' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }} />
                    <span>More</span>
                  </div>
                </div>
                <div style={{ overflowX: 'auto', padding: '8px 0' }}>
                  {renderHeatmap()}
                </div>
              </div>
            </div>

            {/* Topic Mastery Grid */}
            <div style={{ background: '#131620', border: '1px solid #1e2230', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#e8eaf0', margin: 0 }}>Topic Performance Mastery</h2>
                <span style={{ fontSize: '11px', color: '#5e6480', fontFamily: "'JetBrains Mono', monospace" }}>
                  Calculated from diagnostic assessments & solved problems
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px'
              }}>
                {stats.topicStats?.map((t, idx) => {
                  const score = t.score || 0;
                  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#6c8ef7' : score >= 40 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={idx} style={{ background: '#0d0e14', border: '1px solid #1e2230', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, color: '#e8eaf0', fontSize: '12px' }}>{t.name}</span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          color,
                          background: `${color}15`,
                          border: `1px solid ${color}30`
                        }}>
                          {score}%
                        </span>
                      </div>

                      <div style={{ width: '100%', background: '#181b26', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: color, width: `${Math.max(5, score)}%` }} />
                      </div>

                      <div style={{ fontSize: '10.5px', color: '#5e6480', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t.solvedCount} solved</span>
                        <span style={{ textTransform: 'capitalize' }}>{t.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '80px', textAlign: 'center', fontSize: '13px', color: '#5e6480', fontFamily: "'JetBrains Mono', monospace" }}>
            Please sign in to view your progress analytics.
          </div>
        )}
      </main>
    </div>
  );
}
