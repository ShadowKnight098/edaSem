import React from 'react';
import { Menu, MonitorPlay, Terminal, ChevronRight } from 'lucide-react';

export default function Header({
  currentLesson,
  onToggleSidebar,
  onTogglePresentation,
  totalLessons,
}) {
  return (
    <header className="sticky top-0 z-20 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Lesson Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 truncate">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="w-3 h-3" />
              Lesson {currentLesson.number} of {totalLessons}
            </span>
            <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-600" />
            <h2 className="text-sm md:text-base font-semibold text-slate-100 truncate">
              {currentLesson.title}
            </h2>
          </div>
        </div>

        {/* Right: Presentation Mode Pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onTogglePresentation(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/50 transition-all border border-cyan-400/30"
          >
            <MonitorPlay className="w-4 h-4" />
            <span className="hidden sm:inline">Projector Mode</span>
            <kbd className="hidden md:inline px-1.5 py-0.2 bg-black/40 rounded text-[10px] text-cyan-200">
              P
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
