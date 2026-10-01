import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';

const TOPIC_LIST = [
  { id: 'all', label: 'All Topics' },
  { id: 'arrays', label: 'Arrays' },
  { id: 'strings', label: 'Strings' },
  { id: 'hashing', label: 'Hashing' },
  { id: 'two-pointers', label: 'Two Pointers' },
  { id: 'sliding-window', label: 'Sliding Window' },
  { id: 'stack', label: 'Stack' },
  { id: 'queue', label: 'Queue' },
  { id: 'linked-list', label: 'Linked List' },
  { id: 'binary-search', label: 'Binary Search' },
  { id: 'recursion', label: 'Recursion' },
  { id: 'backtracking', label: 'Backtracking' },
  { id: 'trees', label: 'Trees' },
  { id: 'bst', label: 'BST' },
  { id: 'heap', label: 'Heap' },
  { id: 'greedy', label: 'Greedy' },
  { id: 'graphs', label: 'Graphs' },
  { id: 'dp', label: 'Dynamic Programming' },
  { id: 'bit-manipulation', label: 'Bit Manipulation' },
  { id: 'trie', label: 'Trie' },
  { id: 'union-find', label: 'Union Find' }
];

export default function ProblemsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProblems, setTotalProblems] = useState(0);

  // Filter States
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [topic, setTopic] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('problemNumber');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const limit = 25;

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

      const { data } = await axiosClient.get(`/problem/getAllProblem?${params.toString()}`);
      if (data && data.data) {
        setProblems(data.data);
        setTotalProblems(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch problems:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search & filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, difficulty, topic, status, sortBy, order, page]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const getDifficultyBadge = (d) => {
    const diff = (d || 'easy').toLowerCase();
    if (diff === 'easy') return <span className="badge-easy px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase">Easy</span>;
    if (diff === 'medium') return <span className="badge-medium px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase">Med</span>;
    return <span className="badge-hard px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase">Hard</span>;
  };

  const totalPages = Math.ceil(totalProblems / limit) || 1;

  return (
    <div className="min-h-screen bg-[#0a0b0e] flex flex-col font-sans">
      <Navbar />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex-1 flex flex-col space-y-5">
        {/* Page Title & Stats Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0e1017] border border-[#262b3d] rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Problem Catalog
            </h1>
            <p className="text-xs text-[#9aa0b8] mt-1">
              Curated Data Structures and Algorithms problems with integrated AI Mentoring.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/recommendations"
              className="btn-primary text-xs py-2 px-4 shadow-lg shadow-indigo-500/20"
            >
              <span>✨</span>
              <span>Take Skill Assessment</span>
            </NavLink>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="bg-[#0e1017] border border-[#262b3d] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search title, ID, topic..."
                className="w-full bg-[#131620] border border-[#262b3d] focus:border-indigo-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#5e6480] outline-none font-sans"
              />
              <svg className="w-4 h-4 text-[#5e6480] absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Difficulty Filter */}
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              className="bg-[#131620] border border-[#262b3d] text-[#ced3e8] rounded-lg px-3 py-1.5 text-xs font-mono outline-none cursor-pointer"
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
              className="bg-[#131620] border border-[#262b3d] text-[#ced3e8] rounded-lg px-3 py-1.5 text-xs font-mono outline-none cursor-pointer"
            >
              {TOPIC_LIST.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="bg-[#131620] border border-[#262b3d] text-[#ced3e8] rounded-lg px-3 py-1.5 text-xs font-mono outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
              <option value="attempted">Attempted</option>
            </select>
          </div>

          {/* Quick Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {TOPIC_LIST.slice(0, 10).map((t) => (
              <button
                key={t.id}
                onClick={() => { setTopic(t.id); setPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer border ${
                  topic === t.id
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                    : 'bg-[#131620] text-[#9aa0b8] border-[#262b3d] hover:text-white hover:bg-[#1a1e2b]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dense Problems Table */}
        <div className="bg-[#0e1017] border border-[#262b3d] rounded-2xl overflow-hidden shadow-xl flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="border-b border-[#262b3d] bg-[#131620] text-[#5e6480] font-mono text-[11px] uppercase tracking-wider select-none">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th onClick={() => handleSort('problemNumber')} className="py-3 px-3 w-16 cursor-pointer hover:text-white">
                    # {sortBy === 'problemNumber' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('title')} className="py-3 px-4 cursor-pointer hover:text-white">
                    Title {sortBy === 'title' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('difficulty')} className="py-3 px-4 w-24 cursor-pointer hover:text-white">
                    Difficulty {sortBy === 'difficulty' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-4 w-44">Topic / Subtopic</th>
                  <th onClick={() => handleSort('acceptance')} className="py-3 px-4 w-28 text-right cursor-pointer hover:text-white">
                    Acceptance {sortBy === 'acceptance' && (order === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="py-3 px-4 w-24 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#1c202e]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-[#5e6480] font-mono">
                      <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin-custom mx-auto mb-2"></div>
                      Loading problems...
                    </td>
                  </tr>
                ) : problems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-[#5e6480] font-mono">
                      No problems match your current filter criteria.
                    </td>
                  </tr>
                ) : (
                  problems.map((p) => (
                    <tr
                      key={p._id}
                      onClick={() => navigate(`/problems/${p._id}`)}
                      className="hover:bg-[#131620] transition-colors cursor-pointer group"
                    >
                      {/* Solved Status */}
                      <td className="py-3 px-4 text-center">
                        {p.isSolved ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-xs">
                            ✓
                          </span>
                        ) : (
                          <span className="text-[#373e57] text-sm font-mono">—</span>
                        )}
                      </td>

                      {/* Number */}
                      <td className="py-3 px-3 font-mono text-xs text-[#5e6480] group-hover:text-indigo-400 font-bold">
                        {p.problemNumber ? String(p.problemNumber).padStart(3, '0') : '—'}
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {p.title}
                      </td>

                      {/* Difficulty */}
                      <td className="py-3 px-4">
                        {getDifficultyBadge(p.difficulty)}
                      </td>

                      {/* Topic & Subtopic */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-[#1a1e2b] text-[#9aa0b8] border border-[#262b3d] text-[11px] font-mono capitalize">
                            {p.topic}
                          </span>
                          {p.subtopic && (
                            <span className="text-[11px] text-[#5e6480] font-mono">
                              • {p.subtopic}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Acceptance */}
                      <td className="py-3 px-4 text-right font-mono text-xs text-[#9aa0b8]">
                        {p.acceptance?.rate || '50.0'}%
                      </td>

                      {/* Solve Link */}
                      <td className="py-3 px-4 text-right">
                        <span className="px-2.5 py-1 rounded bg-[#1a1e2b] group-hover:bg-indigo-600 text-[#9aa0b8] group-hover:text-white font-mono text-[11px] font-semibold transition-all">
                          Solve →
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#131620] border-t border-[#262b3d] text-xs font-mono text-[#9aa0b8]">
            <div>
              Showing {problems.length} of {totalProblems} problems
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2.5 py-1 rounded bg-[#1a1e2b] hover:bg-[#23283a] disabled:opacity-30 disabled:cursor-not-allowed border border-[#262b3d] cursor-pointer"
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-2.5 py-1 rounded bg-[#1a1e2b] hover:bg-[#23283a] disabled:opacity-30 disabled:cursor-not-allowed border border-[#262b3d] cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
