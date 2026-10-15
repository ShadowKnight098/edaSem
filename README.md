# DataLab Live: From Web Scraping to Machine Learning
> **An Interactive Live Seminar Curriculum & Presentation Platform**  
> Designed for college lectures, technical workshops, and live coding demonstrations on **Windows PowerShell**.

---

## 🌟 Seminar Overview
**DataLab Live** is a production-grade educational web application built with **React 19**, **Vite**, and **Tailwind CSS v4** (`@tailwindcss/vite`). 

The presenter projects the site onto a 1080p screen in the seminar hall, explains each concept with the audience, copies code blocks directly from the web interface, pastes them into VS Code / PowerShell, and executes each script live.

### Target Sandbox
- **Primary Live Target**: [https://books.toscrape.com/](https://books.toscrape.com/) (An authorized sandbox designed for scraping education).
- **Secondary Practice Target**: [https://quotes.toscrape.com/](https://quotes.toscrape.com/) (Optional follow-up exercise for students).

---

## 🚀 Quickstart: Running the Web Application

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher (with `pip`)
- **Windows**: PowerShell 5.1+ or PowerShell 7+

### 1. Launch the Live Seminar Web App
Run the following commands in **Windows PowerShell**:

```powershell
# Navigate into the project folder
cd d:\eda-task

# Install React & Tailwind v4 dependencies
npm install

# Start the Vite development server
npm run dev
```

Open your browser to:  
👉 **`http://localhost:5173/`**

---

## 🖥️ Presentation Mode & Hotkeys

| Key / Action | Functionality |
| :--- | :--- |
| **`P`** | **Toggle Presentation Mode**: Hides the sidebar, expands typography to high-contrast 1080p projector sizing, and displays **one lesson section at a time**. |
| **`→` (Right Arrow)** | Advance to the next section step (or next lesson if at step 9). |
| **`←` (Left Arrow)** | Return to the previous section step. |
| **`Esc`** or **`P`** | Exit presentation mode back to standard courseware layout. |
| **Copy Code Button** | Uses `navigator.clipboard.writeText` with an automatic hidden `textarea` fallback for non-secure contexts, giving instant visual `"Copied!"` confirmation. |

---

## 📚 Curriculum Structure (Lessons 1 - 8)

Every lesson follows this **strict 9-part pedagogical sequence**:
1. **What we are learning**
2. **Why it matters**
3. **Small conceptual example**
4. **Install requirements (PowerShell)**
5. **Complete runnable code**
6. **Expected output / chart**
7. **Line-by-line explanation**
8. **Common errors and fixes**
9. **Audience questions**

---

## 💻 Live PowerShell Execution Guide

Each lesson script is complete, self-contained, and top-to-bottom runnable:

### Lesson 1: Web Scraping Concepts & Playwright Sandbox
- **File**: `lesson1_offline.js`
- **Objective**: Launch headless Chromium, inject virtual DOM via `page.setContent()`, and query CSS selectors without network latency.
```powershell
# Install Playwright and Chromium browser engine
npm install playwright
npx playwright install chromium

# Run Lesson 1 demo
node lesson1_offline.js
```

### Lesson 2: Full Dataset Extraction & pandas Verification
- **Files**: `scrape_books.js` & `verify_dataset.py`
- **Objective**: Crawl all 50 catalog pages of `books.toscrape.com`, handle `li.next a` pagination, 3-attempt exponential retries, polite 150ms delay, and export `books_dataset.csv` with UTF-8 BOM (`\uFEFF`).
```powershell
# Run the full live crawler (scrapes 1,000 books across 50 pages)
node scrape_books.js

# Verify the resulting CSV with pandas
pip install pandas
python verify_dataset.py
```

### Lesson 3: Exploratory Data Analysis (EDA)
- **File**: `eda_analysis.py`
- **Objective**: Audit missingness (0.0%), compute parametric (mean £35.07) and non-parametric (median £35.98, IQR £25.35) stats, and save `eda_charts.png`.
```powershell
pip install pandas numpy matplotlib
python eda_analysis.py
```

### Lesson 4: Outlier Detection (Tukey's IQR Fences)
- **File**: `detect_outliers.py`
- **Objective**: Calculate $Q_1$, $Q_3$, $\text{IQR}$, Lower Fence ($-£15.92$), Upper Fence ($£85.48$). Explain why uniform distributions yield exactly **0 outliers**. Archive flagged rows non-destructively to `outliers_flagged.csv` and export `outlier_boxplot.png`.
```powershell
python detect_outliers.py
```

### Lesson 5: Controlled ML Experiment (Linear Regression Sensitivity)
- **File**: `outlier_experiment.py`
- **Objective**: Controlled benchmark on synthetic data with known ground truth ($y = 3x + 5 + \text{noise}$). Injects 1 extreme leverage outlier only into Model B's training set while keeping the test set clean. Fits Model A (Clean), Model B (Contaminated), and Model C (IQR Residual Cleaned). Quantifies squared-error penalty ($+77\%$ RMSE spike) and exports `model_comparison.png`.
```powershell
pip install scikit-learn
python outlier_experiment.py
```

### Lesson 6: Automated EDA Report Generation
- **File**: `generate_eda_report.py`
- **Objective**: Headless automation generating `eda_report/report.md` with markdown summary tables and 3 high-resolution chart PNGs.
```powershell
python generate_eda_report.py
```

### Lesson 7: Complete End-to-End Pipeline
- **Files**: `run_full_pipeline.ps1` & Interactive React/SVG Flowchart
- **Objective**: Master sequential execution linking Scraping $\to$ CSV $\to$ pandas $\to$ EDA $\to$ Outliers $\to$ ML Benchmark $\to$ Report.
```powershell
.\run_full_pipeline.ps1
```

### Lesson 8: Final Seminar Recap & Artifact Audit
- **File**: `audit_pipeline.py`
- **Objective**: Synthesize the 5 Golden Rules of Data Engineering and audit all 9 generated pipeline deliverables.
```powershell
python audit_pipeline.py
```

---

## 🔍 Verification Checklist

Before presenting in front of an audience, verify your local environment:

- [x] **Vite Dev Server**: Live on `http://localhost:5173/`
- [x] **Production Build**: Verified with `npm run build` (bundled in < 1s)
- [x] **Node.js & Playwright**: Chromium downloaded and verified with `lesson1_offline.js`
- [x] **Python Environment**: `pandas`, `numpy`, `matplotlib`, and `scikit-learn` installed
- [x] **Live Scraper**: Successfully extracted 1,000 books into `books_dataset.csv`
- [x] **Windows PowerShell Console Safety**: Configured `sys.stdout.reconfigure(encoding='utf-8')` to prevent `cp1252` charmap errors with `£` symbols
- [x] **Presentation Mode**: Verified hotkey `P`, arrow-key step transitions, and 1080p projector layout
- [x] **Visual Artifacts**:
  - `eda_charts.png` (Histogram & Bar Chart)
  - `outlier_boxplot.png` (Boxplot & Scatter Plot)
  - `model_comparison.png` (3-Model Regression Benchmark)
  - `eda_report/report.md` (Automated Markdown Audit)
- [x] **Deliverables Audit**: `python audit_pipeline.py` passes with all 9 artifacts present.

---

## 📦 Creating a Backup Archive
To package this completed project into a zip file on Windows PowerShell:

```powershell
Compress-Archive -Path books_dataset.csv, *.py, *.js, *.ps1, eda_report, *.png, src, public, index.html, package.json, vite.config.js, README.md -DestinationPath DataLab_Live_Completed.zip -Force
```
