import React, { useState, useRef, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

export default function AIMentorPanel({
  problem,
  code = '',
  language = 'cpp',
  recentError = null,
  activeTestCase = null,
  onClose = () => {},
  autoTriggerAction = null // 'debug' | 'hint' etc.
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I am your **CodeBlaze AI Mentor**.\n\nI have full context of **${problem?.title || 'this problem'}** and your **${language.toUpperCase()}** code. How can I guide you?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loadingAction, setLoadingAction] = useState(null); // name of currently running quick action
  const [structuredCard, setStructuredCard] = useState(null); // Structured JSON result from quick action
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
          content: `⚠️ AI Mentor is temporarily busy or adjusting. Your code is safely saved.`
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
        content: `Conversation cleared. I am ready to analyze your code for **${problem?.title || 'this problem'}**.`
      }
    ]);
    setStructuredCard(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e1017] border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl font-sans animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 h-11 bg-gradient-to-r from-purple-950/40 via-[#131620] to-[#131620] border-b border-purple-500/20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs text-purple-300 font-bold">
            ✨
          </div>
          <span className="font-bold text-xs text-white">AI Coding Mentor</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] border border-purple-500/25">
            Context Aware
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearChat}
            className="p-1 text-[#5e6480] hover:text-[#9aa0b8] text-xs rounded hover:bg-[#1a1e2b] cursor-pointer"
            title="Clear Chat"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#5e6480] hover:text-white text-xs rounded hover:bg-[#1a1e2b] cursor-pointer"
            title="Close Mentor Panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Quick Action Chips Bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#131620] border-b border-[#262b3d] overflow-x-auto no-scrollbar flex-shrink-0 text-xs">
        {[
          { id: 'hint', label: '💡 Hint', title: 'Get conceptual hint' },
          { id: 'debug', label: '🐛 Debug', title: 'Diagnose runtime/logical bugs' },
          { id: 'explain', label: '🧠 Explain Code', title: 'Step-by-step code explanation' },
          { id: 'complexity', label: '⏱ Complexity', title: 'Analyze Time & Space bounds' },
          { id: 'optimize', label: '🚀 Optimize', title: 'Suggest algorithmic optimizations' },
          { id: 'concept', label: '📚 Concept', title: 'Explain core DSA theory' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleQuickAction(btn.id)}
            disabled={!!loadingAction}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
              loadingAction === btn.id
                ? 'bg-purple-500/20 text-purple-300 border-purple-500 animate-pulse'
                : 'bg-[#1a1e2b] hover:bg-[#23283a] text-[#c084fc] border-purple-500/25 hover:border-purple-500/50'
            }`}
            title={btn.title}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Chat & Structured Card Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Structured Card Output */}
        {structuredCard && (
          <div className="bg-[#131620] border border-purple-500/30 rounded-xl p-4 space-y-3 shadow-lg animate-fade-in font-sans">
            <div className="flex items-center justify-between border-b border-[#262b3d] pb-2">
              <span className="font-mono text-xs font-bold text-purple-400 uppercase tracking-wider">
                {structuredCard.type?.replace('_', ' ') || 'Analysis'}
              </span>
              <button
                onClick={() => setStructuredCard(null)}
                className="text-[#5e6480] hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Summary */}
            {structuredCard.summary && (
              <div className="text-xs font-semibold text-white">
                {structuredCard.summary}
              </div>
            )}

            {/* Debug specific fields */}
            {structuredCard.issue && (
              <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-2.5 text-xs text-red-300 font-mono">
                <strong>Issue:</strong> {structuredCard.issue}
                {structuredCard.location && <div className="text-[11px] text-red-400/80 mt-1">At: {structuredCard.location}</div>}
              </div>
            )}

            {/* Explanation */}
            {structuredCard.explanation && (
              <div className="text-xs text-[#ced3e8] leading-relaxed">
                {structuredCard.explanation}
              </div>
            )}

            {/* Complexity fields */}
            {structuredCard.timeComplexity && (
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                <div className="bg-[#0e1017] p-2.5 rounded border border-[#1c202e]">
                  <div className="text-[10px] text-[#5e6480]">Time Complexity</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{structuredCard.timeComplexity}</div>
                  {structuredCard.timeReason && <div className="text-[10px] text-[#9aa0b8] mt-1">{structuredCard.timeReason}</div>}
                </div>
                <div className="bg-[#0e1017] p-2.5 rounded border border-[#1c202e]">
                  <div className="text-[10px] text-[#5e6480]">Space Complexity</div>
                  <div className="text-indigo-400 font-bold mt-0.5">{structuredCard.spaceComplexity}</div>
                  {structuredCard.spaceReason && <div className="text-[10px] text-[#9aa0b8] mt-1">{structuredCard.spaceReason}</div>}
                </div>
              </div>
            )}

            {/* Hint & Suggested Fix */}
            {structuredCard.hint && (
              <div className="bg-purple-500/10 border border-purple-500/25 rounded-lg p-2.5 text-xs text-purple-300">
                <strong>💡 Hint:</strong> {structuredCard.hint}
              </div>
            )}

            {structuredCard.suggestedFix && (
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[#5e6480] uppercase">Suggested Fix / Pattern</div>
                <pre className="p-2.5 bg-[#0e1017] rounded-lg border border-[#262b3d] font-mono text-xs text-emerald-400 overflow-x-auto">
                  {structuredCard.suggestedFix}
                </pre>
              </div>
            )}

            {/* Optimization Hints */}
            {structuredCard.optimizationHints && (
              <ul className="list-disc pl-4 space-y-1 text-xs text-[#ced3e8]">
                {structuredCard.optimizationHints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Chat Message History */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white font-sans rounded-br-none'
                  : 'bg-[#131620] border border-[#262b3d] text-[#ced3e8] rounded-bl-none font-sans'
              }`}
            >
              {msg.content}
            </div>
            <span className="text-[10px] font-mono text-[#5e6480] mt-1 px-1">
              {msg.role === 'user' ? 'You' : 'AI Mentor'}
            </span>
          </div>
        ))}

        {/* Spinner when waiting */}
        {loadingAction && (
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 border border-purple-500/25 rounded-xl p-3 animate-pulse">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin-custom"></div>
            <span>Analyzing code & problem invariants...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-[#131620] border-t border-[#262b3d] flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask mentor a follow-up or question..."
          className="flex-1 bg-[#0e1017] border border-[#262b3d] focus:border-purple-500 rounded-lg px-3 py-2 text-xs text-white outline-none placeholder-[#5e6480] font-sans"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || !!loadingAction}
          className="btn-ai text-xs py-2 px-3"
        >
          Send
        </button>
      </form>
    </div>
  );
}
