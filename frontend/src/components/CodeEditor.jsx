import React, { useRef, useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axiosClient from '../utils/axiosClient';

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
  readOnly = false
}) {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState(14);
  const [minimap, setMinimap] = useState(false);
  const [wordWrap, setWordWrap] = useState('on');
  const [copied, setCopied] = useState(false);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [draftAlert, setDraftAlert] = useState(null);

  const monacoLang = MONACO_LANG_MAP[language] || 'cpp';

  // Handle editor mounting & register custom shortcuts
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom dark theme
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
        'editor.background': '#0e1017',
        'editor.foreground': '#f1f3f9',
        'editorCursor.foreground': '#818cf8',
        'editor.lineHighlightBackground': '#161924',
        'editorLineNumber.foreground': '#454b66',
        'editorLineNumber.activeForeground': '#a5b4fc',
        'editor.selectionBackground': '#312e81',
        'editor.inactiveSelectionBackground': '#1e1b4b'
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

  // Draft restoration logic
  useEffect(() => {
    if (!problemId) return;
    const localDraftKey = `cb_draft_${problemId}_${language}`;
    const savedDraft = localStorage.getItem(localDraftKey);

    if (savedDraft && savedDraft.trim() !== code.trim() && !hasRestoredDraft) {
      setDraftAlert({
        draftCode: savedDraft,
        text: "You have an unsaved local draft for this problem."
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
    if (window.confirm("Reset editor to default starter template? Your current code will be lost.")) {
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
    <div className="flex flex-col h-full bg-[#0e1017] border border-[#262b3d] rounded-xl overflow-hidden font-sans">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#131620] border-b border-[#262b3d] flex-shrink-0 text-xs">
        {/* Left Toolbar: Language & Shortcuts reminder */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#1a1e2b] text-[#9aa0b8] font-mono text-[11px] font-semibold border border-[#262b3d] uppercase">
            {monacoLang}
          </span>
          <span className="text-[#5e6480] text-[11px] hidden lg:inline font-mono">
            Run: <kbd className="bg-[#1a1e2b] px-1 py-0.5 rounded text-[10px] text-[#9aa0b8]">⌘↵</kbd>
          </span>
        </div>

        {/* Right Toolbar: Format, Font, Minimap, Copy, Reset */}
        <div className="flex items-center gap-1.5">
          {/* Format Button */}
          <button
            onClick={handleFormatCode}
            className="p-1.5 text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b] rounded transition-colors cursor-pointer"
            title="Format Document (Shift + Option + F)"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Font Size Selector */}
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-[#1a1e2b] text-[#9aa0b8] border border-[#262b3d] rounded px-1.5 py-0.5 text-[11px] font-mono cursor-pointer outline-none"
            title="Font Size"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
          </select>

          {/* Minimap Toggle */}
          <button
            onClick={() => setMinimap(!minimap)}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer border ${
              minimap
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                : 'bg-[#1a1e2b] text-[#9aa0b8] border-[#262b3d]'
            }`}
            title="Toggle Minimap"
          >
            Map
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="p-1.5 text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b] rounded transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? (
              <span className="text-emerald-400 font-mono text-[10px] font-bold">✓</span>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          {/* Reset Template */}
          <button
            onClick={handleResetCode}
            className="p-1.5 text-[#9aa0b8] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
            title="Reset Starter Code"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Draft Alert Banner */}
      {draftAlert && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-2 flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2 text-amber-300 font-sans">
            <span>💾</span>
            <span>{draftAlert.text}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyDraft}
              className="px-2 py-0.5 rounded bg-amber-500 text-black font-semibold text-[11px] cursor-pointer"
            >
              Restore Draft
            </button>
            <button
              onClick={handleDismissDraft}
              className="text-[#9aa0b8] hover:text-white text-[11px] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Monaco Container */}
      <div className="flex-1 w-full overflow-hidden">
        <Editor
          height="100%"
          language={monacoLang}
          value={code}
          onChange={(newVal) => {
            const val = newVal || '';
            onChange(val);
            if (problemId) {
              localStorage.setItem(`cb_draft_${problemId}_${language}`, val);
            }
          }}
          onMount={handleEditorDidMount}
          theme="codeblaze-dark"
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: minimap },
            wordWrap,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            readOnly,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            tabSize: 4,
            cursorBlinking: 'smooth',
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true, indentation: true }
          }}
        />
      </div>
    </div>
  );
}
