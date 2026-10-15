import React from 'react';
import { Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OutputBlock({
  output = '',
  title = 'Console Output',
  isReal = false,
  chartImg = null,
  chartAlt = 'Generated chart output',
}) {
  return (
    <div className="my-4 rounded-xl border border-slate-800 bg-[#090d16] overflow-hidden shadow-xl shadow-black/40">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-medium text-slate-300">
            {title}
          </span>
        </div>

        {/* Label badge */}
        <div>
          {isReal ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verified Execution Output
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Illustrative sample output - not live execution
            </span>
          )}
        </div>
      </div>

      {/* Text Output */}
      {output && (
        <pre className="p-4 text-xs md:text-sm font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed overflow-x-auto bg-[#070a10]">
          {output}
        </pre>
      )}

      {/* Chart visualization if present */}
      {chartImg && (
        <div className="p-4 bg-slate-950/70 border-t border-slate-800/80 flex flex-col items-center">
          <img
            src={chartImg}
            alt={chartAlt}
            className="rounded-lg border border-slate-800 max-w-full max-h-[460px] object-contain shadow-lg"
          />
          <span className="text-xs font-mono text-slate-500 mt-2">
            Figure: {chartAlt}
          </span>
        </div>
      )}
    </div>
  );
}
