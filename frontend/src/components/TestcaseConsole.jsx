import React, { useState } from 'react';

export default function TestcaseConsole({
  visibleTestCases = [],
  customTestCases = [],
  onUpdateCustomTestCases = () => {},
  runResult = null,
  isExecuting = false,
  onAskAIDebug = () => {}
}) {
  const [activeTab, setActiveTab] = useState('testcase'); // 'testcase' | 'result'
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  // Combine visible testcases + custom testcases
  const allTestCases = [
    ...visibleTestCases.map((tc, idx) => ({ ...tc, isCustom: false, name: `Case ${idx + 1}` })),
    ...customTestCases.map((tc, idx) => ({ ...tc, isCustom: true, name: `Custom ${idx + 1}` }))
  ];

  const handleAddCustomTestCase = () => {
    const newCase = { input: "", output: "" };
    onUpdateCustomTestCases([...customTestCases, newCase]);
    setSelectedCaseIndex(allTestCases.length);
  };

  const handleDeleteCustomTestCase = (indexInCustom) => {
    const updated = [...customTestCases];
    updated.splice(indexInCustom, 1);
    onUpdateCustomTestCases(updated);
    setSelectedCaseIndex(0);
  };

  const handleCustomInputChange = (indexInCustom, value) => {
    const updated = [...customTestCases];
    updated[indexInCustom] = { ...updated[indexInCustom], input: value };
    onUpdateCustomTestCases(updated);
  };

  const selectedCase = allTestCases[selectedCaseIndex] || allTestCases[0] || { input: "", output: "" };
  const customIndex = selectedCaseIndex >= visibleTestCases.length ? selectedCaseIndex - visibleTestCases.length : -1;

  // Auto-switch to result tab when execution finishes
  React.useEffect(() => {
    if (runResult) {
      setActiveTab('result');
    }
  }, [runResult]);

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
      {/* Console Tab Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('testcase')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: activeTab === 'testcase' ? '1px solid rgba(108, 142, 247, 0.3)' : '1px solid transparent',
              background: activeTab === 'testcase' ? 'rgba(108, 142, 247, 0.12)' : 'transparent',
              color: activeTab === 'testcase' ? '#6c8ef7' : '#888d9f'
            }}
          >
            <span>⌨️</span>
            <span>Testcase</span>
          </button>

          <button
            onClick={() => setActiveTab('result')}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: activeTab === 'result' ? '1px solid rgba(108, 142, 247, 0.3)' : '1px solid transparent',
              background: activeTab === 'result' ? 'rgba(108, 142, 247, 0.12)' : 'transparent',
              color: activeTab === 'result' ? '#6c8ef7' : '#888d9f'
            }}
          >
            <span>📊</span>
            <span>Test Result</span>
            {runResult && (
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: runResult.allPassed || runResult.status === 'Accepted' ? '#22c55e' : '#ef4444'
              }} />
            )}
          </button>
        </div>

        {/* Execution Status Spinner */}
        {isExecuting && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c8ef7', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace" }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid rgba(108, 142, 247, 0.2)',
              borderTopColor: '#6c8ef7',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span>Executing Code...</span>
          </div>
        )}
      </div>

      {/* Console Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', fontSize: '12px' }}>
        {activeTab === 'testcase' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Case selector tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
              {allTestCases.map((tc, idx) => {
                const isSelected = selectedCaseIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedCaseIndex(idx)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #6c8ef7' : '1px solid #232736',
                      background: isSelected ? 'rgba(108, 142, 247, 0.15)' : '#0d0e14',
                      color: isSelected ? '#6c8ef7' : '#888d9f'
                    }}
                  >
                    {tc.name}
                  </button>
                );
              })}

              <button
                onClick={handleAddCustomTestCase}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px dashed #2e334a',
                  background: 'none',
                  color: '#6c8ef7'
                }}
              >
                + Custom Case
              </button>
            </div>

            {/* Selected Testcase Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                  Input Data:
                </span>
                {selectedCase.isCustom && (
                  <button
                    onClick={() => handleDeleteCustomTestCase(customIndex)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Delete Case
                  </button>
                )}
              </div>

              {selectedCase.isCustom ? (
                <textarea
                  value={selectedCase.input}
                  onChange={(e) => handleCustomInputChange(customIndex, e.target.value)}
                  placeholder="Enter custom input values (e.g. 2 3 or [2,7,11,15])..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    background: '#0d0e14',
                    border: '1px solid #232736',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#e8eaf0',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
              ) : (
                <pre style={{
                  margin: 0,
                  background: '#0d0e14',
                  border: '1px solid #1e2230',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#e8eaf0',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedCase.input || '// No input specified'}
                </pre>
              )}

              {selectedCase.output && (
                <div>
                  <span style={{ fontSize: '11px', color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Expected Output:
                  </span>
                  <pre style={{
                    margin: 0,
                    background: '#0d0e14',
                    border: '1px solid #1e2230',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#22c55e',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {selectedCase.output}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'result' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!runResult ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#555870', fontFamily: "'JetBrains Mono', monospace" }}>
                Click "Run" or press ⌘ + Enter to execute your code against the testcases.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Result Header Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: runResult.allPassed || runResult.status === 'Accepted' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: runResult.allPassed || runResult.status === 'Accepted' ? '1px solid rgba(34, 197, 94, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '13px',
                      color: runResult.allPassed || runResult.status === 'Accepted' ? '#22c55e' : '#ef4444'
                    }}>
                      {runResult.status || (runResult.allPassed ? 'Accepted' : 'Wrong Answer')}
                    </span>
                    {runResult.runtime !== undefined && (
                      <span style={{ fontSize: '11px', color: '#888d9f', fontFamily: "'JetBrains Mono', monospace" }}>
                        • Runtime: {runResult.runtime} ms
                      </span>
                    )}
                  </div>

                  {(!runResult.allPassed && runResult.status !== 'Accepted') && (
                    <button
                      onClick={() => onAskAIDebug(runResult.error || runResult.stderr || 'Wrong answer')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: 'rgba(108, 142, 247, 0.15)',
                        border: '1px solid rgba(108, 142, 247, 0.3)',
                        color: '#6c8ef7',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>✨</span>
                      <span>Ask AI to Debug</span>
                    </button>
                  )}
                </div>

                {/* Stdout Output */}
                {(runResult.stdout || runResult.output) && (
                  <div>
                    <span style={{ fontSize: '11px', color: '#555870', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Standard Output:
                    </span>
                    <pre style={{
                      margin: 0,
                      background: '#0d0e14',
                      border: '1px solid #1e2230',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#e8eaf0',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {runResult.stdout || runResult.output}
                    </pre>
                  </div>
                )}

                {/* Error Trace if any */}
                {(runResult.error || runResult.stderr || runResult.compile_output) && (
                  <div>
                    <span style={{ fontSize: '11px', color: '#ef4444', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      Compiler / Error Output:
                    </span>
                    <pre style={{
                      margin: 0,
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#f87171',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {runResult.error || runResult.stderr || runResult.compile_output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
