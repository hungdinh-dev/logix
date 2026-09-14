'use client'

import { useState } from 'react';
import { Play, RotateCcw, Terminal, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodePlaygroundProps {
  readonly initialCode: string;
}

// Tokenizing syntax highlighter for JavaScript (VS Code Dark Theme Colors)
function highlightJS(src: string) {
  let html = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const comments: string[] = [];
  const strings: string[] = [];

  // 1. Extract comments first so they don't get messed up by other matches
  html = html.replace(/(\/\/.*)/g, (match) => {
    comments.push(match);
    return `___COMMENT_${comments.length - 1}___`;
  });

  // 2. Extract strings next
  html = html.replace(/(["'`])([\s\S]*?)\1/g, (match) => {
    strings.push(match);
    return `___STRING_${strings.length - 1}___`;
  });

  // 3. Highlight keywords
  const keywords = /\b(let|const|var|function|return|if|else|new|delete|true|false|null|undefined|class|export|import|from|default)\b/g;
  html = html.replace(keywords, '<span class="text-[#569cd6] font-semibold">$1</span>');

  // 4. Highlight built-in functions
  html = html.replace(/\b(alert|prompt|confirm|console\.log|console)\b/g, '<span class="text-[#dcdcaa]">$1</span>');

  // 5. Highlight numbers
  html = html.replace(/\b(\d+)\b/g, '<span class="text-[#b5cea8]">$1</span>');

  // 6. Restore strings
  strings.forEach((str, index) => {
    html = html.replace(`___STRING_${index}___`, `<span class="text-[#ce9178]">${str}</span>`);
  });

  // 7. Restore comments
  comments.forEach((comment, index) => {
    html = html.replace(`___COMMENT_${index}___`, `<span class="text-[#6a9955]">${comment}</span>`);
  });

  return html;
}

export function CodePlayground({ initialCode }: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    const logs: string[] = [];

    const originalAlert = window.alert;
    const originalLog = console.log;

    console.log = (...args) => {
      logs.push(
        args
          .map((arg) => {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg);
              } catch {
                return '[Object]';
              }
            }
            return String(arg);
          })
          .join(' ')
      );
      originalLog(...args);
    };

    window.alert = (msg) => {
      logs.push(`[Alert] ${String(msg)}`);
    };

    try {
      const runner = new Function(code);
      runner();
    } catch (err: any) {
      logs.push(`Error: ${err.message}`);
    } finally {
      window.alert = originalAlert;
      console.log = originalLog;
      setOutput(logs.length > 0 ? logs : ['Code executed successfully with no output.']);
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#2d2d2d] bg-[#1e1e1e] text-slate-200 shadow-md">
      {/* Editor Title Bar */}
      <div className="flex items-center justify-between bg-[#181818] px-4 py-2 border-b border-[#2d2d2d] select-none">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-slate-400">playground.js</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={copyCode}
            title="Copy code"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={resetCode}
            title="Reset code"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Editor Body: Overlay Highlighter and Transparent Input */}
      <div className="relative bg-[#1e1e1e] min-h-[120px]">
        {/* Highlighted text block (lays underneath, pointer events disabled) */}
        <pre
          className="w-full h-full p-4 font-mono leading-relaxed text-slate-300 pointer-events-none whitespace-pre-wrap break-all select-none"
          style={{ fontSize: 'var(--lms-code-font-size, 13px)' }}
          dangerouslySetInnerHTML={{ __html: highlightJS(code) }}
        />

        {/* transparent text area on top */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute inset-0 w-full h-full resize-none bg-transparent p-4 font-mono leading-relaxed text-transparent caret-white outline-none selection:bg-slate-700/80 selection:text-white"
          style={{ fontSize: 'var(--lms-code-font-size, 13px)' }}
          spellCheck={false}
          aria-label="Code editor input"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between bg-[#151515] px-4 py-2 border-t border-[#2d2d2d] select-none">
        <Button
          size="sm"
          onClick={runCode}
          disabled={isRunning}
          className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium gap-1.5 rounded-md px-3"
        >
          <Play className="h-3 w-3 fill-current" />
          {isRunning ? 'Running...' : 'Run Code'}
        </Button>

        {output.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearOutput}
            className="h-7 text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] gap-1 px-2"
          >
            <Trash2 className="h-3 w-3" />
            Clear Console
          </Button>
        )}
      </div>

      {/* Terminal Console Output */}
      {output.length > 0 && (
        <div className="border-t border-[#2d2d2d] bg-[#0f0f0f] p-4 font-mono text-xs leading-relaxed text-emerald-400 select-text">
          <div className="flex items-center gap-1.5 mb-2 text-slate-400 font-semibold border-b border-slate-800/80 pb-1.5 select-none">
            <Terminal className="h-3.5 w-3.5" />
            <span>Console Output:</span>
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {output.map((line, idx) => (
              <div
                key={idx}
                className={line.startsWith('Error:') ? 'text-rose-400' : line.startsWith('[Alert]') ? 'text-cyan-400' : 'text-emerald-400'}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
