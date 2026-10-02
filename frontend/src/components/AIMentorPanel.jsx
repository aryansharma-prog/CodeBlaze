import React, { useState, useRef, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

export default function AIMentorPanel({
  problem,
  code = '',
  language = 'cpp',
  recentError = null,
  activeTestCase = null,
  onClose = () => {},
  autoTriggerAction = null, // 'debug' | 'hint' etc.
  onApplyCodeFix = () => {}
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I am your **Blaze AI Copilot**.\n\nI have full context of **${problem?.title || 'this problem'}** and your **${language.toUpperCase()}** buffer. How can I assist with your solution?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState(null); // name of currently running action
  const [structuredCard, setStructuredCard] = useState(null); // Structured JSON result from quick action
  const [copiedCode, setCopiedCode] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, structuredCard, loadingAction]);

  // Handle auto-triggered action (e.g. from 1-click "Ask AI to Debug")
  useEffect(() => {
    if (autoTriggerAction === 'debug') {
      handleQuickAction('debug');
    }
  }, [autoTriggerAction]);

  const handleQuickAction = async (actionType) => {
    setLoadingAction(actionType);
    setStructuredCard(null);

    const payload = {
      title: problem?.title,
      description: problem?.description,
      code,
      language,
      testcase: activeTestCase?.input || '',
      compileError: recentError,
      runtimeError: recentError,
      stderr: recentError
    };

    try {
      let endpoint = `/ai/${actionType}`;
      if (actionType === 'bug-hunt') endpoint = '/ai/debug';

      const { data } = await axiosClient.post(endpoint, payload);

      if (data && data.data) {
        setStructuredCard({
          actionType,
          ...data.data
        });
      }
    } catch (e) {
      console.error('AI quick action failed:', e);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Blaze AI Copilot is temporarily busy or adjusting. Your code buffer is safely preserved.`
        }
      ]);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputQuery.trim() || loadingAction) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoadingAction('chat');

    try {
      const { data } = await axiosClient.post('/ai/chat', {
        messages: newMessages,
        title: problem?.title,
        description: problem?.description,
        code,
        language,
        errors: recentError
      });

      if (data && data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ Could not reach AI service. Please try again in a moment.`
        }
      ]);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation reset. I am ready to inspect your code and algorithmic logic for **${
          problem?.title || 'this problem'
        }**.`
      }
    ]);
    setStructuredCard(null);
  };

  const handleCopySuggestedFix = async (fixText) => {
    try {
      await navigator.clipboard.writeText(fixText);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface text-on-surface font-body-md overflow-hidden select-none">
      {/* AI Copilot Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-surface-container-low border-b border-outline-variant/40 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">Blaze AI</span>
          <span className="px-1.5 py-[1px] bg-secondary-container/40 text-secondary-fixed rounded font-label-sm text-[10px] border border-secondary/30">
            Gemini 1.5
          </span>
        </div>

        <div className="flex items-center gap-1 text-on-surface-variant">
          <button
            onClick={handleClearChat}
            className="p-1 hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
            title="Clear Chat History"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
            title="Close Copilot Panel"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      {/* Quick Action Prompt Pills */}
      <div className="px-2.5 py-1.5 bg-surface-container-low border-b border-outline-variant/30 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
        {[
          { id: 'hint', label: 'Hint', icon: 'lightbulb', color: 'text-primary' },
          { id: 'complexity', label: 'Complexity', icon: 'speed', color: 'text-tertiary' },
          { id: 'debug', label: 'Edge Cases', icon: 'bug_report', color: 'text-amber-400' },
          { id: 'explain', label: 'Explain', icon: 'neurology', color: 'text-secondary' },
          { id: 'optimize', label: 'Optimize', icon: 'rocket_launch', color: 'text-primary' },
          { id: 'concept', label: 'Concept', icon: 'auto_stories', color: 'text-on-surface' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleQuickAction(btn.id)}
            disabled={!!loadingAction}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full font-label-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 border ${
              loadingAction === btn.id
                ? 'bg-primary-container/20 text-primary border-primary animate-pulse'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant'
            }`}
            type="button"
          >
            <span className={`material-symbols-outlined text-[13px] ${btn.color}`}>{btn.icon}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Active Chat & Structured Output Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 font-body-sm text-body-sm text-on-surface leading-relaxed">
        {/* Structured Card Output */}
        {structuredCard && (
          <div className="bg-surface-container-low border border-primary/40 rounded p-3.5 space-y-2.5 shadow-[0_0_16px_-4px_rgba(6,182,212,0.2)] animate-fade-in">
            <div className="flex items-center justify-between border-b border-outline-variant pb-1.5">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                <span>{structuredCard.type?.replace('_', ' ') || 'Diagnostic'}</span>
              </span>
              <button
                onClick={() => setStructuredCard(null)}
                className="text-outline hover:text-on-surface cursor-pointer border-none bg-transparent"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            {structuredCard.summary && (
              <div className="font-semibold text-on-surface text-xs leading-snug">
                {structuredCard.summary}
              </div>
            )}

            {/* Issue Details if Bug */}
            {structuredCard.issue && (
              <div className="bg-error/10 border border-error/25 rounded p-2.5 text-xs text-red-300 font-mono space-y-1">
                <div className="font-bold text-error flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>Identified Flaw:</span>
                </div>
                <div>{structuredCard.issue}</div>
                {structuredCard.location && (
                  <div className="text-[11px] text-outline mt-0.5">Location: {structuredCard.location}</div>
                )}
              </div>
            )}

            {/* Explanation */}
            {structuredCard.explanation && (
              <div className="text-xs text-on-surface-variant leading-relaxed">
                {structuredCard.explanation}
              </div>
            )}

            {/* Complexity Analysis Card */}
            {structuredCard.timeComplexity && (
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="bg-surface-container p-2.5 rounded border border-outline-variant">
                  <div className="text-[10px] text-outline uppercase">Time Complexity</div>
                  <div className="text-tertiary font-bold mt-0.5">{structuredCard.timeComplexity}</div>
                  {structuredCard.timeReason && (
                    <div className="text-[10px] text-outline-variant mt-0.5">{structuredCard.timeReason}</div>
                  )}
                </div>
                <div className="bg-surface-container p-2.5 rounded border border-outline-variant">
                  <div className="text-[10px] text-outline uppercase">Space Complexity</div>
                  <div className="text-primary font-bold mt-0.5">{structuredCard.spaceComplexity}</div>
                  {structuredCard.spaceReason && (
                    <div className="text-[10px] text-outline-variant mt-0.5">{structuredCard.spaceReason}</div>
                  )}
                </div>
              </div>
            )}

            {/* Hint Box */}
            {structuredCard.hint && (
              <div className="bg-secondary-container/20 border border-secondary/30 rounded p-2.5 text-xs text-secondary-fixed flex items-start gap-2">
                <span className="material-symbols-outlined text-[15px] text-secondary mt-0.5">lightbulb</span>
                <div className="leading-snug">
                  <strong>Hint:</strong> {structuredCard.hint}
                </div>
              </div>
            )}

            {/* Code Diff Box & Suggested Fix */}
            {structuredCard.suggestedFix && (
              <div className="bg-surface-container-lowest p-2.5 rounded border border-outline-variant space-y-1.5 font-code-md text-code-md">
                <div className="flex items-center justify-between text-outline font-label-sm">
                  <span>SUGGESTED REPLACEMENT</span>
                  <button
                    onClick={() => handleCopySuggestedFix(structuredCard.suggestedFix)}
                    className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer border-none bg-transparent"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[12px]">content_copy</span>
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="p-2 bg-surface-container rounded font-mono text-xs text-tertiary overflow-x-auto m-0 whitespace-pre">
                  {structuredCard.suggestedFix}
                </pre>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onApplyCodeFix(structuredCard.suggestedFix)}
                    className="px-2.5 py-1 bg-primary text-on-primary font-label-md text-label-md font-bold rounded hover:opacity-90 transition-opacity cursor-pointer border-none"
                    type="button"
                  >
                    Apply Fix to Editor
                  </button>
                </div>
              </div>
            )}

            {/* Optimization Hints */}
            {structuredCard.optimizationHints && (
              <ul className="list-disc pl-4 space-y-1 text-xs text-on-surface-variant">
                {structuredCard.optimizationHints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Message Thread */}
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 animate-fade-in`}
            >
              <div className="flex items-center gap-1 text-outline font-label-sm text-[10px] px-1">
                <span>{isUser ? 'You' : 'Blaze AI Copilot'}</span>
              </div>
              <div
                className={`max-w-[92%] p-3 rounded-lg leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-surface-container-highest text-on-surface font-body-sm'
                    : 'bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-sm shadow-[0_0_12px_-4px_rgba(6,182,212,0.1)]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* Loading Spinner */}
        {loadingAction && (
          <div className="flex items-center gap-2 text-xs font-code-md text-primary bg-primary-container/10 border border-primary/20 rounded p-2.5 animate-pulse">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <span>Analyzing problem invariants & code syntax...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* AI Prompt Input Bar */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-surface-container-low border-t border-outline-variant/40 flex-shrink-0">
        <div className="relative flex items-center bg-surface-container-lowest rounded px-2.5 py-1.5 border border-outline-variant focus-within:border-primary transition-all">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Blaze AI... (/explain, /hint, /test)"
            className="w-full bg-transparent font-code-md text-code-md text-on-surface placeholder:text-outline focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || !!loadingAction}
            className="p-1 bg-primary hover:bg-primary-fixed-dim text-on-primary rounded transition-colors ml-1.5 flex-shrink-0 disabled:opacity-40 cursor-pointer border-none flex items-center justify-center"
            title="Send Query to Blaze AI"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
          </button>
        </div>
        <div className="flex items-center justify-between mt-1 text-outline font-label-sm text-[10px] px-0.5">
          <span>Press Enter to send</span>
          <span>Context: Active Buffer</span>
        </div>
      </form>
    </div>
  );
}
