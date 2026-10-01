import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

const TOPIC_LIST = [
  { id: 'all', label: 'All Topics', icon: '🌐' },
  { id: 'arrays', label: 'Arrays', icon: '📊' },
  { id: 'strings', label: 'Strings', icon: '🔤' },
  { id: 'hashing', label: 'Hashing', icon: '🗝️' },
  { id: 'two-pointers', label: 'Two Pointers', icon: '👉👈' },
  { id: 'sliding-window', label: 'Sliding Window', icon: '🪟' },
  { id: 'stack', label: 'Stack', icon: '🥞' },
  { id: 'queue', label: 'Queue', icon: '🚶' },
  { id: 'linked-list', label: 'Linked List', icon: '🔗' },
  { id: 'binary-search', label: 'Binary Search', icon: '🔍' },
  { id: 'recursion', label: 'Recursion', icon: '🌀' },
  { id: 'backtracking', label: 'Backtracking', icon: '🌲' },
  { id: 'trees', label: 'Trees', icon: '🌳' },
  { id: 'bst', label: 'BST', icon: '⚖️' },
  { id: 'heap', label: 'Heap', icon: '🏔️' },
  { id: 'greedy', label: 'Greedy', icon: '🎯' },
  { id: 'graphs', label: 'Graphs', icon: '🕸️' },
  { id: 'dp', label: 'Dynamic Programming', icon: '⚡' },
  { id: 'bit-manipulation', label: 'Bit Manipulation', icon: '0️⃣1️⃣' },
  { id: 'trie', label: 'Trie', icon: '🔤' },
  { id: 'union-find', label: 'Union Find', icon: '🧩' }
];

export default function ProblemsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);

  // Filter States initialized from URL params if present
  const [search, setSearch] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [topic, setTopic] = useState(searchParams.get('topic') || 'all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('problemNumber');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 25;

  // Bookmarks cache
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set(user?.bookmarkedProblems || []));

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        sortBy,
        order
      });
      if (search.trim()) params.append('search', search.trim());
      if (difficulty !== 'all') params.append('difficulty', difficulty);
      if (topic !== 'all') params.append('topic', topic);
      if (status !== 'all') params.append('status', status);

      const res = await axiosClient.get(`/problem/getAllProblem?${params.toString()}`);
      if (res.data) {
        const pList = Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setProblems(pList.filter(Boolean));
        setTotalProblems(res.data.total || pList.length);
      }
    } catch (err) {
      console.error('Failed to fetch problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, difficulty, topic, status, sortBy, order, page]);

  const handleToggleBookmark = async (problemId, e) => {
    e.stopPropagation();
    try {
      const res = await axiosClient.post('/problem/bookmark', { problemId });
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (res.data?.bookmarked) next.add(problemId);
        else next.delete(problemId);
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const getDifficultyStyle = (d) => {
    const diff = (d || 'easy').toLowerCase();
    if (diff === 'easy') {
      return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)', border: 'rgba(34, 197, 94, 0.3)', label: 'Easy' };
    }
    if (diff === 'medium') {
      return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', label: 'Medium' };
    }
    return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', label: 'Hard' };
  };

  // Quick stats counts
  const statsCounts = useMemo(() => {
    const easy = problems.filter((p) => p.difficulty?.toLowerCase() === 'easy').length;
    const med = problems.filter((p) => p.difficulty?.toLowerCase() === 'medium').length;
    const hard = problems.filter((p) => p.difficulty?.toLowerCase() === 'hard').length;
    const solved = problems.filter((p) => p.isSolved).length;
    return { easy, med, hard, solved, total: totalProblems || problems.length };
  }, [problems, totalProblems]);

  const totalPages = Math.ceil(totalProblems / limit) || 1;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b0e', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: '1360px', margin: '0 auto', padding: '28px 24px 64px' }}>
        {/* Top Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #131620 0%, #10121a 100%)',
          border: '1px solid #1e2230',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '3px 10px', borderRadius: '12px', background: 'rgba(108, 142, 247, 0.12)', border: '1px solid rgba(108, 142, 247, 0.25)', color: '#6c8ef7', fontSize: '11px', fontWeight: 700, marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
              <span>⚡ Curated Problem Catalog</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px' }}>
              DSA Coding Problems
            </h1>
            <p style={{ fontSize: '13px', color: '#7a8099', maxWidth: '600px', lineHeight: 1.5 }}>
              Solve problems with in-workspace AI debugging, multi-language sandbox execution, and real-time testcase feedback.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <NavLink
              to="/recommendations"
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
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
              <span>🎯 Take Skill Assessment</span>
            </NavLink>

            <NavLink
              to="/explore"
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                background: '#1a1d2b',
                border: '1px solid #2a2e42',
                color: '#e8eaf0',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>🗺️ Explore Roadmap</span>
            </NavLink>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div style={{
          background: '#131620',
          border: '1px solid #1e2230',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Main Controls Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#555870', fontSize: '14px' }}>
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by title, #ID, topic..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  background: '#0a0b0e',
                  border: '1px solid #232736',
                  borderRadius: '8px',
                  color: '#e8eaf0',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.15s'
                }}
                onFocus={(e) => (e.target.style.borderColor = '#6c8ef7')}
                onBlur={(e) => (e.target.style.borderColor = '#232736')}
              />
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              style={{
                padding: '9px 12px',
                background: '#0a0b0e',
                border: '1px solid #232736',
                borderRadius: '8px',
                color: '#e8eaf0',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Topic Filter */}
            <select
              value={topic}
              onChange={(e) => { setTopic(e.target.value); setPage(1); }}
              style={{
                padding: '9px 12px',
                background: '#0a0b0e',
                border: '1px solid #232736',
                borderRadius: '8px',
                color: '#e8eaf0',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {TOPIC_LIST.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              style={{
                padding: '9px 12px',
                background: '#0a0b0e',
                border: '1px solid #232736',
                borderRadius: '8px',
                color: '#e8eaf0',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Status</option>
              <option value="solved">✓ Solved</option>
              <option value="unsolved">○ Unsolved</option>
              <option value="attempted">⚡ Attempted</option>
            </select>
          </div>

          {/* Quick Topic Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingTop: '2px',
            scrollbarWidth: 'none'
          }}>
            {TOPIC_LIST.map((t) => {
              const isSelected = topic.toLowerCase() === t.id.toLowerCase() || (t.id === 'all' && topic === 'all');
              return (
                <button
                  key={t.id}
                  onClick={() => { setTopic(t.id); setPage(1); }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: isSelected ? '1px solid #6c8ef7' : '1px solid #1e2230',
                    background: isSelected ? 'rgba(108, 142, 247, 0.15)' : '#0d0e14',
                    color: isSelected ? '#6c8ef7' : '#888d9f'
                  }}
                >
                  <span style={{ fontSize: '11px' }}>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Problems Table */}
        <div style={{
          background: '#131620',
          border: '1px solid #1e2230',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{
                  background: '#0d0e14',
                  borderBottom: '1px solid #1e2230',
                  color: '#555870',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  userSelect: 'none'
                }}>
                  <th style={{ padding: '14px 16px', width: '50px', textAlign: 'center' }}>Status</th>
                  <th
                    onClick={() => handleSort('problemNumber')}
                    style={{ padding: '14px 16px', width: '70px', cursor: 'pointer' }}
                  >
                    # {sortBy === 'problemNumber' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('title')}
                    style={{ padding: '14px 20px', cursor: 'pointer' }}
                  >
                    Title {sortBy === 'title' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th
                    onClick={() => handleSort('difficulty')}
                    style={{ padding: '14px 16px', width: '120px', cursor: 'pointer' }}
                  >
                    Difficulty {sortBy === 'difficulty' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ padding: '14px 20px', width: '220px' }}>Topic / Subtopic</th>
                  <th
                    onClick={() => handleSort('acceptance')}
                    style={{ padding: '14px 20px', width: '120px', textAlign: 'right', cursor: 'pointer' }}
                  >
                    Acceptance {sortBy === 'acceptance' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th style={{ padding: '14px 20px', width: '130px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#7a8099', fontFamily: "'JetBrains Mono', monospace" }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '3px solid rgba(108, 142, 247, 0.2)',
                        borderTopColor: '#6c8ef7',
                        margin: '0 auto 12px',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      <span>Loading problem catalog...</span>
                    </td>
                  </tr>
                ) : problems.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#7a8099' }}>
                      <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>🔍</span>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0', marginBottom: '4px' }}>
                        No problems match your filters
                      </div>
                      <p style={{ fontSize: '12px', color: '#555870' }}>
                        Try adjusting your search query or selecting "All Topics".
                      </p>
                    </td>
                  </tr>
                ) : (
                  problems.map((p, idx) => {
                    const diffBadge = getDifficultyStyle(p.difficulty);
                    const isBookmarked = bookmarkedIds.has(p._id);
                    const probNum = p.problemNumber ? String(p.problemNumber).padStart(3, '0') : String(idx + 1).padStart(3, '0');

                    return (
                      <tr
                        key={p._id}
                        onClick={() => navigate(`/problem/${p._id}`)}
                        style={{
                          borderBottom: '1px solid #181b26',
                          transition: 'background 0.15s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Status */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          {p.isSolved ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: 'rgba(34, 197, 94, 0.15)',
                              color: '#22c55e',
                              fontSize: '11px',
                              fontWeight: 800
                            }}>
                              ✓
                            </span>
                          ) : p.isAttempted ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#f59e0b',
                              fontSize: '11px'
                            }}>
                              ⚡
                            </span>
                          ) : (
                            <span style={{ color: '#2e334a', fontFamily: "'JetBrains Mono', monospace" }}>○</span>
                          )}
                        </td>

                        {/* Number */}
                        <td style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#555870', fontWeight: 700 }}>
                          {probNum}
                        </td>

                        {/* Title */}
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, color: '#e8eaf0', fontSize: '14px' }}>
                              {p.title}
                            </span>
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: "'JetBrains Mono', monospace",
                            background: diffBadge.bg,
                            color: diffBadge.color,
                            border: `1px solid ${diffBadge.border}`
                          }}>
                            {diffBadge.label}
                          </span>
                        </td>

                        {/* Topic & Subtopic */}
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: '#0d0e14',
                              border: '1px solid #202434',
                              color: '#a0a5ba',
                              fontSize: '11px',
                              fontFamily: "'JetBrains Mono', monospace",
                              textTransform: 'capitalize'
                            }}>
                              {p.topic || p.tags || 'General'}
                            </span>
                            {p.subtopic && (
                              <span style={{ fontSize: '11px', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                                • {p.subtopic}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Acceptance */}
                        <td style={{ padding: '14px 20px', textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#888d9f' }}>
                          {p.acceptance?.rate ? `${p.acceptance.rate}%` : '52.4%'}
                        </td>

                        {/* Action Buttons */}
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={(e) => handleToggleBookmark(p._id, e)}
                              title={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
                              style={{
                                background: isBookmarked ? 'rgba(108, 142, 247, 0.15)' : 'none',
                                border: isBookmarked ? '1px solid rgba(108, 142, 247, 0.3)' : '1px solid #232736',
                                borderRadius: '6px',
                                padding: '5px 8px',
                                color: isBookmarked ? '#6c8ef7' : '#555870',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}
                            >
                              {isBookmarked ? '★' : '☆'}
                            </button>

                            <span
                              style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                background: '#1a1d2b',
                                border: '1px solid #2a2e42',
                                color: '#6c8ef7',
                                fontSize: '12px',
                                fontWeight: 700,
                                fontFamily: "'JetBrains Mono', monospace"
                              }}
                            >
                              Solve →
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: '#0d0e14',
            borderTop: '1px solid #1e2230',
            fontSize: '12px',
            fontFamily: "'JetBrains Mono', monospace",
            color: '#7a8099',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              Showing {problems.length} of {totalProblems} problems
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: '#131620',
                  border: '1px solid #1e2230',
                  color: page <= 1 ? '#3a3e52' : '#e8eaf0',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                ← Prev
              </button>

              <span style={{ color: '#e8eaf0' }}>Page {page} of {totalPages}</span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: '#131620',
                  border: '1px solid #1e2230',
                  color: page >= totalPages ? '#3a3e52' : '#e8eaf0',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
