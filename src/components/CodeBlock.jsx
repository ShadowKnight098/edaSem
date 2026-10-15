import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode } from 'lucide-react';
import { highlightCode } from '../utils/syntaxHighlight';

export default function CodeBlock({
  code = '',
  language = 'text',
  filename = '',
  runCommand = '',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'js':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'python':
      case 'py':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'powershell':
      case 'pwsh':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'html':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-[#0d131f] overflow-hidden shadow-xl shadow-black/40">
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2.5">
          {/* OS/Terminal indicator dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>

          {/* Language Pill */}
          <span
            className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-md border ${getLanguageColor(
              language
            )}`}
          >
            {language}
          </span>

          {/* Filename Pill */}
          {filename && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono text-slate-300 bg-slate-800/80 rounded-md border border-slate-700">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{filename}</span>
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all border ${
            copied
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
          }`}
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Optional Run Command Banner */}
      {runCommand && (
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 text-xs font-mono text-cyan-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span className="text-slate-400">PowerShell command:</span>
          <span className="select-all font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {runCommand}
          </span>
        </div>
      )}

      {/* Code Area */}
      <div className="p-4 overflow-x-auto text-sm leading-relaxed font-mono">
        <div className="table min-w-full">{highlightCode(code, language)}</div>
      </div>
    </div>
  );
}
