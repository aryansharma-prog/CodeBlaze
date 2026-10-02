import React, { useState, useEffect } from 'react';

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
    const newCase = { input: '', output: '' };
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

  const selectedCase = allTestCases[selectedCaseIndex] || allTestCases[0] || { input: '', output: '' };
  const customIndex = selectedCaseIndex >= visibleTestCases.length ? selectedCaseIndex - visibleTestCases.length : -1;

  // Auto-switch to result tab when execution finishes
  useEffect(() => {
    if (runResult) {
      setActiveTab('result');
    }
  }, [runResult]);

  const isPassed = runResult && (runResult.allPassed || String(runResult.status).toLowerCase().includes('accepted'));

  return (
    <div className="flex flex-col h-full bg-surface-container-low overflow-hidden font-body-md">
      {/* Testbench Header Strip */}
      <div className="flex items-center justify-between px-2 bg-surface-container border-b border-outline-variant/40 flex-shrink-0">
        <div className="flex items-center">
          <button
            onClick={() => setActiveTab('testcase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'testcase'
                ? 'bg-surface-container-lowest text-on-surface shadow-[0_-2px_0_0_#4cd7f6_inset]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">terminal</span>
            <span>Testcase</span>
          </button>

          <button
            onClick={() => setActiveTab('result')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-body-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'result'
                ? 'bg-surface-container-lowest text-on-surface shadow-[0_-2px_0_0_#4cd7f6_inset]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[15px] ${
                !runResult ? 'text-outline' : isPassed ? 'text-tertiary' : 'text-error'
              }`}
            >
              {isPassed ? 'check_circle' : 'analytics'}
            </span>
            <span>Test Result</span>
            {runResult && (
              <span className={`font-code-md text-label-sm font-bold ml-1 ${isPassed ? 'text-tertiary' : 'text-error'}`}>
                {isPassed ? '(Accepted)' : `(${runResult.status || 'Failed'})`}
              </span>
            )}
          </button>
        </div>

        {/* Execution Status Spinner */}
        {isExecuting && (
          <div className="flex items-center gap-2 text-primary font-code-md text-code-sm pr-2 animate-pulse">
            <div className="w-3 h-3 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <span>Running Code...</span>
          </div>
        )}
      </div>

      {/* Testbench Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest text-on-surface">
        {activeTab === 'testcase' && (
          <div className="space-y-3.5 animate-fade-in">
            {/* Case Selectors */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {allTestCases.map((tc, idx) => {
                const isSelected = selectedCaseIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedCaseIndex(idx)}
                    className={`px-3 py-1 font-code-md text-code-md font-semibold rounded flex items-center gap-1.5 cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-surface-container-high text-primary border-primary/50'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant border-outline-variant'
                    }`}
                    type="button"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary' : 'bg-outline'}`} />
                    <span>{tc.name}</span>
                  </button>
                );
              })}

              <button
                onClick={handleAddCustomTestCase}
                className="px-2.5 py-1 hover:bg-surface-container text-primary hover:text-primary-fixed font-code-md text-code-md rounded border border-dashed border-primary/40 flex items-center gap-1 cursor-pointer transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
                <span>Custom Case</span>
              </button>
            </div>

            {/* Selected Testcase Editor */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-outline uppercase tracking-wider font-bold">
                  {selectedCase.isCustom ? `Custom Case ${customIndex + 1} Input` : 'Input Data'}
                </span>
                {selectedCase.isCustom && (
                  <button
                    onClick={() => handleDeleteCustomTestCase(customIndex)}
                    className="text-error hover:underline font-label-sm font-semibold cursor-pointer border-none bg-transparent"
                    type="button"
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
                  className="w-full min-h-[90px] bg-surface-container border border-outline-variant focus:border-primary rounded p-2.5 text-on-surface font-code-md text-code-md outline-none transition-colors"
                />
              ) : (
                <pre className="m-0 bg-surface-container border border-outline-variant rounded p-2.5 text-secondary-fixed font-code-md text-code-md whitespace-pre-wrap">
                  {selectedCase.input || '// No input parameters specified'}
                </pre>
              )}

              {selectedCase.output && (
                <div className="space-y-1">
                  <span className="font-label-sm text-outline uppercase tracking-wider font-bold block">
                    Expected Output:
                  </span>
                  <pre className="m-0 bg-surface-container border border-outline-variant rounded p-2.5 text-tertiary font-code-md text-code-md whitespace-pre-wrap">
                    {selectedCase.output}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'result' && (
          <div className="space-y-3.5 animate-fade-in">
            {!runResult ? (
              <div className="p-8 text-center text-outline font-code-md text-body-sm">
                Click "Run" or press <kbd className="px-1 py-0.5 bg-surface-container rounded text-on-surface">⌘⏎</kbd> to
                execute your code against the testcases.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Result Header Banner */}
                <div
                  className={`flex items-center justify-between p-3 rounded border ${
                    isPassed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isPassed ? 'text-tertiary' : 'text-error'
                      }`}
                    >
                      {isPassed ? 'check_circle' : 'error'}
                    </span>
                    <span
                      className={`font-headline-sm font-bold font-code-md ${
                        isPassed ? 'text-tertiary' : 'text-error'
                      }`}
                    >
                      {runResult.status || (isPassed ? 'Accepted' : 'Wrong Answer')}
                    </span>
                    {runResult.runtime !== undefined && (
                      <span className="font-code-md text-label-sm text-outline">
                        • Runtime: <span className="text-on-surface">{runResult.runtime} ms</span>
                      </span>
                    )}
                  </div>

                  {!isPassed && (
                    <button
                      onClick={() => onAskAIDebug(runResult.error || runResult.stderr || 'Execution failed')}
                      className="btn-ai text-xs py-1 px-2.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">psychology</span>
                      <span>Ask AI to Debug</span>
                    </button>
                  )}
                </div>

                {/* Stdout Output */}
                {(runResult.stdout || runResult.output) && (
                  <div className="space-y-1">
                    <span className="font-label-sm text-outline uppercase tracking-wider font-bold block">
                      Standard Output:
                    </span>
                    <pre className="m-0 bg-surface-container border border-outline-variant rounded p-3 text-on-surface font-code-md text-code-md whitespace-pre-wrap">
                      {runResult.stdout || runResult.output}
                    </pre>
                  </div>
                )}

                {/* Error Trace if any */}
                {(runResult.error || runResult.stderr || runResult.compile_output) && (
                  <div className="space-y-1">
                    <span className="font-label-sm text-error uppercase tracking-wider font-bold block">
                      Compiler / Error Output:
                    </span>
                    <pre className="m-0 bg-error/10 border border-error/25 rounded p-3 text-red-300 font-code-md text-code-md whitespace-pre-wrap">
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
