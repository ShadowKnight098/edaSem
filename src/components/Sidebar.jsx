import React from 'react';
import {
  BookOpen,
  CheckCircle,
  Circle,
  Layers,
  ChevronRight,
  MonitorPlay,
  Terminal,
  Activity,
  Sliders,
  FileText,
  GitBranch,
  Award,
} from 'lucide-react';

export default function Sidebar({
  lessons = [],
  currentLessonId,
  onSelectLesson,
  visitedLessons = new Set(),
  activeSectionId,
  onSelectSection,
  isSidebarOpen,
  setIsSidebarOpen,
  isPresentationMode,
  setIsPresentationMode,
}) {
  const currentLesson = lessons.find((l) => l.id === currentLessonId) || lessons[0];

  const getLessonIcon = (id) => {
    switch (id) {
      case 1:
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 2:
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 3:
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 4:
        return <Sliders className="w-4 h-4 text-purple-400" />;
      case 5:
        return <Activity className="w-4 h-4 text-blue-400" />;
      case 6:
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 7:
        return <GitBranch className="w-4 h-4 text-teal-400" />;
      case 8:
      case 9:
        return <Award className="w-4 h-4 text-yellow-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  const sectionTitles = [
    { num: 1, id: 'learning', label: '1. What we are learning' },
    { num: 2, id: 'matters', label: '2. Why it matters' },
    { num: 3, id: 'concept', label: '3. Small conceptual example' },
    { num: 4, id: 'install', label: '4. Install requirements (PowerShell)' },
    { num: 5, id: 'code', label: '5. Complete runnable code' },
    { num: 6, id: 'output', label: '6. Expected output / chart' },
    { num: 7, id: 'explanation', label: '7. Line-by-line explanation' },
    { num: 8, id: 'errors', label: '8. Common errors and fixes' },
    { num: 9, id: 'questions', label: '9. Audience questions' },
  ];

  if (isPresentationMode) return null;

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-30 h-screen w-80 bg-[#0a0e17] border-r border-slate-800/80 flex flex-col transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-base shadow-sm">
            DL
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">
              DataLab Live
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">
              Scraping to ML Seminar
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPresentationMode(true)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900 transition-colors shadow-sm"
          title="Toggle Presentation Mode (Hotkey: P)"
        >
          <MonitorPlay className="w-3.5 h-3.5" />
          <span>[P]</span>
        </button>
      </div>

      {/* Course Progress Bar */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
          <span>PROGRESS</span>
          <span className="text-cyan-400 font-semibold">
            {Math.round((visitedLessons.size / lessons.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${(visitedLessons.size / lessons.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Lessons List */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 px-2 mb-2 font-semibold">
            Curriculum Modules
          </div>
          <div className="space-y-1">
            {lessons.map((lesson) => {
              const isActive = lesson.id === currentLessonId;
              const isVisited = visitedLessons.has(lesson.id);

              return (
                <div key={lesson.id}>
                  <button
                    onClick={() => {
                      onSelectLesson(lesson.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/40 font-medium'
                        : isVisited
                        ? 'text-slate-300 hover:bg-slate-850 hover:text-white'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex-shrink-0">
                        {isVisited && !isActive ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : isActive ? (
                          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          </div>
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <span className="font-mono text-[11px] text-slate-500 mr-1.5">
                          #{lesson.number}
                        </span>
                        <span className="font-medium">{lesson.shortTitle}</span>
                      </div>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 ml-1" />
                    )}
                  </button>

                  {/* Nested Table of Contents for Current Lesson */}
                  {isActive && lesson.id <= 8 && (
                    <div className="my-1.5 ml-6 pl-2.5 border-l-2 border-cyan-500/30 space-y-0.5">
                      {sectionTitles.map((sec) => (
                        <button
                          key={sec.id}
                          onClick={() => {
                            onSelectSection(sec.id);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full text-left text-[11px] py-1 px-2 rounded font-mono truncate transition-colors ${
                            activeSectionId === sec.id
                              ? 'text-cyan-300 bg-cyan-950/60 font-semibold'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Seminar Presenter Notes Box */}
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-300 font-medium mb-1 font-mono text-[11px]">
            <span>💡 PRESENTER TIP</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Press <kbd className="px-1 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700">P</kbd> to enter projector mode with arrow-key step navigation.
          </p>
        </div>
      </div>

      {/* Target Sandbox info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] font-mono text-slate-400">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Live Target Sandbox:</span>
          <span className="text-emerald-400 font-semibold">books.toscrape.com</span>
        </div>
      </div>
    </aside>
  );
}
