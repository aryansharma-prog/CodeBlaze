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
        <span style={{
          padding: '3px 8px',
          borderRadius: '5px',
          background: 'rgba(34, 197, 94, 0.12)',
          color: '#22c55e',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          fontSize: '11px',
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          Easy
        </span>
      );
    }
    if (difficulty === 'medium') {
      return (
        <span style={{
          padding: '3px 8px',
          borderRadius: '5px',
          background: 'rgba(245, 158, 11, 0.12)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          fontSize: '11px',
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          Medium
        </span>
      );
    }
    return (
      <span style={{
        padding: '3px 8px',
        borderRadius: '5px',
        background: 'rgba(239, 68, 68, 0.12)',
        color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        fontSize: '11px',
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace"
      }}>
        Hard
      </span>
    );
  };

  // Resolve examples from problem.examples OR problem.visibleTestCases
  const examplesList = (problem.examples && problem.examples.length > 0)
    ? problem.examples
    : (problem.visibleTestCases && problem.visibleTestCases.length > 0)
      ? problem.visibleTestCases.map(tc => ({
          input: tc.input,
          output: tc.output,
          explanation: tc.explanation || ''
        }))
      : [];

  const topicName = problem.topic || (Array.isArray(problem.tags) ? problem.tags[0] : problem.tags) || 'General';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#11131a',
      border: '1px solid #1e2230',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: "'Syne', -apple-system, sans-serif"
    }}>
      {/* Tab Navigation Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        height: '42px',
        background: '#0d0e14',
        borderBottom: '1px solid #1e2230',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {[
            { id: 'description', label: 'Description', icon: '📄' },
            { id: 'editorial', label: 'Editorial', icon: '💡' },
            { id: 'submissions', label: `Submissions (${submissions.length})`, icon: '⏱' },
            { id: 'notes', label: 'Notes', icon: '📝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
                border: activeTab === tab.id ? '1px solid rgba(108, 142, 247, 0.3)' : '1px solid transparent',
                background: activeTab === tab.id ? 'rgba(108, 142, 247, 0.12)' : 'transparent',
                color: activeTab === tab.id ? '#6c8ef7' : '#888d9f'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Action: Bookmark */}
        <button
          onClick={onToggleBookmark}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            background: isBookmarked ? 'rgba(108, 142, 247, 0.15)' : '#1a1d2b',
            border: isBookmarked ? '1px solid rgba(108, 142, 247, 0.3)' : '1px solid #2a2e42',
            color: isBookmarked ? '#6c8ef7' : '#888d9f',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
        >
          <span>{isBookmarked ? '★' : '☆'}</span>
          <span style={{ fontSize: '11px' }}>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Tab Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', fontSize: '13px', color: '#a0a5ba', lineHeight: 1.6 }}>
        {activeTab === 'description' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header: Title, Number, Difficulty, Tags */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#555870', fontWeight: 700 }}>
                  #{String(problem.problemNumber || 1).padStart(3, '0')}
                </span>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#e8eaf0', letterSpacing: '-0.3px', margin: 0 }}>
                  {problem.title}
                </h1>
                {isSolved && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.12)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    ✓ Solved
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {getDiffBadge()}

                <span style={{
                  padding: '2px 8px',
                  borderRadius: '5px',
                  background: '#1a1d2b',
                  border: '1px solid #262b3d',
                  color: '#888d9f',
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'capitalize'
                }}>
                  {topicName}
                </span>

                {problem.subtopic && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '5px',
                    background: 'rgba(108, 142, 247, 0.08)',
                    border: '1px solid rgba(108, 142, 247, 0.2)',
                    color: '#6c8ef7',
                    fontSize: '11px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {problem.subtopic}
                  </span>
                )}

                <span style={{ fontSize: '11px', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                  Acceptance: {problem.acceptance?.rate ? `${problem.acceptance.rate}%` : '52.4%'}
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div style={{ color: '#d0d4e4', fontSize: '13.5px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {problem.description}
            </div>

            {/* Examples Section */}
            {examplesList.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  Examples
                </div>

                {examplesList.map((ex, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#0d0e14',
                      border: '1px solid #1e2230',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#6c8ef7', textTransform: 'uppercase' }}>
                      Example {idx + 1}:
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: '#555870', width: '56px', flexShrink: 0 }}>Input:</span>
                      <span style={{ color: '#e8eaf0', background: '#131620', padding: '2px 8px', borderRadius: '4px', border: '1px solid #202434', flex: 1, wordBreak: 'break-word' }}>
                        {ex.input}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ color: '#555870', width: '56px', flexShrink: 0 }}>Output:</span>
                      <span style={{ color: '#22c55e', background: '#131620', padding: '2px 8px', borderRadius: '4px', border: '1px solid #202434', flex: 1, wordBreak: 'break-word' }}>
                        {ex.output}
                      </span>
                    </div>

                    {ex.explanation && (
                      <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: '#888d9f', paddingTop: '2px' }}>
                        <span style={{ color: '#555870', width: '56px', flexShrink: 0 }}>Explain:</span>
                        <span>{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                Constraints & Limits
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#888d9f', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {problem.constraints && problem.constraints.length > 0 ? (
                  problem.constraints.map((c, i) => <li key={i}>{c}</li>)
                ) : (
                  <>
                    <li>1 ≤ Array length / Input magnitude ≤ 10⁵</li>
                    <li>Time Limit: 1000 ms</li>
                    <li>Memory Limit: 256 MB</li>
                  </>
                )}
              </ul>
            </div>

            {/* Hints Accordion */}
            {problem.hints && problem.hints.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #1e2230', paddingTop: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#555870', letterSpacing: '0.6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  💡 Hints & Insights
                </div>
                {problem.hints.map((hint, i) => (
                  <div key={i} style={{ background: '#0d0e14', border: '1px solid #1e2230', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenHintIndex(openHintIndex === i ? null : i)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        color: '#a0a5ba',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <span>Hint {i + 1}</span>
                      <span style={{ fontSize: '11px', color: '#555870' }}>{openHintIndex === i ? '▲' : '▼'}</span>
                    </button>
                    {openHintIndex === i && (
                      <div style={{ padding: '10px 14px', borderTop: '1px solid #181b26', fontSize: '12px', color: '#ced3e8', lineHeight: 1.5 }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#0d0e14', border: '1px solid #1e2230', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e8eaf0', margin: 0 }}>Approach & Complexity Analysis</h3>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(108, 142, 247, 0.12)', color: '#6c8ef7', border: '1px solid rgba(108, 142, 247, 0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
                  Official Approach
                </span>
              </div>

              <p style={{ fontSize: '13px', color: '#d0d4e4', lineHeight: 1.6, margin: 0 }}>
                {problem.editorial?.approach || "This problem can be efficiently solved by utilizing optimal algorithmic structures to reduce redundant operations."}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                <div style={{ background: '#131620', padding: '12px', borderRadius: '8px', border: '1px solid #202434' }}>
                  <div style={{ fontSize: '10px', color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Time Complexity</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#22c55e', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>
                    {problem.editorial?.timeComplexity || "O(n)"}
                  </div>
                </div>

                <div style={{ background: '#131620', padding: '12px', borderRadius: '8px', border: '1px solid #202434' }}>
                  <div style={{ fontSize: '10px', color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Space Complexity</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#6c8ef7', marginTop: '2px', fontFamily: "'JetBrains Mono', monospace" }}>
                    {problem.editorial?.spaceComplexity || "O(1)"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Submissions */}
        {activeTab === 'submissions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', color: '#7a8099', marginBottom: '4px' }}>
              Your past execution attempts and submissions for this problem:
            </div>

            {submissions.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', background: '#0d0e14', borderRadius: '10px', border: '1px solid #1e2230', color: '#7a8099' }}>
                No submissions recorded yet. Write your code and press Submit!
              </div>
            ) : (
              submissions.map((sub, idx) => (
                <div
                  key={sub._id || idx}
                  onClick={() => onSelectSubmission(sub)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#0d0e14',
                    border: '1px solid #1e2230',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2e334a')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1e2230')}
                >
                  <div>
                    <span style={{
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      color: sub.status?.toLowerCase().includes('accepted') ? '#22c55e' : '#ef4444'
                    }}>
                      {sub.status || 'Submitted'}
                    </span>
                    <div style={{ fontSize: '11px', color: '#555870', marginTop: '2px' }}>
                      {sub.language?.toUpperCase()} • {sub.runtime ? `${sub.runtime}ms` : '—'}
                    </div>
                  </div>

                  <span style={{ color: '#6c8ef7', fontSize: '12px', fontWeight: 600 }}>View Code →</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Notes */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
            <div style={{ fontSize: '12px', color: '#7a8099' }}>
              Personal notes and takeaways (saved to your account):
            </div>

            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Record your thoughts, edge cases, or intuition here..."
              style={{
                width: '100%',
                flex: 1,
                minHeight: '200px',
                background: '#0d0e14',
                border: '1px solid #1e2230',
                borderRadius: '8px',
                padding: '12px',
                color: '#e8eaf0',
                fontSize: '13px',
                fontFamily: "'Syne', sans-serif",
                outline: 'none',
                resize: 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={handleSaveNote}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: '#6c8ef7',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Save Notes
              </button>
              {noteSaved && <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>✓ Notes Saved</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
