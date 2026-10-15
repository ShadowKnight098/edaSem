import React, { useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Maximize2,
  Terminal,
} from 'lucide-react';
import CodeBlock from './CodeBlock';
import OutputBlock from './OutputBlock';
import WorkflowDiagram from './WorkflowDiagram';

export default function PresentationView({
  lesson,
  activeSectionIndex,
  setActiveSectionIndex,
  onPrevLesson,
  onNextLesson,
  onClose,
  totalLessons,
}) {
  const sections = [
    { id: 'learning', label: '1. What We Are Learning', key: 'whatWeAreLearning' },
    { id: 'matters', label: '2. Why It Matters', key: 'whyItMatters' },
    { id: 'concept', label: '3. Small Conceptual Example', key: 'conceptualExample' },
    { id: 'install', label: '4. Install Requirements (PowerShell)', key: 'installRequirements' },
    { id: 'code', label: '5. Complete Runnable Code', key: 'runnableCode' },
    { id: 'output', label: '6. Expected Output / Chart', key: 'expectedOutput' },
    { id: 'explanation', label: '7. Line-by-Line Explanation', key: 'explanation' },
    { id: 'errors', label: '8. Common Errors & Fixes', key: 'commonErrors' },
    { id: 'questions', label: '9. Audience Questions', key: 'audienceQuestions' },
  ];

  const currentSection = sections[activeSectionIndex] || sections[0];

  // Arrow key navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (activeSectionIndex < sections.length - 1) {
          setActiveSectionIndex(activeSectionIndex + 1);
        } else {
          onNextLesson();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (activeSectionIndex > 0) {
          setActiveSectionIndex(activeSectionIndex - 1);
        } else {
          onPrevLesson();
        }
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionIndex, sections.length, onNextLesson, onPrevLesson, onClose, setActiveSectionIndex]);

  // Helper to render current section content in presentation mode
  const renderSectionContent = () => {
    const secKey = currentSection.key;
    const content = lesson[secKey];

    if (!content) {
      return (
        <div className="p-8 text-slate-400 font-mono text-center">
          Content for this section will load in the subsequent phase.
        </div>
      );
    }

    switch (secKey) {
      case 'whatWeAreLearning':
        return (
          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light">
              {content.intro}
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              {content.bulletPoints?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 shadow-md"
                >
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-base md:text-lg text-slate-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'whyItMatters':
        return (
          <div className="space-y-6">
            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light">
              {content.description}
            </p>
            {content.takeaways && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/20 border border-cyan-800/40 space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Key Production Principle
                </div>
                <div className="text-lg md:text-xl text-cyan-100 font-medium">
                  {content.takeaways}
                </div>
              </div>
            )}
          </div>
        );

      case 'conceptualExample':
        return (
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-slate-300">
              {content.explanation}
            </p>
            {content.code && (
              <CodeBlock
                code={content.code}
                language={content.language || 'javascript'}
                filename={content.filename || 'snippet.js'}
              />
            )}
          </div>
        );

      case 'installRequirements':
        return (
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-slate-300">
              {content.notes || 'Run the following command inside Windows PowerShell to prepare your environment:'}
            </p>
            <CodeBlock
              code={content.commands}
              language="powershell"
              filename="PowerShell Prompt"
              runCommand={content.commands}
            />
            {content.prerequisites && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-sm md:text-base font-mono">
                Prerequisites: {content.prerequisites}
              </div>
            )}
          </div>
        );

      case 'runnableCode':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between text-base text-slate-300">
              <span>{content.description}</span>
              {content.runCommand && (
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800/60">
                  Run command: {content.runCommand}
                </span>
              )}
            </div>

            {content.codeBlocks ? (
              <div className="space-y-6">
                {content.codeBlocks.map((blk, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                      <span className="font-semibold text-slate-200">{blk.title}</span>
                      {blk.runCommand && (
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-cyan-400">
                          {blk.runCommand}
                        </span>
                      )}
                    </div>
                    <CodeBlock
                      code={blk.code}
                      language={blk.language}
                      filename={blk.filename}
                      runCommand={blk.runCommand}
                    />
                  </div>
                ))}
              </div>
            ) : (
              content.code && (
                <CodeBlock
                  code={content.code}
                  language={content.language}
                  filename={content.filename}
                  runCommand={content.runCommand}
                />
              )
            )}

            {lesson.workflowDiagram && (
              <div className="pt-4">
                <WorkflowDiagram />
              </div>
            )}
          </div>
        );

      case 'expectedOutput':
        return (
          <div className="space-y-6">
            <p className="text-lg text-slate-300">{content.description}</p>
            <OutputBlock
              output={content.output}
              isReal={content.isReal}
              chartImg={content.chartImg}
              chartAlt={content.chartAlt || 'Expected Chart'}
            />
          </div>
        );

      case 'explanation':
        return (
          <div className="space-y-4">
            <p className="text-lg text-slate-300 mb-4">{content.summary}</p>
            <div className="space-y-3">
              {content.points?.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 flex items-start gap-4"
                >
                  <span className="px-2 py-1 rounded bg-slate-800 font-mono text-xs text-cyan-300 border border-slate-700 flex-shrink-0">
                    {pt.line}
                  </span>
                  <div className="text-base text-slate-200">
                    <strong className="text-cyan-300">{pt.title}: </strong>
                    {pt.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'commonErrors':
        return (
          <div className="space-y-4">
            <p className="text-lg text-slate-300 mb-4">
              Real troubleshooting issues encountered during Windows live execution:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {content.errors?.map((err, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/90 border border-rose-900/40 space-y-3"
                >
                  <div className="text-sm font-mono text-rose-400 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    {err.issue}
                  </div>
                  <div className="text-sm text-slate-300 bg-black/40 p-3 rounded-lg border border-slate-800 font-mono">
                    {err.errorText}
                  </div>
                  <div className="text-sm text-emerald-300 pt-1">
                    <strong>Fix:</strong> {err.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'audienceQuestions':
        return (
          <div className="space-y-5">
            <p className="text-lg text-slate-300 mb-2">
              Interactive check-for-understanding questions for the seminar hall:
            </p>
            <div className="space-y-4">
              {content.questions?.map((q, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2"
                >
                  <div className="text-lg text-slate-100 font-medium flex items-start gap-3">
                    <span className="text-cyan-400 font-mono font-bold">
                      Q{idx + 1}:
                    </span>
                    <span>{q.question}</span>
                  </div>
                  <div className="pl-8 text-sm md:text-base text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                    <strong className="text-emerald-400 font-mono">
                      Answer / Discussion:
                    </strong>{' '}
                    {q.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b12] text-slate-100 flex flex-col overflow-hidden select-text">
      {/* Top Presentation Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>PROJECTOR VIEW (1080p)</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <h1 className="text-base md:text-lg font-bold text-slate-100 truncate">
            Lesson {lesson.number}: {lesson.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-400">
            Step {activeSectionIndex + 1} of {sections.length}
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors border border-slate-700"
            title="Exit Presentation Mode (Esc or P)"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>Exit [P]</span>
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-slate-800 h-1 flex">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            onClick={() => setActiveSectionIndex(idx)}
            className={`h-full flex-1 cursor-pointer transition-colors ${
              idx === activeSectionIndex
                ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                : idx < activeSectionIndex
                ? 'bg-emerald-500/60'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title={sec.label}
          />
        ))}
      </div>

      {/* Main Slide Presentation Body */}
      <div className="flex-1 overflow-y-auto px-6 py-8 md:px-16 md:py-12 max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 text-cyan-400 font-mono text-sm font-semibold mb-3 border border-slate-700">
            <span>SECTION {activeSectionIndex + 1} OF 9</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {currentSection.label}
          </h2>
        </div>

        <div className="text-slate-200 min-h-[400px]">
          {renderSectionContent()}
        </div>
      </div>

      {/* Bottom Floating Presenter Control Dock */}
      <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeSectionIndex > 0) {
                setActiveSectionIndex(activeSectionIndex - 1);
              } else {
                onPrevLesson();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev [←]</span>
          </button>

          <button
            onClick={() => {
              if (activeSectionIndex < sections.length - 1) {
                setActiveSectionIndex(activeSectionIndex + 1);
              } else {
                onNextLesson();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors shadow-lg shadow-cyan-900/40"
          >
            <span>Next [→]</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Section Quick Jump Buttons */}
        <div className="hidden md:flex items-center gap-1.5">
          {sections.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSectionIndex(idx)}
              className={`w-8 h-8 rounded-lg font-mono text-xs flex items-center justify-center transition-all ${
                activeSectionIndex === idx
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
              title={s.label}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-500">
          Use Keyboard <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">→</kbd> to present
        </div>
      </div>
    </div>
  );
}
