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
    <div className="flex flex-col h-full bg-[#0e1017] border border-[#262b3d] rounded-xl overflow-hidden font-sans">
      {/* Console Tab Header */}
      <div className="flex items-center justify-between px-3 h-10 bg-[#131620] border-b border-[#262b3d] flex-shrink-0 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('testcase')}
            className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'testcase'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b]'
            }`}
          >
            <span>⌨️</span>
            <span>Testcase</span>
          </button>

          <button
            onClick={() => setActiveTab('result')}
            className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'result'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                : 'text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b]'
            }`}
          >
            <span>📊</span>
            <span>Test Result</span>
            {runResult && (
              <span className={`w-2 h-2 rounded-full ${runResult.allPassed ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
            )}
          </button>
        </div>

        {/* Execution Status Spinner */}
        {isExecuting && (
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin-custom"></div>
            <span>Running in Sandbox...</span>
          </div>
        )}
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-4 text-xs font-sans">
        {activeTab === 'testcase' && (
          <div className="space-y-4 animate-fade-in">
            {/* Case selector tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {allTestCases.map((tc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCaseIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCaseIndex === idx
                      ? 'bg-[#1a1e2b] text-white border border-[#373e57]'
                      : 'bg-[#131620] text-[#5e6480] hover:text-[#9aa0b8] border border-transparent'
                  }`}
                >
                  <span>{tc.name}</span>
                  {tc.isCustom && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomTestCase(idx - visibleTestCases.length);
                      }}
                      className="hover:text-red-400 text-[10px]"
                      title="Delete Testcase"
                    >
                      ✕
                    </span>
                  )}
                </button>
              ))}

              <button
                onClick={handleAddCustomTestCase}
                className="px-2.5 py-1.5 rounded-lg bg-[#131620] hover:bg-[#1a1e2b] text-[#9aa0b8] hover:text-white border border-dashed border-[#262b3d] text-xs font-mono cursor-pointer flex items-center gap-1"
                title="Add Custom Testcase"
              >
                <span>+</span>
                <span>Add</span>
              </button>
            </div>

            {/* Testcase Input Editor */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[#5e6480] uppercase tracking-wider">
                {selectedCase.isCustom ? "Custom Testcase Input (stdin)" : "Testcase Input"}
              </div>
              {selectedCase.isCustom ? (
                <textarea
                  value={customTestCases[customIndex]?.input || ''}
                  onChange={(e) => handleCustomInputChange(customIndex, e.target.value)}
                  placeholder="Enter custom input..."
                  className="w-full h-24 p-3 bg-[#131620] border border-[#262b3d] focus:border-indigo-500 rounded-xl text-xs font-mono text-white outline-none resize-none"
                />
              ) : (
                <div className="p-3 bg-[#131620] border border-[#262b3d] rounded-xl font-mono text-xs text-white whitespace-pre-wrap">
                  {selectedCase.input || "(Empty input)"}
                </div>
              )}
            </div>

            {selectedCase.output && (
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-[#5e6480] uppercase tracking-wider">
                  Expected Output
                </div>
                <div className="p-3 bg-[#131620] border border-[#262b3d] rounded-xl font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {selectedCase.output}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Test Result */}
        {activeTab === 'result' && (
          <div className="space-y-4 animate-fade-in">
            {!runResult ? (
              <div className="py-12 text-center text-xs text-[#5e6480] font-mono">
                Click <kbd className="px-1.5 py-0.5 rounded bg-[#1a1e2b] text-[#9aa0b8] border border-[#262b3d]">Run Code</kbd> to view execution results.
              </div>
            ) : (
              <>
                {/* Result Verdict Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    runResult.allPassed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-base font-bold ${runResult.allPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {runResult.allPassed ? '✓ Accepted' : '✗ Execution Failed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#9aa0b8]">
                    <span>Runtime: <strong className="text-white">{runResult.runtime} ms</strong></span>
                    <span>Memory: <strong className="text-white">{runResult.memory} kB</strong></span>
                  </div>
                </div>

                {/* Error diagnostics & AI Debug Button */}
                {runResult.error && (
                  <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-red-400 font-mono">
                        ⚠️ Compiler / Runtime Diagnostics
                      </div>
                      <button
                        onClick={() => onAskAIDebug(runResult.error)}
                        className="btn-ai text-xs py-1 px-3 shadow-lg"
                      >
                        <span>🐛</span>
                        <span>Ask AI to Debug</span>
                      </button>
                    </div>
                    <pre className="p-3 bg-[#0e1017] rounded-lg border border-[#262b3d] font-mono text-[11px] text-red-300 overflow-x-auto whitespace-pre-wrap max-h-40">
                      {runResult.error}
                    </pre>
                  </div>
                )}

                {/* Testcases Evaluation breakdown */}
                {runResult.testCases && runResult.testCases.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {runResult.testCases.map((tc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedCaseIndex(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedCaseIndex === idx
                              ? 'bg-[#1a1e2b] text-white border border-[#373e57]'
                              : 'bg-[#131620] text-[#5e6480] border border-transparent'
                          }`}
                        >
                          <span className={tc.passed ? 'text-emerald-400' : 'text-red-400'}>
                            {tc.passed ? '✓' : '✗'}
                          </span>
                          <span>Case {idx + 1}</span>
                        </button>
                      ))}
                    </div>

                    {runResult.testCases[selectedCaseIndex] && (
                      <div className="bg-[#131620] border border-[#262b3d] rounded-xl p-4 space-y-3 font-mono text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <div className="text-[10px] text-[#5e6480] uppercase mb-1">Input</div>
                            <div className="p-2.5 bg-[#0e1017] rounded-lg border border-[#1c202e] text-white whitespace-pre-wrap">
                              {runResult.testCases[selectedCaseIndex].stdin || 'N/A'}
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] text-[#5e6480] uppercase mb-1">Your Output</div>
                            <div className={`p-2.5 bg-[#0e1017] rounded-lg border border-[#1c202e] whitespace-pre-wrap ${
                              runResult.testCases[selectedCaseIndex].passed ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {runResult.testCases[selectedCaseIndex].stdout || '(No stdout output)'}
                            </div>
                          </div>
                        </div>

                        {runResult.testCases[selectedCaseIndex].expected_output && (
                          <div>
                            <div className="text-[10px] text-[#5e6480] uppercase mb-1">Expected Output</div>
                            <div className="p-2.5 bg-[#0e1017] rounded-lg border border-[#1c202e] text-emerald-400 whitespace-pre-wrap">
                              {runResult.testCases[selectedCaseIndex].expected_output}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
