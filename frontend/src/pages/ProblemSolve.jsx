import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';
import ResizableSplitPane from '../components/ResizableSplitPane';
import ProblemDescriptionPanel from '../components/ProblemDescriptionPanel';
import CodeEditor, { STARTER_TEMPLATES } from '../components/CodeEditor';
import TestcaseConsole from '../components/TestcaseConsole';
import AIMentorPanel from '../components/AIMentorPanel';
import SubmissionResultModal from '../components/SubmissionResultModal';

export default function ProblemSolve() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor State
  const [language, setLanguage] = useState('cpp');
  const [code, setCode] = useState(STARTER_TEMPLATES.cpp);
  const [customTestCases, setCustomTestCases] = useState([]);

  // Execution State
  const [isExecuting, setIsExecuting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeSubmissionModal, setActiveSubmissionModal] = useState(null);

  // AI Mentor Panel State
  const [aiMentorOpen, setAiMentorOpen] = useState(false);
  const [autoTriggerAI, setAutoTriggerAI] = useState(null);

  // Bookmarking & Solved
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  // Session Stopwatch Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Fullscreen toggle state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const workspaceContainerRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSecs) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Helper to normalize language names
  const normalizeLang = (l) => {
    const lang = (l || '').toLowerCase();
    if (lang === 'c++' || lang === 'cpp') return 'cpp';
    if (lang === 'js' || lang === 'javascript') return 'javascript';
    if (lang === 'py' || lang === 'python' || lang === 'python3') return 'python';
    if (lang === 'java') return 'java';
    return 'cpp';
  };

  // Fetch problem details & submissions
  useEffect(() => {
    if (!id) return;
    const fetchProblemData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${id}`);
        if (data && data.data) {
          const p = data.data;
          setProblem(p);
          setIsSolved(!!p.isSolved);
          setIsBookmarked(!!p.isBookmarked);

          // Save last problem for Homepage 'Continue Coding' card
          localStorage.setItem('codeblaze_last_problem_id', p._id);
          localStorage.setItem('codeblaze_last_problem_title', p.title);

          // Find starter code matching default language
          const startObj = p.startCode?.find((s) => normalizeLang(s.language) === language);
          const initialCode = startObj ? startObj.initialCode : (STARTER_TEMPLATES[language] || STARTER_TEMPLATES.cpp);

          // Restore local draft if present
          const draftKey = `cb_draft_${p._id}_${language}`;
          const savedDraft = localStorage.getItem(draftKey);
          setCode(savedDraft || initialCode);
        } else {
          setError('Problem not found');
        }
      } catch (err) {
        console.error('Fetch problem error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [id]);

  // Fetch problem submissions if user is authenticated
  const fetchSubmissions = useCallback(async () => {
    if (!problem?._id || !isAuthenticated) return;
    try {
      const { data } = await axiosClient.get(`/problem/submittedProblem/${problem._id}`);
      if (data && data.data && Array.isArray(data.data)) {
        setSubmissions(data.data);
      }
    } catch (e) {
      console.error('Fetch submissions error:', e);
    }
  }, [problem?._id, isAuthenticated]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Switch language
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const startObj = problem?.startCode?.find((s) => normalizeLang(s.language) === newLang);
    const fallbackTemplate = STARTER_TEMPLATES[newLang] || STARTER_TEMPLATES.cpp;
    const draftKey = `cb_draft_${problem?._id}_${newLang}`;
    const savedDraft = localStorage.getItem(draftKey);
    setCode(savedDraft || (startObj ? startObj.initialCode : fallbackTemplate));
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await axiosClient.post('/problem/bookmark', { problemId: problem._id });
      if (data && data.success) {
        setIsBookmarked(data.bookmarked);
      }
    } catch (e) {
      console.error('Bookmark toggle error:', e);
    }
  };

  // RUN CODE
  const handleRunCode = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setRunResult(null);

    try {
      const { data } = await axiosClient.post(`/submission/run/${problem._id}`, {
        code,
        language,
        customTestCases
      });

      if (data) {
        setRunResult(data.data || data);
      }
    } catch (err) {
      console.error('Run code error:', err);
      setRunResult({
        success: false,
        allPassed: false,
        status: 'Runtime / Execution Error',
        error: err.response?.data?.message || err.message || 'Execution error',
        runtime: 0,
        memory: 0
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // SUBMIT CODE
  const handleSubmitCode = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isExecuting) return;
    setIsExecuting(true);

    try {
      const { data } = await axiosClient.post(`/submission/submit/${problem._id}`, {
        code,
        language
      });

      if (data) {
        const payload = data.data || data;
        setActiveSubmissionModal({
          ...payload,
          code,
          language,
          createdAt: new Date()
        });
        if (payload.accepted || String(payload.status).toLowerCase().includes('accepted')) {
          setIsSolved(true);
        }
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Submit code error:', err);
      setActiveSubmissionModal({
        status: 'Error',
        accepted: false,
        errorMessage: err.response?.data?.message || err.message || 'Submission failed',
        code,
        language,
        createdAt: new Date()
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // 1-Click Ask AI to Debug
  const handleAskAIDebug = (errorMessage) => {
    setAutoTriggerAI('debug');
    setAiMentorOpen(true);
  };

  // 1-Click Apply AI Suggested Fix to Editor
  const handleApplyCodeFix = (newCode) => {
    if (newCode) {
      setCode(newCode);
      if (problem?._id) {
        localStorage.setItem(`cb_draft_${problem._id}_${language}`, newCode);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col text-on-surface font-body-md">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="font-code-md text-code-md text-outline">Loading problem workstation...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-surface flex flex-col text-on-surface font-body-md">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-error/10 border border-error/30 flex items-center justify-center text-error text-2xl">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <h2 className="font-headline-md text-headline-md font-bold">{error || 'Problem not found'}</h2>
          <button
            onClick={() => navigate('/problems')}
            className="btn-primary"
          >
            Back to Problems List
          </button>
        </div>
      </div>
    );
  }

  const difficulty = (problem.difficulty || 'easy').toLowerCase();
  const getDiffBadge = () => {
    if (difficulty === 'easy') {
      return (
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-label-sm uppercase tracking-wider font-semibold">
          Easy
        </span>
      );
    }
    if (difficulty === 'medium') {
      return (
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 font-label-sm uppercase tracking-wider font-semibold">
          Medium
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/25 font-label-sm uppercase tracking-wider font-semibold">
        Hard
      </span>
    );
  };

  // Center & Right Workspace: Monaco Editor (top) + Testbench (bottom)
  const editorAndTestbench = (
    <ResizableSplitPane
      direction="vertical"
      initialSplit={62}
      minSize={30}
      maxSize={80}
      primary={
        <div className="h-full bg-surface-container-lowest">
          <CodeEditor
            problemId={problem._id}
            language={language}
            code={code}
            onChange={setCode}
            onRun={handleRunCode}
            onSubmit={handleSubmitCode}
            onLanguageChange={handleLanguageChange}
            onToggleAI={() => {
              setAutoTriggerAI(null);
              setAiMentorOpen(!aiMentorOpen);
            }}
            aiMentorOpen={aiMentorOpen}
            isExecuting={isExecuting}
          />
        </div>
      }
      secondary={
        <div className="h-full bg-surface-container-lowest">
          <TestcaseConsole
            visibleTestCases={problem.visibleTestCases || []}
            customTestCases={customTestCases}
            onUpdateCustomTestCases={setCustomTestCases}
            runResult={runResult}
            isExecuting={isExecuting}
            onAskAIDebug={handleAskAIDebug}
          />
        </div>
      }
    />
  );

  return (
    <div ref={workspaceContainerRef} className="flex flex-col h-screen bg-surface overflow-hidden text-on-surface font-body-md select-none">
      {/* Universal Top Navbar */}
      <Navbar />

      {/* Stitch IDE Sub-Header Control Bar */}
      <section className="w-full bg-surface-container-low px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/40 flex-shrink-0 z-30">
        {/* Left Meta Cluster */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/problems"
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-body-sm group text-decoration-none"
          >
            <span className="material-symbols-outlined text-[17px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            <span className="hidden sm:inline font-medium">Problems</span>
          </Link>

          <div className="h-4 w-px bg-outline-variant/40"></div>

          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">
              #{String(problem.problemNumber || problem.title?.split('.')[0] || 1).padStart(3, '0')}. {problem.title?.replace(/^\d+\.\s*/, '')}
            </span>
            {getDiffBadge()}
            {isSolved && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-label-sm">
                ✓ Solved
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3 text-on-surface-variant font-label-md text-label-md">
            <div className="flex items-center gap-1" title="Acceptance Rate">
              <span className="material-symbols-outlined text-[15px] text-tertiary">check_circle</span>
              <span className="text-on-surface font-semibold">{problem.acceptance?.rate ? `${problem.acceptance.rate}%` : '52.4%'}</span>
            </div>

            <div className="h-3 w-px bg-outline-variant/30"></div>

            {/* Stopwatch Timer Widget */}
            <div className="flex items-center gap-1.5 bg-surface-container px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px] text-primary">timer</span>
              <span className="font-code-md text-code-md font-medium text-on-surface">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="hover:text-primary text-on-surface-variant transition-colors p-0.5 cursor-pointer"
                title={timerRunning ? 'Pause Stopwatch' : 'Resume Stopwatch'}
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">{timerRunning ? 'pause' : 'play_arrow'}</span>
              </button>
            </div>

            {/* Bookmark Action */}
            <button
              onClick={handleToggleBookmark}
              className={`p-1 transition-colors cursor-pointer rounded hover:bg-surface-container ${
                isBookmarked ? 'text-amber-400' : 'text-on-surface-variant hover:text-amber-400'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">{isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
            </button>
          </div>
        </div>

        {/* Right Execution Controls & Workstation Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-surface-container hover:bg-surface-container-high text-on-surface font-code-md text-code-md pl-2.5 pr-7 py-1 rounded cursor-pointer border border-outline-variant focus:outline-none focus:border-primary transition-colors"
            >
              <option value="cpp">C++ 20 (gcc 13)</option>
              <option value="java">Java 21 (OpenJDK)</option>
              <option value="python">Python 3.11</option>
              <option value="javascript">JavaScript (Node 20)</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[16px] text-outline">
              expand_more
            </span>
          </div>

          {/* AI Copilot Toggle */}
          <button
            onClick={() => {
              setAutoTriggerAI(null);
              setAiMentorOpen(!aiMentorOpen);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-label-md text-label-md font-semibold transition-all cursor-pointer ${
              aiMentorOpen
                ? 'bg-secondary-container/40 text-secondary-fixed border border-secondary/50 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                : 'bg-surface-container hover:bg-surface-container-high text-secondary border border-outline-variant'
            }`}
            title="Toggle Blaze AI Copilot"
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Blaze AI</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-high hover:bg-surface-bright text-on-surface rounded border border-outline-variant font-label-md text-label-md font-semibold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            title="Run Code (Cmd/Ctrl + Enter)"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">play_arrow</span>
            <span>Run</span>
            <kbd className="hidden sm:inline px-1 py-[1px] bg-surface-container-lowest text-outline rounded font-label-sm text-[9px]">
              ⌘⏎
            </kbd>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmitCode}
            disabled={isExecuting}
            className="btn-submit flex items-center gap-1.5 px-3.5 py-1 font-label-md text-label-md font-bold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            title="Submit Solution (Cmd/Ctrl + Shift + Enter)"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
            <span>Submit</span>
            <kbd className="hidden sm:inline px-1 py-[1px] bg-black/20 text-on-tertiary rounded font-label-sm text-[9px]">
              ⇧⌘⏎
            </kbd>
          </button>

          <div className="h-4 w-px bg-outline-variant/40"></div>

          {/* Action Tools */}
          <div className="flex items-center gap-0.5 text-on-surface-variant">
            <button
              onClick={toggleFullscreen}
              className="p-1 hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace (IDE Panels) */}
      <main className="flex-1 overflow-hidden relative p-[2px] bg-surface-container-lowest">
        <ResizableSplitPane
          direction="horizontal"
          initialSplit={42}
          minSize={25}
          maxSize={65}
          primary={
            <div className="h-full overflow-hidden bg-surface rounded-DEFAULT border border-outline-variant/40">
              <ProblemDescriptionPanel
                problem={problem}
                isSolved={isSolved}
                isBookmarked={isBookmarked}
                onToggleBookmark={handleToggleBookmark}
                submissions={submissions}
                onSelectSubmission={(sub) => setActiveSubmissionModal(sub)}
              />
            </div>
          }
          secondary={
            <div className="h-full flex overflow-hidden relative">
              {/* Center Workspace (Editor + Testbench) */}
              <div className="flex-1 h-full overflow-hidden bg-surface-container-lowest rounded-DEFAULT border border-outline-variant/40">
                {editorAndTestbench}
              </div>

              {/* Right Docked/Drawer Panel: Blaze AI Copilot */}
              {aiMentorOpen && (
                <div className="w-[380px] max-w-full h-full flex-shrink-0 border-l border-outline-variant/40 bg-surface rounded-r-DEFAULT overflow-hidden shadow-2xl z-20 animate-fade-in">
                  <AIMentorPanel
                    problem={problem}
                    code={code}
                    language={language}
                    recentError={runResult?.error || runResult?.stderr || null}
                    activeTestCase={problem.visibleTestCases?.[0] || null}
                    onClose={() => setAiMentorOpen(false)}
                    autoTriggerAction={autoTriggerAI}
                    onApplyCodeFix={handleApplyCodeFix}
                  />
                </div>
              )}
            </div>
          }
        />
      </main>

      {/* Bottom Telemetry Status Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/40 z-30 flex-shrink-0">
        <div className="w-full px-4 h-7 flex items-center justify-between gap-4 font-code-md text-code-sm text-on-surface-variant">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-on-surface font-medium">Judge0: Operational</span>
            </div>
            <span className="text-outline-variant">•</span>
            <span className="text-outline">
              Latency: <span className="text-tertiary">24ms</span>
            </span>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <span className="text-outline hidden sm:inline">
              Runtimes: <span className="text-on-surface">C++20 / Py3.11 / Java21 / Node20</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-outline font-label-sm text-[10px]">
              <span>CLUSTER: US-EAST-01</span>
              <span className="text-outline-variant">•</span>
              <span>ENV: PROD</span>
            </div>
            <span className="font-label-sm text-outline">
              Problem ID: <span className="text-primary font-mono">{problem._id.slice(-6)}</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Submission Result Modal */}
      {activeSubmissionModal && (
        <SubmissionResultModal
          submission={activeSubmissionModal}
          isOpen={!!activeSubmissionModal}
          onClose={() => setActiveSubmissionModal(null)}
          onAskAIDebug={handleAskAIDebug}
        />
      )}
    </div>
  );
}
