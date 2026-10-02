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
    if (difficulty === 'easy') {
      return (
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-label-sm uppercase font-semibold">
          Easy
        </span>
      );
    }
    if (difficulty === 'medium') {
      return (
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 font-label-sm uppercase font-semibold">
          Medium
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/25 font-label-sm uppercase font-semibold">
        Hard
      </span>
    );
  };

  // Resolve examples from problem.examples OR problem.visibleTestCases
  const examplesList =
    problem.examples && problem.examples.length > 0
      ? problem.examples
      : problem.visibleTestCases && problem.visibleTestCases.length > 0
      ? problem.visibleTestCases.map((tc) => ({
          input: tc.input,
          output: tc.output,
          explanation: tc.explanation || ''
        }))
      : [];

  const rawTags = Array.isArray(problem.tags) ? problem.tags : problem.tags ? [problem.tags] : [];
  const primaryTopic = problem.topic || rawTags[0] || 'Algorithms';
  const subtopic = problem.subtopic || (rawTags.length > 1 ? rawTags[1] : null);

  const companiesList = problem.companies || ['Google', 'Meta', 'Amazon', 'Microsoft'];

  return (
    <div className="flex flex-col h-full bg-surface text-on-surface font-body-md overflow-hidden">
      {/* Problem Tabs Strip */}
      <div className="flex items-center justify-between bg-surface-container-low border-b border-outline-variant/40 px-1 overflow-x-auto flex-shrink-0">
        <div className="flex items-center">
          {[
            { id: 'description', label: 'Description', icon: 'description' },
            { id: 'editorial', label: 'Editorial', icon: 'auto_stories' },
            { id: 'submissions', label: `Submissions (${submissions.length})`, icon: 'history' },
            { id: 'notes', label: 'Notes', icon: 'sticky_note_2' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-body-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-surface text-primary shadow-[0_-2px_0_0_#4cd7f6_inset]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action: Bookmark */}
        <button
          onClick={onToggleBookmark}
          className={`flex items-center gap-1 px-2.5 py-1 mr-1 rounded text-label-md font-semibold transition-colors cursor-pointer ${
            isBookmarked
              ? 'bg-primary-container/20 text-primary border border-primary/40'
              : 'bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Save Problem'}
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">{isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
          <span className="font-label-sm">{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Tab Body Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-on-surface leading-relaxed">
        {activeTab === 'description' && (
          <div className="space-y-5 animate-fade-in">
            {/* Header: Title, Number, Difficulty, Tags */}
            <div className="space-y-2.5 pb-1 border-b border-outline-variant/30">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  #{String(problem.problemNumber || 1).padStart(3, '0')}. {problem.title}
                </h1>
                <div className="flex items-center gap-2">
                  {getDiffBadge()}
                  {isSolved && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-label-sm font-semibold">
                      ✓ Solved
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm border border-outline-variant">
                    Rating {problem.rating || '1850'}
                  </span>
                </div>
              </div>

              {/* Tags & Taxonomy Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2.5 py-0.5 bg-surface-container-high rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-1.5 border border-outline-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {primaryTopic}
                </span>

                {subtopic && (
                  <span className="px-2.5 py-0.5 bg-surface-container-high rounded-full font-label-sm text-label-sm text-on-surface flex items-center gap-1.5 border border-outline-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    {subtopic}
                  </span>
                )}

                {rawTags.slice(2).map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-surface-container rounded-full font-label-sm text-label-sm text-on-surface-variant border border-outline-variant"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Companies Tags */}
              {companiesList && companiesList.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="text-outline uppercase tracking-wider font-semibold mr-1">Frequently Asked By:</span>
                  {companiesList.map((comp, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-surface-container rounded text-on-surface border border-outline-variant">
                      {comp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Problem Statement Body */}
            <div className="font-body-md text-body-md text-on-surface space-y-3 whitespace-pre-wrap leading-relaxed">
              {problem.description}
            </div>

            {/* Examples Section */}
            {examplesList.length > 0 && (
              <div className="space-y-3">
                <div className="font-headline-sm text-headline-sm font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">data_object</span>
                  <span>Examples</span>
                </div>

                {examplesList.map((ex, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest p-3.5 rounded border border-outline-variant space-y-2 font-code-md text-code-md text-on-surface"
                  >
                    <div className="flex items-center justify-between text-outline font-label-sm">
                      <span className="font-bold text-primary uppercase">Example {idx + 1}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-outline uppercase font-label-sm block">Input</span>
                      <pre className="p-2 bg-surface-container rounded text-secondary-fixed whitespace-pre-wrap font-code-md text-code-md border border-outline-variant/60 m-0">
                        {ex.input}
                      </pre>
                    </div>

                    <div className="space-y-1">
                      <span className="text-outline uppercase font-label-sm block">Output</span>
                      <pre className="p-2 bg-surface-container rounded text-tertiary whitespace-pre-wrap font-code-md text-code-md border border-outline-variant/60 m-0">
                        {ex.output}
                      </pre>
                    </div>

                    {ex.explanation && (
                      <div className="pt-1 text-body-sm text-on-surface-variant">
                        <span className="text-outline uppercase font-label-sm block mb-1">Explanation</span>
                        <div className="text-on-surface-variant font-code-md text-[12px] pl-1 border-l-2 border-primary/40">
                          {ex.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints Card */}
            <div className="bg-surface-container-low p-4 rounded border border-outline-variant space-y-2">
              <div className="font-headline-sm text-headline-sm font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-400">rule</span>
                <span>Constraints & Invariants</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 font-code-md text-code-md text-on-surface-variant">
                {problem.constraints && problem.constraints.length > 0 ? (
                  problem.constraints.map((c, i) => <li key={i}>{c}</li>)
                ) : (
                  <>
                    <li>1 ≤ Input length / Magnitude ≤ 10⁵</li>
                    <li>Time Limit: <strong className="text-tertiary">1000 ms</strong></li>
                    <li>Memory Limit: <strong className="text-primary">256 MB</strong></li>
                  </>
                )}
              </ul>
            </div>

            {/* Telemetry & Target Performance Envelope Meter */}
            <div className="bg-surface-container-low p-4 rounded border border-outline-variant space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-outline">
                  Target Benchmark Envelope
                </span>
                <span className="font-code-md text-code-md text-tertiary font-bold">
                  {problem.editorial?.timeComplexity || '< 140ms / < 64MB'}
                </span>
              </div>
              <svg className="w-full h-8" fill="none" viewBox="0 0 380 32">
                <rect fill="#1d2025" height="6" rx="3" width="380" x="0" y="8" />
                <rect fill="#06b6d4" fillOpacity="0.3" height="6" rx="3" width="280" x="0" y="8" />
                <rect fill="#4edea3" height="6" rx="3" width="165" x="0" y="8" />
                <circle cx="165" cy="11" fill="#4edea3" r="5" />
                <text fill="#4edea3" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="165" y="27">
                  Target ({problem.editorial?.timeComplexity || 'O(N)'})
                </text>
                <text fill="#869397" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="320" y="27">
                  Naive O(N²)
                </text>
              </svg>
            </div>

            {/* Hints Accordion */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                <div className="font-headline-sm text-headline-sm font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-400">lightbulb</span>
                  <span>Hints & Insights</span>
                </div>

                {problem.hints.map((hint, i) => (
                  <div key={i} className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
                    <button
                      onClick={() => setOpenHintIndex(openHintIndex === i ? null : i)}
                      className="w-full px-3 py-2 flex items-center justify-between bg-transparent border-none text-on-surface font-body-sm font-semibold cursor-pointer hover:bg-surface-container transition-colors"
                      type="button"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="text-primary font-mono text-xs">Hint {i + 1}</span>
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        {openHintIndex === i ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {openHintIndex === i && (
                      <div className="px-3.5 py-2.5 border-t border-outline-variant bg-surface-container-lowest font-body-sm text-on-surface-variant leading-relaxed">
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
          <div className="space-y-4 animate-fade-in">
            <div className="bg-surface-container-low border border-outline-variant rounded p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Approach & Complexity Analysis
                </h3>
                <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary border border-primary/40 font-label-sm">
                  Official Editorial
                </span>
              </div>

              <p className="text-on-surface-variant leading-relaxed">
                {problem.editorial?.approach ||
                  'This problem can be efficiently solved by utilizing optimal algorithmic data structures to eliminate redundant computations and reduce asymptotic bounds.'}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-surface-container p-3 rounded border border-outline-variant">
                  <div className="text-outline font-label-sm uppercase">Time Complexity</div>
                  <div className="font-code-md text-sm font-bold text-tertiary mt-1">
                    {problem.editorial?.timeComplexity || 'O(N)'}
                  </div>
                </div>

                <div className="bg-surface-container p-3 rounded border border-outline-variant">
                  <div className="text-outline font-label-sm uppercase">Space Complexity</div>
                  <div className="font-code-md text-sm font-bold text-primary mt-1">
                    {problem.editorial?.spaceComplexity || 'O(1)'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-3 animate-fade-in">
            <div className="text-body-sm text-outline">
              Your historical execution attempts and submissions for this problem:
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 text-center bg-surface-container-low rounded border border-outline-variant text-outline font-code-md text-body-sm">
                No past submissions found. Write your solution and press Submit!
              </div>
            ) : (
              submissions.map((sub, idx) => {
                const isAcc = String(sub.status).toLowerCase().includes('accepted');
                return (
                  <div
                    key={sub._id || idx}
                    onClick={() => onSelectSubmission(sub)}
                    className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant hover:border-primary/50 rounded cursor-pointer transition-all hover:bg-surface-container"
                  >
                    <div className="space-y-0.5">
                      <div className={`font-mono text-xs font-bold ${isAcc ? 'text-tertiary' : 'text-error'}`}>
                        {sub.status || (isAcc ? 'Accepted' : 'Wrong Answer')}
                      </div>
                      <div className="text-outline font-label-sm">
                        {sub.language?.toUpperCase()} • {sub.runtime ? `${sub.runtime}ms` : '—'} •{' '}
                        {new Date(sub.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    <span className="text-primary font-label-sm font-semibold flex items-center gap-1">
                      <span>View Code</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-3 h-full flex flex-col animate-fade-in">
            <div className="text-body-sm text-outline">
              Personal reflections, invariants, and edge cases saved to your account:
            </div>

            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record your thoughts, step-by-step logic, or edge cases here..."
              className="w-full flex-1 min-h-[220px] bg-surface-container-lowest border border-outline-variant focus:border-primary rounded p-3 text-on-surface font-body-md outline-none resize-none transition-colors"
            />

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleSaveNote}
                className="btn-primary"
                type="button"
              >
                Save Notes
              </button>
              {noteSaved && (
                <span className="text-tertiary font-label-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>Notes Saved to Cloud</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
