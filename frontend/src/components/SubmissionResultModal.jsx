import React, { useState } from 'react';

export default function SubmissionResultModal({
  submission,
  isOpen,
  onClose = () => {},
  onAskAIDebug = () => {}
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !submission) return null;

  const isAcc = submission.status === 'accepted';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(submission.code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#131620] border border-[#262b3d] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isAcc ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base ${
              isAcc ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
            }`}>
              {isAcc ? '✓' : '✗'}
            </div>
            <div>
              <h2 className={`font-bold text-base ${isAcc ? 'text-emerald-400' : 'text-red-400'}`}>
                {isAcc ? 'Accepted' : (submission.statusDescription || submission.status?.toUpperCase() || 'Submission Failed')}
              </h2>
              <div className="text-[11px] font-mono text-[#9aa0b8] mt-0.5">
                Submitted {new Date(submission.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5e6480] hover:text-white rounded-lg hover:bg-[#1a1e2b] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Telemetry Stats */}
        <div className="p-4 grid grid-cols-3 gap-3 border-b border-[#262b3d] bg-[#0e1017]">
          <div className="p-3 bg-[#131620] rounded-xl border border-[#1c202e]">
            <div className="text-[10px] font-mono text-[#5e6480] uppercase">Runtime</div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {submission.runtime || 0} ms
            </div>
          </div>

          <div className="p-3 bg-[#131620] rounded-xl border border-[#1c202e]">
            <div className="text-[10px] font-mono text-[#5e6480] uppercase">Memory</div>
            <div className="font-mono text-sm font-bold text-white mt-1">
              {submission.memory || 0} kB
            </div>
          </div>

          <div className="p-3 bg-[#131620] rounded-xl border border-[#1c202e]">
            <div className="text-[10px] font-mono text-[#5e6480] uppercase">Testcases</div>
            <div className="font-mono text-sm font-bold text-emerald-400 mt-1">
              {submission.testCasesPassed ?? (isAcc ? submission.testCasesTotal || 1 : 0)} / {submission.testCasesTotal || 1} Passed
            </div>
          </div>
        </div>

        {/* Error / Diagnostics if failed */}
        {!isAcc && submission.errorMessage && (
          <div className="p-4 bg-red-500/5 border-b border-red-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 font-mono">Error Details</span>
              <button
                onClick={() => {
                  onClose();
                  onAskAIDebug(submission.errorMessage);
                }}
                className="btn-ai text-xs py-1 px-3"
              >
                <span>🐛</span>
                <span>Ask AI to Debug</span>
              </button>
            </div>
            <pre className="p-3 bg-[#0e1017] rounded-lg border border-[#262b3d] font-mono text-xs text-red-300 overflow-x-auto whitespace-pre-wrap max-h-36">
              {submission.errorMessage}
            </pre>
          </div>
        )}

        {/* Submitted Code View */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Submitted Code ({submission.language || 'cpp'})
            </span>
            <button
              onClick={handleCopyCode}
              className="text-xs text-[#9aa0b8] hover:text-white font-mono bg-[#1a1e2b] px-2.5 py-1 rounded border border-[#262b3d] cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-4 bg-[#0e1017] border border-[#262b3d] rounded-xl font-mono text-xs text-[#f1f3f9] overflow-x-auto whitespace-pre leading-relaxed">
            {submission.code || '// No code recorded'}
          </pre>
        </div>
      </div>
    </div>
  );
}
