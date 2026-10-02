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

const FILE_NAME_MAP = {
  cpp: 'solution.cpp',
  java: 'Solution.java',
  python: 'solution.py',
  javascript: 'solution.js'
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
  const fileName = FILE_NAME_MAP[language] || 'solution.cpp';

  // Handle editor mounting & register custom shortcuts
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Stitch Terminal Precision dark theme
    monaco.editor.defineTheme('codeblaze-stitch-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '869397', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'd0bcff', fontStyle: 'bold' },
        { token: 'number', foreground: 'f59e0b' },
        { token: 'string', foreground: '4edea3' },
        { token: 'type', foreground: '4cd7f6' },
        { token: 'identifier', foreground: 'e1e2ea' },
        { token: 'delimiter', foreground: 'bcc9cd' }
      ],
      colors: {
        'editor.background': '#0b0e13',
        'editor.foreground': '#e1e2ea',
        'editorCursor.foreground': '#4cd7f6',
        'editor.lineHighlightBackground': '#161d2a',
        'editorLineNumber.foreground': '#3d494c',
        'editorLineNumber.activeForeground': '#4cd7f6',
        'editor.selectionBackground': '#00424f',
        'editor.inactiveSelectionBackground': '#191c21'
      }
    });

    monaco.editor.setTheme('codeblaze-stitch-dark');

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
        text: 'A saved local draft exists for this problem.'
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
    if (window.confirm('Reset editor to default starter template? Unsaved changes will be replaced.')) {
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
    <div className="flex flex-col h-full bg-surface-container-lowest overflow-hidden font-body-md">
      {/* Editor Top Bar & Controls */}
      <div className="flex items-center justify-between bg-surface-container-low px-2 py-1 border-b border-outline-variant/40 flex-shrink-0">
        {/* Left: Active File Tab */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest text-on-surface font-code-md text-code-md rounded-t shadow-[0_-2px_0_0_#4cd7f6_inset]">
            <span className="material-symbols-outlined text-[15px] text-amber-400">code</span>
            <span>{fileName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1" title="Active Solution Buffer" />
          </div>
        </div>

        {/* Right: Editor Toolbar Actions */}
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
          {/* Font Size */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface border border-outline-variant rounded px-1.5 py-0.5 text-[11px] font-mono cursor-pointer outline-none"
            title="Editor Font Size"
          >
            <option value={12}>12px</option>
            <option value={13}>13px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
          </select>

          {/* Format Code */}
          <button
            onClick={handleFormatCode}
            className="p-1 hover:text-on-surface hover:bg-surface-container rounded transition-colors cursor-pointer"
            title="Format Code (Prettier)"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">align_horizontal_left</span>
          </button>

          {/* Reset Starter Code */}
          <button
            onClick={handleResetCode}
            className="p-1 hover:text-error hover:bg-surface-container rounded transition-colors cursor-pointer"
            title="Reset to Starter Template"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          </button>

          {/* Minimap Toggle */}
          <button
            onClick={() => setMinimap(!minimap)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
              minimap
                ? 'bg-primary-container/20 text-primary border-primary/40'
                : 'bg-surface-container hover:bg-surface-container-high text-outline border-outline-variant'
            }`}
            title="Toggle Minimap"
            type="button"
          >
            Map
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="p-1 hover:text-tertiary hover:bg-surface-container rounded transition-colors cursor-pointer"
            title="Copy Solution Code"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">{copied ? 'done' : 'content_copy'}</span>
          </button>
        </div>
      </div>

      {/* Draft Alert Banner */}
      {draftAlert && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-3 py-1.5 flex items-center justify-between font-label-sm text-amber-300">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">save</span>
            <span>{draftAlert.text}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleApplyDraft}
              className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold font-mono text-[10px] cursor-pointer border-none"
              type="button"
            >
              Restore Draft
            </button>
            <button
              onClick={handleDismissDraft}
              className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[10px] cursor-pointer border border-outline-variant"
              type="button"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Monaco Container */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          theme="codeblaze-stitch-dark"
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
            fontFamily: "'JetBrains Mono', monospace",
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
            padding: { top: 8, bottom: 8 }
          }}
        />
      </div>
    </div>
  );
}
