import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

export default function SubmissionsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [langFilter, setLangFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Code inspection modal state
  const [selectedSub, setSelectedSub] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get('/submission/history');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSubmissions(res.data.data);
      } else if (Array.isArray(res.data)) {
        setSubmissions(res.data);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
      setError(err.response?.data?.message || 'Failed to load submission history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    if (s.includes('ACCEPTED')) {
      return {
        label: 'Accepted',
        color: '#22c55e',
        bg: 'rgba(34, 197, 94, 0.12)',
        border: 'rgba(34, 197, 94, 0.3)'
      };
    }
    if (s.includes('WRONG')) {
      return {
        label: 'Wrong Answer',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        border: 'rgba(239, 68, 68, 0.3)'
      };
    }
    if (s.includes('TIME')) {
      return {
        label: 'Time Limit Exceeded',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        border: 'rgba(245, 158, 11, 0.3)'
      };
    }
    if (s.includes('COMPILATION')) {
      return {
        label: 'Compilation Error',
        color: '#a855f7',
        bg: 'rgba(168, 85, 247, 0.12)',
        border: 'rgba(168, 85, 247, 0.3)'
      };
    }
    return {
      label: status || 'Runtime Error',
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.12)',
      border: 'rgba(249, 115, 22, 0.3)'
    };
  };

  const filteredSubmissions = submissions.filter((sub) => {
    // Status filter
    if (statusFilter !== 'ALL') {
      const s = String(sub.status || '').toUpperCase();
      if (statusFilter === 'ACCEPTED' && !s.includes('ACCEPTED')) return false;
      if (statusFilter === 'WRONG_ANSWER' && !s.includes('WRONG')) return false;
      if (statusFilter === 'RUNTIME_ERROR' && (!s.includes('RUNTIME') && !s.includes('ERROR'))) return false;
      if (statusFilter === 'TLE' && !s.includes('TIME')) return false;
    }

    // Language filter
    if (langFilter !== 'ALL') {
      const l = String(sub.language || '').toLowerCase();
      if (langFilter.toLowerCase() !== l) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const pTitle = sub.problemId?.title ? sub.problemId.title.toLowerCase() : '';
      if (!pTitle.includes(q)) return false;
    }

    return true;
  });

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0e', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 64px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '24px' }}>📑</span>
              <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>My Submissions</h1>
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
                {submissions.length} Total
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#7a8099' }}>
              Complete history of your code executions, memory benchmarks, and verdict traces.
            </p>
          </div>

          <NavLink
            to="/problems"
            style={{
              padding: '10px 18px',
              borderRadius: '9px',
              background: '#6c8ef7',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(108, 142, 247, 0.25)'
            }}
          >
            <span>⚡ Solve Problems</span>
          </NavLink>
        </div>

        {/* Filters Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          background: '#131620',
          border: '1px solid #1e2230',
          borderRadius: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555870', fontSize: '14px' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by problem title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: '#0a0b0e',
                border: '1px solid #2a2e42',
                borderRadius: '8px',
                color: '#e8eaf0',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Verdict:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#0a0b0e',
                border: '1px solid #2a2e42',
                borderRadius: '8px',
                color: '#e8eaf0',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Verdicts</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="WRONG_ANSWER">Wrong Answer</option>
              <option value="RUNTIME_ERROR">Runtime / Error</option>
              <option value="TLE">Time Limit Exceeded</option>
            </select>
          </div>

          {/* Language Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
              Language:
            </span>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                background: '#0a0b0e',
                border: '1px solid #2a2e42',
                borderRadius: '8px',
                color: '#e8eaf0',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="ALL">All Languages</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
        </div>

        {/* Submissions Table / List */}
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
            <span>Loading submission records...</span>
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
              onClick={fetchSubmissions}
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
        ) : filteredSubmissions.length === 0 ? (
          <div style={{
            padding: '64px 24px',
            textAlign: 'center',
            background: '#131620',
            border: '1px solid #1e2230',
            borderRadius: '12px',
            color: '#7a8099'
          }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }}>🎯</span>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#e8eaf0', marginBottom: '8px' }}>
              No submissions found
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.5 }}>
              {searchQuery || statusFilter !== 'ALL' || langFilter !== 'ALL'
                ? 'Try adjusting your filters to see more results.'
                : 'Start solving coding problems to build your submission record and unlock insights.'}
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
              Browse Problems →
            </NavLink>
          </div>
        ) : (
          <div style={{
            background: '#131620',
            border: '1px solid #1e2230',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#0d0e14', borderBottom: '1px solid #1e2230', color: '#555870', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Problem</th>
                    <th style={{ padding: '14px 20px' }}>Language</th>
                    <th style={{ padding: '14px 20px' }}>Runtime</th>
                    <th style={{ padding: '14px 20px' }}>Memory</th>
                    <th style={{ padding: '14px 20px' }}>Submitted</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub, index) => {
                    const badge = getStatusBadge(sub.status);
                    const probId = sub.problemId?._id || sub.problemId;
                    const probTitle = sub.problemId?.title || 'Problem #' + (sub.problemId?.problemNumber || index + 1);
                    const formattedDate = sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Recently';

                    return (
                      <tr
                        key={sub._id || index}
                        style={{
                          borderBottom: '1px solid #181b26',
                          transition: 'background 0.15s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        onClick={() => setSelectedSub(sub)}
                      >
                        {/* Status */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }} />
                            {badge.label}
                          </span>
                        </td>

                        {/* Problem */}
                        <td style={{ padding: '16px 20px' }}>
                          <NavLink
                            to={`/problem/${probId}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              color: '#e8eaf0',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#6c8ef7')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#e8eaf0')}
                          >
                            <span>{probTitle}</span>
                            <span style={{ fontSize: '11px', color: '#555870' }}>↗</span>
                          </NavLink>
                        </td>

                        {/* Language */}
                        <td style={{ padding: '16px 20px', fontFamily: "'JetBrains Mono', monospace", color: '#a0a5ba' }}>
                          {sub.language ? sub.language.toUpperCase() : 'C++'}
                        </td>

                        {/* Runtime */}
                        <td style={{ padding: '16px 20px', fontFamily: "'JetBrains Mono', monospace", color: '#888d9f' }}>
                          {sub.runtime ? `${sub.runtime} ms` : '—'}
                        </td>

                        {/* Memory */}
                        <td style={{ padding: '16px 20px', fontFamily: "'JetBrains Mono', monospace", color: '#888d9f' }}>
                          {sub.memory ? `${(sub.memory / 1024).toFixed(1)} MB` : '—'}
                        </td>

                        {/* Submitted */}
                        <td style={{ padding: '16px 20px', color: '#686d82', fontSize: '12px' }}>
                          {formattedDate}
                        </td>

                        {/* Action */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSub(sub);
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              background: '#1a1d2b',
                              border: '1px solid #2a2e42',
                              color: '#6c8ef7',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            View Code
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Code Inspection Modal */}
      {selectedSub && (
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
          onClick={() => setSelectedSub(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '840px',
              maxHeight: '90vh',
              background: '#11131a',
              border: '1px solid #262a3d',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #1e2230',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0d0e14'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: getStatusBadge(selectedSub.status).bg,
                    color: getStatusBadge(selectedSub.status).color,
                    border: `1px solid ${getStatusBadge(selectedSub.status).border}`
                  }}>
                    {getStatusBadge(selectedSub.status).label}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#e8eaf0' }}>
                    {selectedSub.problemId?.title || 'Problem Submission'}
                  </h3>
                </div>
                <div style={{ fontSize: '12px', color: '#686d82', display: 'flex', gap: '14px', fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>Lang: <strong style={{ color: '#a0a5ba' }}>{selectedSub.language?.toUpperCase() || 'C++'}</strong></span>
                  {selectedSub.runtime && <span>Runtime: <strong style={{ color: '#a0a5ba' }}>{selectedSub.runtime} ms</strong></span>}
                  {selectedSub.memory && <span>Memory: <strong style={{ color: '#a0a5ba' }}>{(selectedSub.memory / 1024).toFixed(1)} MB</strong></span>}
                  {selectedSub.testCasesPassed !== undefined && (
                    <span>Testcases: <strong style={{ color: '#a0a5ba' }}>{selectedSub.testCasesPassed} / {selectedSub.totalTestCases || 0}</strong></span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedSub(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#686d82',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Code Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#0a0b0e', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
                <button
                  onClick={() => handleCopyCode(selectedSub.code)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#1a1d2b',
                    border: '1px solid #2a2e42',
                    color: copied ? '#22c55e' : '#a0a5ba',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copied ? '✓ Copied' : '📋 Copy Code'}
                </button>
              </div>

              <pre style={{
                margin: 0,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#d4d8e8',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {selectedSub.code || '// No code recorded for this submission'}
              </pre>

              {/* Error log if compilation/runtime error */}
              {selectedSub.errorMessage && (
                <div style={{
                  marginTop: '20px',
                  padding: '14px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
                    Error Output:
                  </div>
                  <pre style={{
                    margin: 0,
                    fontSize: '12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#f87171',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedSub.errorMessage}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #1e2230',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#0d0e14'
            }}>
              <span style={{ fontSize: '12px', color: '#555870' }}>
                Submission ID: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{selectedSub._id}</span>
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <NavLink
                  to={`/problem/${selectedSub.problemId?._id || selectedSub.problemId}`}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#6c8ef7',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  Open in Workspace →
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
