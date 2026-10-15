import React, { useState } from 'react';
import {
  Globe,
  Code,
  FileSpreadsheet,
  BarChart3,
  Filter,
  Brain,
  FileCheck2,
  Terminal,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default function WorkflowDiagram() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Target Sandbox',
      subtitle: 'books.toscrape.com',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      file: 'Live HTTP Server (50 Pages)',
      command: 'PowerShell / DevTools DOM Inspection',
      description: 'Web server hosting 1,000 catalog books across 50 HTML pages with next pagination links.',
    },
    {
      id: 2,
      title: 'Playwright Scraper',
      subtitle: 'Node.js ESM Engine',
      icon: Code,
      color: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      file: 'scrape_books.js',
      command: 'node scrape_books.js',
      description: 'Automated headless Chromium crawler traversing pages with 3-attempt retries and 600ms polite throttle.',
    },
    {
      id: 3,
      title: 'Clean Raw CSV',
      subtitle: 'RFC 4180 Quoted Dataset',
      icon: FileSpreadsheet,
      color: 'from-emerald-500 to-teal-500',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      file: 'books_dataset.csv',
      command: 'python verify_dataset.py',
      description: 'Structured 1,000-row tabular dataset saved with UTF-8 BOM, numeric prices, and mapped star ratings.',
    },
    {
      id: 4,
      title: 'Exploratory Analysis',
      subtitle: 'pandas & Matplotlib',
      icon: BarChart3,
      color: 'from-purple-500 to-indigo-500',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      file: 'eda_analysis.py',
      command: 'python eda_analysis.py',
      description: 'Summary statistics, null audit, price distribution histogram, and star rating frequency bar chart.',
    },
    {
      id: 5,
      title: 'Outlier Analysis',
      subtitle: 'Tukey IQR Fences',
      icon: Filter,
      color: 'from-rose-500 to-pink-500',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      file: 'detect_outliers.py',
      command: 'python detect_outliers.py',
      description: 'Statistical IQR computation, boxplot visualization, and non-destructive triage saving flagged rows to outliers_flagged.csv.',
    },
    {
      id: 6,
      title: 'ML Experiment',
      subtitle: 'Scikit-Learn Regression',
      icon: Brain,
      color: 'from-cyan-500 to-blue-500',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      file: 'outlier_experiment.py',
      command: 'python outlier_experiment.py',
      description: 'Controlled benchmark comparing Model A (Clean), Model B (Contaminated), and Model C (IQR-treated) on identical test sets.',
    },
    {
      id: 7,
      title: 'Automated Report',
      subtitle: 'Markdown & PNG Bundle',
      icon: FileCheck2,
      color: 'from-emerald-400 to-green-500',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      file: 'eda_report/report.md',
      command: 'python generate_eda_report.py',
      description: 'Headless automation generating a markdown executive summary and standalone publication-ready figures.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive SVG Flowchart Container */}
      <div className="p-6 rounded-2xl bg-[#090e17] border border-slate-800 shadow-xl overflow-x-auto">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 font-semibold flex items-center justify-between">
          <span>Interactive End-to-End Pipeline Architecture</span>
          <span className="text-slate-500">Click any stage to view artifact & run command</span>
        </div>

        {/* SVG Flow diagram */}
        <div className="min-w-[760px] py-4">
          <div className="grid grid-cols-7 gap-2 items-center relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;

              return (
                <div key={step.id} className="flex flex-col items-center relative">
                  {/* Step Card */}
                  <button
                    onClick={() => setActiveStep(idx)}
                    className={`w-full p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[140px] relative ${
                      isSelected
                        ? 'bg-slate-850 border-cyan-400 ring-2 ring-cyan-400/30 scale-105 shadow-lg shadow-cyan-950/60'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    {/* Step number badge */}
                    <span className="text-[10px] font-mono font-bold text-slate-400 mb-1">
                      STEP {step.id}
                    </span>

                    {/* Step Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} p-2 flex items-center justify-center text-slate-950 shadow-md mb-2`}
                    >
                      <Icon className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                    </div>

                    {/* Step Title */}
                    <div className="text-xs font-bold text-slate-100 line-clamp-1">
                      {step.title}
                    </div>

                    {/* File Produced Pill */}
                    <div className="mt-2 text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800 truncate w-full">
                      {step.file}
                    </div>
                  </button>

                  {/* Flow arrow to next step (except last) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Stage Detail Card */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded-md border ${steps[activeStep].badgeColor}`}
            >
              Stage {steps[activeStep].id}: {steps[activeStep].title}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Output: {steps[activeStep].file}
            </span>
          </div>
          <p className="text-sm text-slate-300">
            {steps[activeStep].description}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 flex-shrink-0 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">PowerShell:</span>
          <span className="font-semibold text-white">{steps[activeStep].command}</span>
        </div>
      </div>

      {/* Master Sequential Run-Order Table */}
      <div className="p-5 rounded-xl bg-[#090d16] border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2 font-mono">
          <Terminal className="w-4 h-4 text-emerald-400" />
          COMPLETE SEMINAR RUN-ORDER COMMAND LIST (POWERSHELL)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left bg-slate-900/60">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">PowerShell Command</th>
                <th className="py-2.5 px-3">Artifact Generated</th>
                <th className="py-2.5 px-3">Core Objective</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">01</td>
                <td className="py-2 px-3 text-white font-semibold">node lesson1_offline.js</td>
                <td className="py-2 px-3 text-slate-400">Terminal Table</td>
                <td className="py-2 px-3 text-slate-400">Verify Chromium DOM selectors offline</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">02</td>
                <td className="py-2 px-3 text-white font-semibold">node scrape_books.js</td>
                <td className="py-2 px-3 text-emerald-400">books_dataset.csv</td>
                <td className="py-2 px-3 text-slate-400">Crawl 50 pages & save 1,000 books with UTF-8 BOM</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">03</td>
                <td className="py-2 px-3 text-white font-semibold">python verify_dataset.py</td>
                <td className="py-2 px-3 text-slate-400">Terminal Inspection</td>
                <td className="py-2 px-3 text-slate-400">Validate dimensions (1000, 4) & types with pandas</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">04</td>
                <td className="py-2 px-3 text-white font-semibold">python eda_analysis.py</td>
                <td className="py-2 px-3 text-emerald-400">eda_charts.png</td>
                <td className="py-2 px-3 text-slate-400">Compute statistics & export histogram + bar chart</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">05</td>
                <td className="py-2 px-3 text-white font-semibold">python detect_outliers.py</td>
                <td className="py-2 px-3 text-emerald-400">outliers_flagged.csv</td>
                <td className="py-2 px-3 text-slate-400">Tukey IQR fences & safe triage without silent deletion</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">06</td>
                <td className="py-2 px-3 text-white font-semibold">python outlier_experiment.py</td>
                <td className="py-2 px-3 text-emerald-400">model_comparison.png</td>
                <td className="py-2 px-3 text-slate-400">Train Models A, B, C & quantify squared-error distortion</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cyan-400 font-bold">07</td>
                <td className="py-2 px-3 text-white font-semibold">python generate_eda_report.py</td>
                <td className="py-2 px-3 text-emerald-400">eda_report/report.md</td>
                <td className="py-2 px-3 text-slate-400">Compile automated markdown report + image assets</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
