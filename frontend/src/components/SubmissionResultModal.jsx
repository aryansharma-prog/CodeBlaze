import React, { useState } from 'react';

export default function SubmissionResultModal({
  submission,
  isOpen,
  onClose = () => {},
  onAskAIDebug = () => {}
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !submission) return null;

  const isAcc =
    submission.accepted ||
    String(submission.status).toLowerCase().includes('accepted') ||
    submission.status === 'accepted';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-body-md">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-surface-container-low border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isAcc
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg ${
                isAcc ? 'bg-tertiary-container text-on-tertiary' : 'bg-error-container text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isAcc ? 'check' : 'close'}
              </span>
            </div>
            <div>
              <h2 className={`font-headline-md font-bold text-base ${isAcc ? 'text-tertiary' : 'text-error'}`}>
                {isAcc
                  ? 'Accepted'
                  : submission.statusDescription || submission.status?.toUpperCase() || 'Submission Failed'}
              </h2>
              <div className="font-code-md text-label-sm text-outline mt-0.5">
                Submitted {new Date(submission.createdAt || Date.now()).toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-outline hover:text-on-surface rounded hover:bg-surface-container cursor-pointer border-none bg-transparent"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Telemetry Stats */}
        <div className="p-4 grid grid-cols-3 gap-3 border-b border-outline-variant/40 bg-surface-container-lowest">
          <div className="p-3 bg-surface-container rounded border border-outline-variant">
            <div className="font-label-sm text-outline uppercase">Runtime</div>
            <div className="font-code-md text-base font-bold text-on-surface mt-1">
              {submission.runtime || 0} ms
            </div>
          </div>

          <div className="p-3 bg-surface-container rounded border border-outline-variant">
            <div className="font-label-sm text-outline uppercase">Memory</div>
            <div className="font-code-md text-base font-bold text-on-surface mt-1">
              {submission.memory || 0} kB
            </div>
          </div>

          <div className="p-3 bg-surface-container rounded border border-outline-variant">
            <div className="font-label-sm text-outline uppercase">Testcases</div>
            <div className={`font-code-md text-base font-bold mt-1 ${isAcc ? 'text-tertiary' : 'text-error'}`}>
              {submission.testCasesPassed ?? (isAcc ? submission.testCasesTotal || 1 : 0)} /{' '}
              {submission.testCasesTotal || 1} Passed
            </div>
          </div>
        </div>

        {/* Error / Diagnostics if failed */}
        {!isAcc && submission.errorMessage && (
          <div className="p-4 bg-error/10 border-b border-error/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm font-bold text-error uppercase">Error Diagnostics</span>
              <button
                onClick={() => {
                  onClose();
                  onAskAIDebug(submission.errorMessage);
                }}
                className="btn-ai text-xs py-1 px-3"
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                <span>Ask AI to Debug</span>
              </button>
            </div>
            <pre className="p-3 bg-surface-container-lowest rounded border border-error/25 font-code-md text-xs text-red-300 overflow-x-auto whitespace-pre-wrap max-h-36 m-0">
              {submission.errorMessage}
            </pre>
          </div>
        )}

        {/* Submitted Code View */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2 bg-surface-container-low">
          <div className="flex items-center justify-between">
            <span className="font-label-sm font-bold text-on-surface uppercase tracking-wider">
              Submitted Solution Buffer ({submission.language || 'cpp'})
            </span>
            <button
              onClick={handleCopyCode}
              className="text-xs text-outline hover:text-on-surface font-mono bg-surface-container px-2.5 py-1 rounded border border-outline-variant cursor-pointer"
              type="button"
            >
              {copied ? '✓ Copied' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-3.5 bg-surface-container-lowest border border-outline-variant rounded font-mono text-xs text-on-surface overflow-x-auto whitespace-pre leading-relaxed m-0">
            {submission.code || '// No code recorded'}
          </pre>
        </div>
      </div>
    </div>
  );
}
