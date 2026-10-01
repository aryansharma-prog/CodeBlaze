import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get('/problem/bookmarks');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setBookmarks(res.data.data.filter(Boolean));
      } else if (Array.isArray(res.data)) {
        setBookmarks(res.data.filter(Boolean));
      } else {
        setBookmarks([]);
      }
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setError('Could not load bookmarks.');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (problemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await axiosClient.post('/problem/bookmark', { problemId });
      setBookmarks((prev) => prev.filter((p) => p._id !== problemId));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

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

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '36px 24px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>🔖</span>
              <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>Bookmarked Problems</h1>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'rgba(108, 142, 247, 0.12)',
                color: '#6c8ef7',
                border: '1px solid rgba(108, 142, 247, 0.25)',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                {bookmarks.length} Saved
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#7a8099' }}>
              Quick access to problems you have saved for revision, study, or follow-up practice.
            </p>
          </div>

          <NavLink
            to="/problems"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#131620',
              border: '1px solid #1e2230',
              color: '#e8eaf0',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            ← Back to Problems
          </NavLink>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            background: '#131620',
            border: '1px solid #1e2230',
            borderRadius: '12px',
            color: '#7a8099'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(108, 142, 247, 0.2)',
              borderTopColor: '#6c8ef7',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 0.8s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span>Loading bookmarks...</span>
          </div>
        ) : error ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            background: '#131620',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#ef4444'
          }}>
            <p style={{ marginBottom: '16px' }}>{error}</p>
            <button
              onClick={fetchBookmarks}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Retry
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <div style={{
            padding: '64px 24px',
            textAlign: 'center',
            background: '#131620',
            border: '1px solid #1e2230',
            borderRadius: '12px',
            color: '#7a8099'
          }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>🔖</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e8eaf0', marginBottom: '8px' }}>
              No bookmarked problems yet
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              While solving problems, click the bookmark icon on any problem panel to save it to your revision list.
            </p>
            <NavLink
              to="/problems"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#6c8ef7',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              Explore Problems →
            </NavLink>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {bookmarks.map((problem) => {
              const diffColor = getDifficultyColor(problem.difficulty);
              const num = String(problem.problemNumber || 0).padStart(3, '0');

              return (
                <div
                  key={problem._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: '#131620',
                    border: '1px solid #1e2230',
                    borderRadius: '12px',
                    transition: 'border-color 0.15s, transform 0.15s',
                    gap: '16px'
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#555870', width: '32px' }}>
                      {num}
                    </span>

                    <div style={{ minWidth: 0 }}>
                      <NavLink
                        to={`/problem/${problem._id}`}
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#e8eaf0',
                          textDecoration: 'none',
                          display: 'inline-block',
                          marginBottom: '4px'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#6c8ef7')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#e8eaf0')}
                      >
                        {problem.title}
                      </NavLink>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          color: diffColor,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: `${diffColor}15`,
                          border: `1px solid ${diffColor}30`,
                          fontFamily: "'JetBrains Mono', monospace"
                        }}>
                          {problem.difficulty}
                        </span>

                        {problem.tags && (
                          <span style={{ fontSize: '11px', color: '#7a8099', background: '#0a0b0e', padding: '1px 6px', borderRadius: '4px' }}>
                            {problem.tags}
                          </span>
                        )}

                        {problem.subtopic && (
                          <span style={{ fontSize: '11px', color: '#6c8ef7', background: 'rgba(108, 142, 247, 0.08)', padding: '1px 6px', borderRadius: '4px' }}>
                            {problem.subtopic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <NavLink
                      to={`/problem/${problem._id}`}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '6px',
                        background: '#1a1d2b',
                        border: '1px solid #2a2e42',
                        color: '#6c8ef7',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none'
                      }}
                    >
                      Solve →
                    </NavLink>

                    <button
                      onClick={(e) => removeBookmark(problem._id, e)}
                      title="Remove bookmark"
                      style={{
                        padding: '7px 10px',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        color: '#ef4444',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
