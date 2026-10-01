import React, { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

export default function ProblemDescriptionPanel({
  problem,
  isSolved = false,
  isBookmarked = false,
  onToggleBookmark = () => {},
  submissions = [],
  onSelectSubmission = () => {}
}) {
  const [activeTab, setActiveTab] = useState('description');
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showEditorialSolution, setShowEditorialSolution] = useState(false);
  const [openHintIndex, setOpenHintIndex] = useState(null);

  // Load Note
  useEffect(() => {
    if (!problem?._id) return;
    const fetchNote = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/notes/${problem._id}`);
        if (data && data.content) {
          setNoteContent(data.content);
        }
      } catch (e) {
        // ignore note load error
      }
    };
    fetchNote();
  }, [problem?._id]);

  const handleSaveNote = async () => {
    if (!problem?._id) return;
    try {
      await axiosClient.post('/problem/notes', {
        problemId: problem._id,
        content: noteContent
      });
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    } catch (e) {
      console.error('Failed to save note:', e);
    }
  };

  if (!problem) return null;

  const difficulty = (problem.difficulty || 'easy').toLowerCase();
  const getDiffBadge = () => {
    if (difficulty === 'easy') return <span className="badge-easy px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase">Easy</span>;
    if (difficulty === 'medium') return <span className="badge-medium px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase">Medium</span>;
    return <span className="badge-hard px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase">Hard</span>;
  };

  return (
    <div className="flex flex-col h-full bg-[#0e1017] border border-[#262b3d] rounded-xl overflow-hidden font-sans">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-3 h-10 bg-[#131620] border-b border-[#262b3d] flex-shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'description', label: 'Description', icon: '📄' },
            { id: 'editorial', label: 'Editorial', icon: '💡' },
            { id: 'submissions', label: `Submissions (${submissions.length})`, icon: '⏱' },
            { id: 'notes', label: 'Notes', icon: '📝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  : 'text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Action: Bookmark */}
        <button
          onClick={onToggleBookmark}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            isBookmarked
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
              : 'bg-[#1a1e2b] border-[#262b3d] text-[#5e6480] hover:text-white'
          }`}
          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
        >
          <svg className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin text-xs text-[#9aa0b8] leading-relaxed">
        {activeTab === 'description' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header: Title, Number, Difficulty, Stats */}
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-mono text-xs text-[#5e6480] font-bold">
                  #{problem.problemNumber || '1'}
                </span>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  {problem.title}
                </h1>
                {isSolved && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                    ✓ Solved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap pt-1">
                {getDiffBadge()}

                <span className="px-2 py-0.5 rounded bg-[#1a1e2b] text-[#9aa0b8] border border-[#262b3d] text-[11px] font-mono capitalize">
                  {problem.topic}
                </span>

                {problem.subtopic && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 text-[11px] font-mono">
                    {problem.subtopic}
                  </span>
                )}

                <span className="text-[11px] font-mono text-[#5e6480]">
                  Acceptance: {problem.acceptance?.rate || '52.4'}%
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div className="prose prose-invert max-w-none text-xs text-[#ced3e8] leading-relaxed whitespace-pre-wrap font-sans">
              {problem.description}
            </div>

            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-3">
                <div className="text-[11px] font-mono font-bold text-[#5e6480] uppercase tracking-wider">
                  Examples
                </div>
                {problem.examples.map((ex, idx) => (
                  <div key={idx} className="bg-[#131620] border border-[#262b3d] rounded-xl p-3.5 space-y-2 font-mono text-xs">
                    <div className="text-[10px] text-[#5e6480] font-bold uppercase tracking-wider">
                      Example {idx + 1}:
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#5e6480] w-16 flex-shrink-0">Input:</span>
                      <span className="text-white bg-[#0e1017] px-2 py-0.5 rounded border border-[#1c202e] flex-1 break-all">
                        {ex.input}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#5e6480] w-16 flex-shrink-0">Output:</span>
                      <span className="text-emerald-400 bg-[#0e1017] px-2 py-0.5 rounded border border-[#1c202e] flex-1 break-all">
                        {ex.output}
                      </span>
                    </div>
                    {ex.explanation && (
                      <div className="flex gap-2 text-[#9aa0b8] text-[11px] pt-1">
                        <span className="text-[#5e6480] w-16 flex-shrink-0">Note:</span>
                        <span>{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {problem.constraints && problem.constraints.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold text-[#5e6480] uppercase tracking-wider">
                  Constraints
                </div>
                <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-[#9aa0b8]">
                  {problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints Section */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#262b3d]">
                <div className="text-[11px] font-mono font-bold text-[#5e6480] uppercase tracking-wider">
                  Hints & Insights
                </div>
                {problem.hints.map((hint, i) => (
                  <div key={i} className="bg-[#131620] border border-[#262b3d] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenHintIndex(openHintIndex === i ? null : i)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-[#9aa0b8] hover:text-white text-left cursor-pointer bg-transparent border-none"
                    >
                      <span className="font-semibold">Hint {i + 1}</span>
                      <span className="text-xs text-[#5e6480]">{openHintIndex === i ? '▲' : '▼'}</span>
                    </button>
                    {openHintIndex === i && (
                      <div className="px-3.5 pb-3 text-xs text-[#ced3e8] border-t border-[#1c202e] pt-2 font-sans">
                        {hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Editorial */}
        {activeTab === 'editorial' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#131620] border border-[#262b3d] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Approach & Complexity Analysis</h3>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[10px] border border-indigo-500/20">
                  Official Editorial
                </span>
              </div>
              <p className="text-xs text-[#ced3e8] leading-relaxed">
                {problem.editorial?.approach || "This problem can be solved by recognizing the optimal data structure to minimize redundant searches."}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#0e1017] p-3 rounded-lg border border-[#1c202e]">
                  <div className="text-[10px] font-mono text-[#5e6480] uppercase">Time Complexity</div>
                  <div className="font-mono text-xs font-bold text-emerald-400 mt-1">
                    {problem.editorial?.timeComplexity || "O(n)"}
                  </div>
                </div>
                <div className="bg-[#0e1017] p-3 rounded-lg border border-[#1c202e]">
                  <div className="text-[10px] font-mono text-[#5e6480] uppercase">Space Complexity</div>
                  <div className="font-mono text-xs font-bold text-indigo-400 mt-1">
                    {problem.editorial?.spaceComplexity || "O(n) or O(1)"}
                  </div>
                </div>
              </div>
            </div>

            {/* Reveal Solution toggle */}
            <div className="bg-[#131620] border border-[#262b3d] rounded-xl p-4 text-center space-y-3">
              <div className="text-xs text-[#9aa0b8]">
                {showEditorialSolution ? "Reference Solution" : "Try solving the problem first before viewing the full solution code."}
              </div>
              <button
                onClick={() => setShowEditorialSolution(!showEditorialSolution)}
                className="btn-secondary text-xs py-1.5 px-4"
              >
                {showEditorialSolution ? "Hide Solution" : "Reveal Reference Solution"}
              </button>

              {showEditorialSolution && problem.referenceSolution && (
                <div className="text-left mt-4 animate-fade-in">
                  <div className="bg-[#0e1017] p-3.5 rounded-lg border border-[#262b3d] font-mono text-xs text-[#f1f3f9] overflow-x-auto whitespace-pre">
                    {problem.referenceSolution[0]?.completeCode || "// Reference solution"}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-3 animate-fade-in">
            {submissions.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#5e6480] font-mono">
                No past submissions yet for this problem. Run and submit your solution!
              </div>
            ) : (
              submissions.map((sub) => {
                const isAcc = sub.status === 'accepted';
                return (
                  <div
                    key={sub._id}
                    onClick={() => onSelectSubmission(sub)}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#131620] hover:bg-[#1a1e2b] border border-[#262b3d] cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-xs font-bold ${isAcc ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isAcc ? '✓ Accepted' : '✗ ' + (sub.status.toUpperCase())}
                      </span>
                      <span className="text-[11px] font-mono text-[#5e6480] capitalize">
                        {sub.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-[#5e6480]">
                      <span>{sub.runtime} ms</span>
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      <span className="text-indigo-400 group-hover:underline">View Code</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-3 animate-fade-in flex flex-col h-full">
            <div className="text-xs text-[#9aa0b8]">
              Personal notes and insights for this problem. Notes are saved to your account.
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Jot down algorithmic insights, edge case reminders, or alternative approaches..."
              className="w-full h-64 p-3 bg-[#131620] border border-[#262b3d] focus:border-indigo-500 rounded-xl text-xs text-white font-mono outline-none resize-none placeholder-[#5e6480]"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono text-emerald-400 transition-opacity ${noteSaved ? 'opacity-100' : 'opacity-0'}`}>
                ✓ Note saved
              </span>
              <button
                onClick={handleSaveNote}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Save Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
