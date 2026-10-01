import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export const STARTER_TEMPLATES = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Write your code here
    return 0;
}`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your code here
    }
}`,
  python: `import sys

def solve():
    # Write your code here
    pass

if __name__ == '__main__':
    solve()`,
  javascript: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim();
    // Write your code here
}

solve();`
};

export const MONACO_LANG_MAP = {
  cpp: 'cpp',
  'c++': 'cpp',
  java: 'java',
  python: 'python',
  py: 'python',
  javascript: 'javascript',
  js: 'javascript'
};

export default function CodeEditor({
  problemId,
  language = 'cpp',
  code = '',
  onChange = () => {},
  onRun = () => {},
  onSubmit = () => {},
  onLanguageChange = () => {},
  onToggleAI = () => {},
  aiMentorOpen = false,
  isExecuting = false,
  readOnly = false
}) {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState(13);
  const [minimap, setMinimap] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftAlert, setDraftAlert] = useState(null);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

  const monacoLang = MONACO_LANG_MAP[language] || 'cpp';

  // Handle editor mounting & register custom shortcuts
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom dark theme
    monaco.editor.defineTheme('codeblaze-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5e6480', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'string', foreground: '34d399' },
        { token: 'type', foreground: '60a5fa' },
        { token: 'identifier', foreground: 'f1f3f9' }
      ],
      colors: {
        'editor.background': '#0a0b0e',
        'editor.foreground': '#e8eaf0',
        'editorCursor.foreground': '#6c8ef7',
        'editor.lineHighlightBackground': '#131620',
        'editorLineNumber.foreground': '#3a3f58',
        'editorLineNumber.activeForeground': '#6c8ef7',
        'editor.selectionBackground': '#263359',
        'editor.inactiveSelectionBackground': '#182038'
      }
    });

    monaco.editor.setTheme('codeblaze-dark');

    // Run Code: Cmd/Ctrl + Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });

    // Submit Code: Cmd/Ctrl + Shift + Enter
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      onSubmit();
    });
  };

  // Draft restoration detection
  useEffect(() => {
    if (!problemId) return;
    const localDraftKey = `cb_draft_${problemId}_${language}`;
    const savedDraft = localStorage.getItem(localDraftKey);

    if (savedDraft && savedDraft.trim() !== code.trim() && !hasRestoredDraft) {
      setDraftAlert({
        draftCode: savedDraft,
        text: "You have a saved local draft for this problem."
      });
    }
  }, [problemId, language]);

  const handleApplyDraft = () => {
    if (draftAlert?.draftCode) {
      onChange(draftAlert.draftCode);
      setHasRestoredDraft(true);
      setDraftAlert(null);
    }
  };

  const handleDismissDraft = () => {
    setDraftAlert(null);
    setHasRestoredDraft(true);
  };

  const handleResetCode = () => {
    if (window.confirm("Reset editor to default starter template? Current changes will be overwritten.")) {
      const template = STARTER_TEMPLATES[monacoLang] || STARTER_TEMPLATES.cpp;
      onChange(template);
      if (problemId) {
        localStorage.removeItem(`cb_draft_${problemId}_${language}`);
      }
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

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
      {/* Unified Editor Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        height: '42px',
        background: '#0d0e14',
        borderBottom: '1px solid #1e2230',
        flexShrink: 0,
        gap: '8px'
      }}>
        {/* Left: Language selector & tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
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
            <option value="javascript">JavaScript (Node)</option>
          </select>

          {/* Format */}
          <button
            onClick={handleFormatCode}
            style={{
              background: '#1a1d2b',
              border: '1px solid #2a2e42',
              borderRadius: '6px',
              padding: '5px 8px',
              color: '#888d9f',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Format Document (Shift + Option + F)"
          >
            Format
          </button>

          {/* Font size */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{
              background: '#1a1d2b',
              color: '#888d9f',
              border: '1px solid #2a2e42',
              borderRadius: '6px',
              padding: '4px 6px',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              cursor: 'pointer',
              outline: 'none'
            }}
            title="Font Size"
          >
            <option value={12}>12px</option>
            <option value={13}>13px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
          </select>

          {/* Minimap */}
          <button
            onClick={() => setMinimap(!minimap)}
            style={{
              background: minimap ? 'rgba(108, 142, 247, 0.2)' : '#1a1d2b',
              border: minimap ? '1px solid #6c8ef7' : '1px solid #2a2e42',
              borderRadius: '6px',
              padding: '4px 8px',
              color: minimap ? '#6c8ef7' : '#888d9f',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace"
            }}
            title="Toggle Minimap"
          >
            Map
          </button>

          {/* Copy */}
          <button
            onClick={handleCopyCode}
            style={{
              background: '#1a1d2b',
              border: '1px solid #2a2e42',
              borderRadius: '6px',
              padding: '4px 8px',
              color: copied ? '#22c55e' : '#888d9f',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            title="Copy Code"
          >
            {copied ? '✓' : 'Copy'}
          </button>

          {/* Reset */}
          <button
            onClick={handleResetCode}
            style={{
              background: 'none',
              border: '1px solid #2a2e42',
              borderRadius: '6px',
              padding: '4px 8px',
              color: '#f87171',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            title="Reset code to default template"
          >
            Reset
          </button>
        </div>

        {/* Right: AI Mentor, Run, Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onToggleAI}
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
            onClick={onRun}
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
            onClick={onSubmit}
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

      {/* Draft Alert Banner */}
      {draftAlert && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#fcd34d'
        }}>
          <span>💾 {draftAlert.text}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleApplyDraft}
              style={{
                padding: '3px 10px',
                borderRadius: '4px',
                background: '#f59e0b',
                color: '#000',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Restore Draft
            </button>
            <button
              onClick={handleDismissDraft}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e8eaf0',
                fontSize: '11px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Monaco Container */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          theme="codeblaze-dark"
          onChange={(value) => {
            const nextVal = value || '';
            onChange(nextVal);
            if (problemId) {
              localStorage.setItem(`cb_draft_${problemId}_${language}`, nextVal);
            }
          }}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
            fontLigatures: true,
            tabSize: 4,
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>
    </div>
  );
}
