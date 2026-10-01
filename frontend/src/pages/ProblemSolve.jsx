import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
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

  // AI Mentor Drawer State
  const [aiMentorOpen, setAiMentorOpen] = useState(false);
  const [autoTriggerAI, setAutoTriggerAI] = useState(null);

  // Bookmarking & Solved
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

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

          // Find starter code matching default language
          const startObj = p.startCode?.find(s => s.language.toLowerCase() === language.toLowerCase());
          const initialCode = startObj ? startObj.initialCode : (STARTER_TEMPLATES[language] || STARTER_TEMPLATES.cpp);

          // Restore local draft if present
          const draftKey = `cb_draft_${p._id}_${language}`;
          const savedDraft = localStorage.getItem(draftKey);
          setCode(savedDraft || initialCode);
        } else {
          setError("Problem not found");
        }
      } catch (err) {
        console.error('Fetch problem error:', err);
        setError(err.response?.data?.message || err.message || "Failed to load problem");
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
    const startObj = problem?.startCode?.find(s => s.language.toLowerCase() === newLang.toLowerCase());
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
        setRunResult(data);
      }
    } catch (err) {
      console.error('Run code error:', err);
      setRunResult({
        success: false,
        allPassed: false,
        error: err.response?.data?.message || err.message || "Execution error",
        runtime: 0,
        memory: 0,
        testCases: []
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
        setActiveSubmissionModal({
          ...data,
          code,
          language,
          createdAt: new Date()
        });
        if (data.accepted) {
          setIsSolved(true);
        }
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Submit code error:', err);
      setActiveSubmissionModal({
        status: 'error',
        accepted: false,
        errorMessage: err.response?.data?.message || err.message || "Submission failed",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-500/30 border-t-indigo-500 animate-spin-custom"></div>
          <p className="text-xs font-mono text-[#5e6480]">Loading problem workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[#0a0b0e] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xl font-bold">
            ⚠️
          </div>
          <h2 className="text-base font-bold text-white">{error || "Problem not found"}</h2>
          <button onClick={() => navigate('/problems')} className="btn-primary text-xs py-2 px-4">
            Back to Problem List
          </button>
        </div>
      </div>
    );
  }

  // Right Workspace (Code Editor top, Testcase Console bottom)
  const rightWorkspace = (
    <ResizableSplitPane
      direction="vertical"
      initialSplit={60}
      minSize={30}
      maxSize={80}
      primary={
        <div className="flex flex-col h-full overflow-hidden">
          {/* Editor Header Bar (Language switch & Run/Submit controls) */}
          <div className="flex items-center justify-between px-3 h-10 bg-[#131620] border-b border-[#262b3d] flex-shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#1a1e2b] text-[#ced3e8] border border-[#262b3d] hover:border-[#373e57] rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer outline-none transition-colors"
              >
                <option value="cpp">C++ (GCC 9.2)</option>
                <option value="java">Java (OpenJDK 13)</option>
                <option value="python">Python 3 (3.8+)</option>
                <option value="javascript">JavaScript (Node.js)</option>
              </select>
            </div>

            {/* Run, Submit, AI Mentor Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAutoTriggerAI(null);
                  setAiMentorOpen(!aiMentorOpen);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 border ${
                  aiMentorOpen
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20'
                    : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/30'
                }`}
                title="Open AI Coding Mentor"
              >
                <span>✨</span>
                <span>AI Mentor</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                className="btn-secondary text-xs py-1 px-3.5"
                title="Run Code (Cmd/Ctrl + Enter)"
              >
                <span>▶</span>
                <span>Run</span>
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isExecuting}
                className="btn-primary text-xs py-1 px-4"
                title="Submit Solution (Cmd/Ctrl + Shift + Enter)"
              >
                <span>🚀</span>
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Component */}
          <div className="flex-1 overflow-hidden p-1 bg-[#0a0b0e]">
            <CodeEditor
              problemId={problem._id}
              language={language}
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              onSubmit={handleSubmitCode}
            />
          </div>
        </div>
      }
      secondary={
        <div className="h-full p-1 bg-[#0a0b0e]">
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
    <div className="flex flex-col h-screen bg-[#0a0b0e] overflow-hidden font-sans select-none">
      {/* Universal Top Navbar */}
      <Navbar />

      {/* Main Resizable Workspace */}
      <main className="flex-1 overflow-hidden p-2 relative">
        <ResizableSplitPane
          direction="horizontal"
          initialSplit={42}
          minSize={25}
          maxSize={65}
          primary={
            <div className="h-full pr-1">
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
            <div className="h-full pl-1 relative">
              {rightWorkspace}

              {/* AI Mentor Drawer (Flyout on right) */}
              {aiMentorOpen && (
                <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 z-30 shadow-2xl p-1 bg-[#0a0b0e]/95 backdrop-blur-md animate-fade-in">
                  <AIMentorPanel
                    problem={problem}
                    code={code}
                    language={language}
                    recentError={runResult?.error || null}
                    activeTestCase={problem.visibleTestCases?.[0] || null}
                    onClose={() => setAiMentorOpen(false)}
                    autoTriggerAction={autoTriggerAI}
                  />
                </div>
              )}
            </div>
          }
        />
      </main>

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
