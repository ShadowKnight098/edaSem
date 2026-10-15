import React from 'react';

// Lightweight regex-based syntax highlighter for Python, JavaScript, and PowerShell
export function highlightCode(code, language = 'text') {
  if (!code) return '';
  const lang = language.toLowerCase();

  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    const tokens = tokenizeLine(line, lang);
    return (
      <div key={lineIndex} className="table-row">
        <span className="table-cell select-none pr-4 text-right text-xs text-slate-600 font-mono">
          {lineIndex + 1}
        </span>
        <span className="table-cell font-mono whitespace-pre">
          {tokens.map((token, tokenIdx) => (
            <span key={tokenIdx} className={token.className}>
              {token.text}
            </span>
          ))}
        </span>
      </div>
    );
  });
}

function tokenizeLine(line, lang) {
  if (line.length === 0) {
    return [{ text: ' ', className: '' }];
  }

  // Handle entire comment lines
  const trimmed = line.trim();
  if (
    (lang === 'python' || lang === 'powershell') && trimmed.startsWith('#')
  ) {
    return [{ text: line, className: 'text-emerald-400/80 italic' }];
  }
  if ((lang === 'javascript' || lang === 'js') && trimmed.startsWith('//')) {
    return [{ text: line, className: 'text-emerald-400/80 italic' }];
  }

  // Token definition
  const tokens = [];
  // Tokenizer pattern
  // Matches: strings, comments, numbers, keywords, word identifiers, symbols
  const regex =
    /(["'`])(?:(?=(\\?))\2.)*?\1|(#.*$|\/\/.*$)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)|([{}()[\],;=+\-*/%&|<>!?:.]|\S)/g;

  let lastIndex = 0;
  let match;

  const pythonKeywords = new Set([
    'import', 'from', 'as', 'def', 'return', 'class', 'if', 'elif', 'else',
    'while', 'for', 'in', 'try', 'except', 'finally', 'raise', 'with', 'assert',
    'pass', 'break', 'continue', 'lambda', 'yield', 'True', 'False', 'None',
    'not', 'and', 'or', 'is', 'async', 'await'
  ]);

  const jsKeywords = new Set([
    'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function',
    'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
    'continue', 'try', 'catch', 'finally', 'throw', 'new', 'class', 'extends',
    'super', 'this', 'async', 'await', 'true', 'false', 'null', 'undefined',
    'of', 'in', 'typeof', 'instanceof'
  ]);

  const psKeywords = new Set([
    'Get-ChildItem', 'Get-Content', 'Set-Location', 'Set-ExecutionPolicy',
    'New-Item', 'Remove-Item', 'Start-Process', 'Write-Host', 'Write-Output',
    'npm', 'npx', 'node', 'python', 'pip', 'if', 'else', 'elseif', 'foreach',
    'for', 'while', 'function', 'return', 'param', 'try', 'catch', 'finally',
    'cd', 'dir', 'ls', 'echo', 'cat', 'Install-Package'
  ]);

  const keywords =
    lang === 'python'
      ? pythonKeywords
      : lang === 'powershell' || lang === 'pwsh' || lang === 'bash'
      ? psKeywords
      : jsKeywords;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: line.slice(lastIndex, match.index),
        className: 'text-slate-300',
      });
    }

    const val = match[0];

    if (val.startsWith('#') || val.startsWith('//')) {
      tokens.push({ text: val, className: 'text-emerald-400/80 italic' });
    } else if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('`') && val.endsWith('`'))
    ) {
      tokens.push({ text: val, className: 'text-amber-300' });
    } else if (/^\d+(\.\d+)?$/.test(val)) {
      tokens.push({ text: val, className: 'text-orange-400' });
    } else if (keywords.has(val)) {
      tokens.push({ text: val, className: 'text-purple-400 font-semibold' });
    } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(val)) {
      tokens.push({ text: val, className: 'text-cyan-300' });
    } else if (
      ['console', 'process', 'document', 'window', 'Math', 'JSON', 'np', 'pd', 'plt'].includes(val)
    ) {
      tokens.push({ text: val, className: 'text-cyan-400 font-semibold' });
    } else {
      tokens.push({ text: val, className: 'text-slate-200' });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({
      text: line.slice(lastIndex),
      className: 'text-slate-300',
    });
  }

  return tokens.length > 0 ? tokens : [{ text: ' ', className: '' }];
}
