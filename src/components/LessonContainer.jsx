import React from 'react';
import {
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Code2,
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import CodeBlock from './CodeBlock';
import OutputBlock from './OutputBlock';
import WorkflowDiagram from './WorkflowDiagram';

export default function LessonContainer({
  lesson,
  onPrevLesson,
  onNextLesson,
  isFirstLesson,
  isLastLesson,
}) {
  if (!lesson) return null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 sm:px-8 space-y-12">
      {/* Lesson Header */}
      <div className="border-b border-slate-800 pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            LESSON {lesson.number}
          </span>
          <span className="text-slate-500 text-xs font-mono">•</span>
          <span className="text-slate-400 text-xs font-mono">
            {lesson.category || 'Data Science Pipeline'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          {lesson.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          {lesson.subtitle}
        </p>

        {lesson.targetUrl && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-mono">
            <span>Target Sandbox URL:</span>
            <a
              href={lesson.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              {lesson.targetUrl}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* 1. What We Are Learning */}
      <section id="learning" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
            1
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            What We Are Learning
          </h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-base">
          {lesson.whatWeAreLearning?.intro}
        </p>
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {lesson.whatWeAreLearning?.bulletPoints?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Why It Matters */}
      <section id="matters" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center font-bold">
            2
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Why It Matters
          </h2>
        </div>
        <p className="text-slate-300 leading-relaxed text-base">
          {lesson.whyItMatters?.description}
        </p>
        {lesson.whyItMatters?.takeaways && (
          <div className="p-4 rounded-xl bg-slate-900 border-l-4 border-amber-500 text-sm text-slate-300 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block">
              Core Seminar Insight
            </span>
            <p className="text-slate-200 font-medium">
              {lesson.whyItMatters.takeaways}
            </p>
          </div>
        )}
      </section>

      {/* 3. Small Conceptual Example */}
      <section id="concept" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs flex items-center justify-center font-bold">
            3
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Small Conceptual Example
          </h2>
        </div>
        <p className="text-slate-300 text-base">
          {lesson.conceptualExample?.explanation}
        </p>
        {lesson.conceptualExample?.code && (
          <CodeBlock
            code={lesson.conceptualExample.code}
            language={lesson.conceptualExample.language || 'javascript'}
            filename={lesson.conceptualExample.filename}
          />
        )}
      </section>

      {/* 4. Install Requirements (PowerShell) */}
      <section id="install" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
            4
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Install Requirements (PowerShell)
          </h2>
        </div>
        <p className="text-slate-300 text-sm">
          {lesson.installRequirements?.notes ||
            'Run these commands in Windows PowerShell before executing the lesson script:'}
        </p>
        <CodeBlock
          code={lesson.installRequirements?.commands}
          language="powershell"
          filename="Windows PowerShell"
          runCommand={lesson.installRequirements?.commands}
        />
        {lesson.installRequirements?.prerequisites && (
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            Prerequisites: {lesson.installRequirements.prerequisites}
          </div>
        )}
      </section>

      {/* 5. Complete Runnable Code */}
      <section id="code" className="scroll-mt-24 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono text-xs flex items-center justify-center font-bold">
              5
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Complete Runnable Code
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            All imports included
          </span>
        </div>
        <p className="text-slate-300 text-sm">
          {lesson.runnableCode?.description}
        </p>

        {/* If multiple code blocks provided (e.g. Lesson 2) */}
        {lesson.runnableCode?.codeBlocks ? (
          <div className="space-y-6">
            {lesson.runnableCode.codeBlocks.map((blk, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                  <span className="font-semibold text-slate-200">{blk.title}</span>
                  {blk.runCommand && (
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-cyan-400">
                      Run: {blk.runCommand}
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
          lesson.runnableCode?.code && (
            <CodeBlock
              code={lesson.runnableCode.code}
              language={lesson.runnableCode.language}
              filename={lesson.runnableCode.filename}
              runCommand={lesson.runnableCode.runCommand}
            />
          )
        )}

        {/* Optional Workflow Diagram (Lesson 7) */}
        {lesson.workflowDiagram && (
          <div className="pt-4">
            <WorkflowDiagram />
          </div>
        )}
      </section>

      {/* 6. Expected Output / Chart */}
      <section id="output" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-mono text-xs flex items-center justify-center font-bold">
            6
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Expected Output / Chart
          </h2>
        </div>
        <p className="text-slate-300 text-sm">
          {lesson.expectedOutput?.description}
        </p>
        <OutputBlock
          output={lesson.expectedOutput?.output}
          isReal={lesson.expectedOutput?.isReal}
          chartImg={lesson.expectedOutput?.chartImg}
          chartAlt={lesson.expectedOutput?.chartAlt}
        />
      </section>

      {/* 7. Line-by-Line Explanation */}
      <section id="explanation" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
            7
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Line-by-Line Explanation
          </h2>
        </div>
        <p className="text-slate-300 text-sm">
          {lesson.explanation?.summary}
        </p>
        <div className="space-y-3">
          {lesson.explanation?.points?.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5 text-sm"
            >
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-xs text-cyan-300 border border-slate-700 flex-shrink-0 mt-0.5">
                {item.line}
              </span>
              <div className="text-slate-300">
                <strong className="text-white">{item.title}: </strong>
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Common Errors and Fixes */}
      <section id="errors" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-mono text-xs flex items-center justify-center font-bold">
            8
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Common Errors & Fixes
          </h2>
        </div>
        <p className="text-slate-400 text-xs">
          Common pitfalls when running this stage on Windows PowerShell:
        </p>
        <div className="grid gap-3">
          {lesson.commonErrors?.errors?.map((err, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
            >
              <div className="text-xs font-mono text-rose-400 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Issue: {err.issue}</span>
              </div>
              <div className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800">
                {err.errorText}
              </div>
              <div className="text-xs text-emerald-300 pt-1">
                <span className="font-semibold text-emerald-400">Fix:</span>{' '}
                {err.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Audience Questions */}
      <section id="questions" className="scroll-mt-24 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
            9
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Audience Questions
          </h2>
        </div>
        <div className="space-y-3">
          {lesson.audienceQuestions?.questions?.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2"
            >
              <div className="text-sm font-semibold text-slate-200 flex items-start gap-2.5">
                <span className="text-cyan-400 font-mono">Q{idx + 1}:</span>
                <span>{q.question}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 pl-6 border-l-2 border-emerald-500/40">
                <strong className="text-emerald-400 font-mono">Answer:</strong>{' '}
                {q.answer}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="pt-8 border-t border-slate-800 flex items-center justify-between gap-4">
        <button
          onClick={onPrevLesson}
          disabled={isFirstLesson}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isFirstLesson
              ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Lesson</span>
        </button>

        <button
          onClick={onNextLesson}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/60 transition-all border border-cyan-400/30"
        >
          <span>{isLastLesson ? 'Finish & Recap' : 'Next Lesson'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}
