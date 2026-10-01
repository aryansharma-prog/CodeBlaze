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
          const startObj = p.startCode?.find(s => normalizeLang(s.language) === language);
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
    const startObj = problem?.startCode?.find(s => normalizeLang(s.language) === newLang);
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
        error: err.response?.data?.message || err.message || "Execution error",
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
      <div style={{ minHeight: '100vh', background: '#0a0b0e', display: 'flex', flexDirection: 'column', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, sans-serif" }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(108, 142, 247, 0.2)', borderTopColor: '#6c8ef7', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: '13px', color: '#7a8099', fontFamily: "'JetBrains Mono', monospace" }}>Loading problem workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0b0e', display: 'flex', flexDirection: 'column', color: '#e8eaf0', fontFamily: "'Syne', -apple-system, sans-serif" }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', padding: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            ⚠️
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>{error || "Problem not found"}</h2>
          <button
            onClick={() => navigate('/problems')}
            style={{ padding: '8px 18px', borderRadius: '8px', background: '#6c8ef7', color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Back to Problems List
          </button>
        </div>
      </div>
    );
  }

  // Right Workspace: Monaco Editor (top) + Testcase Console (bottom)
  const rightWorkspace = (
    <ResizableSplitPane
      direction="vertical"
      initialSplit={60}
      minSize={30}
      maxSize={80}
      primary={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#11131a', border: '1px solid #1e2230', borderRadius: '12px', overflow: 'hidden' }}>
          {/* Editor Header Bar */}
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
            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  background: '#1a1d2b',
                  color: '#e8eaf0',
                  border: '1px solid #2a2e42',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="cpp">C++ (GCC)</option>
                <option value="java">Java (OpenJDK)</option>
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (Node.js)</option>
              </select>
            </div>

            {/* Run, Submit, AI Mentor Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  setAutoTriggerAI(null);
                  setAiMentorOpen(!aiMentorOpen);
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: aiMentorOpen ? '1px solid #a855f7' : '1px solid rgba(168, 85, 247, 0.3)',
                  background: aiMentorOpen ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)',
                  color: '#c084fc',
                  transition: 'all 0.15s'
                }}
                title="Toggle In-Workspace AI Mentor"
              >
                <span>✨</span>
                <span>AI Mentor</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isExecuting}
                style={{
                  padding: '5px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: isExecuting ? 'not-allowed' : 'pointer',
                  background: '#1a1d2b',
                  border: '1px solid #2a2e42',
                  color: '#e8eaf0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: isExecuting ? 0.6 : 1
                }}
                title="Run Code (Cmd/Ctrl + Enter)"
              >
                <span>▶</span>
                <span>Run</span>
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isExecuting}
                style={{
                  padding: '5px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: isExecuting ? 'not-allowed' : 'pointer',
                  background: '#6c8ef7',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(108, 142, 247, 0.3)',
                  opacity: isExecuting ? 0.6 : 1
                }}
                title="Submit Solution (Cmd/Ctrl + Shift + Enter)"
              >
                <span>🚀</span>
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor Component */}
          <div style={{ flex: 1, overflow: 'hidden', background: '#0a0b0e' }}>
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
        <div style={{ height: '100%' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0b0e', overflow: 'hidden', fontFamily: "'Syne', -apple-system, sans-serif" }}>
      {/* Universal Top Navbar */}
      <Navbar />

      {/* Main Resizable Workspace */}
      <main style={{ flex: 1, overflow: 'hidden', padding: '8px', position: 'relative' }}>
        <ResizableSplitPane
          direction="horizontal"
          initialSplit={42}
          minSize={25}
          maxSize={65}
          primary={
            <div style={{ height: '100%', paddingRight: '4px' }}>
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
            <div style={{ height: '100%', paddingLeft: '4px', position: 'relative' }}>
              {rightWorkspace}

              {/* AI Mentor Drawer (Flyout on right) */}
              {aiMentorOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: '380px',
                  maxWidth: '100%',
                  zIndex: 40,
                  boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.6)',
                  background: '#0d0e14',
                  borderLeft: '1px solid #1e2230',
                  borderRadius: '12px 0 0 12px',
                  overflow: 'hidden'
                }}>
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
