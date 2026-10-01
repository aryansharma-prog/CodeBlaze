import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import axiosClient from '../utils/axiosClient';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/problem/getAllProblem?search=${encodeURIComponent(searchTerm.trim())}&limit=8`);
        if (data && data.data) {
          setResults(data.data);
        }
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleSelectProblem = (id) => {
    onClose();
    navigate(`/problems/${id}`);
  };

  const getDifficultyBadge = (d) => {
    const diff = (d || 'easy').toLowerCase();
    if (diff === 'easy') return <span className="badge-easy px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Easy</span>;
    if (diff === 'medium') return <span className="badge-medium px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Medium</span>;
    return <span className="badge-hard px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Hard</span>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#131620] border border-[#262b3d] rounded-2xl shadow-2xl overflow-hidden z-10 font-sans">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#262b3d] bg-[#0e1017]">
          <svg className="w-5 h-5 text-[#5e6480] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Search problems by name, topic (e.g., Two Sum, Sliding Window)..."
            className="w-full bg-transparent border-none text-white text-sm outline-none placeholder-[#5e6480] font-sans"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-[#5e6480] hover:text-white text-xs px-1.5 py-0.5 rounded bg-[#1a1e2b] cursor-pointer">
              Clear
            </button>
          )}
          <kbd onClick={onClose} className="px-2 py-0.5 text-[10px] font-mono bg-[#1a1e2b] text-[#9aa0b8] rounded border border-[#262b3d] cursor-pointer">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-[#5e6480] font-mono flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#262b3d] border-t-indigo-400 animate-spin-custom"></div>
              Searching problem catalog...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((p) => (
                <div
                  key={p._id}
                  onClick={() => handleSelectProblem(p._id)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1a1e2b] border border-transparent hover:border-[#262b3d] cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#5e6480] group-hover:text-indigo-400 font-bold">
                      #{p.problemNumber || '—'}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-[#5e6480] flex items-center gap-2 mt-0.5 font-mono">
                        <span className="capitalize">{p.topic}</span>
                        {p.subtopic && <span>• {p.subtopic}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getDifficultyBadge(p.difficulty)}
                    <svg className="w-4 h-4 text-[#5e6480] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm.trim() ? (
            <div className="py-8 text-center text-xs text-[#5e6480] font-mono">
              No matching problems found for "{searchTerm}".
            </div>
          ) : (
            <div className="py-6 px-4">
              <div className="text-[11px] font-mono text-[#5e6480] uppercase tracking-wider mb-2">Quick Navigation</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Browse All Problems", path: "/problems" },
                  { name: "DSA Skill Assessment", path: "/recommendations" },
                  { name: "Explore Topics", path: "/explore" },
                  { name: "Progress Analytics", path: "/progress" }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { onClose(); navigate(item.path); }}
                    className="p-2.5 rounded-lg bg-[#0e1017] hover:bg-[#1a1e2b] border border-[#1c202e] hover:border-[#262b3d] text-left text-xs text-[#9aa0b8] hover:text-white transition-all cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
