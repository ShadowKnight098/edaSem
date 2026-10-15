# DataLab Live: Master Sequential Execution Pipeline
# Filename: run_full_pipeline.ps1
# Run: .\run_full_pipeline.ps1

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DataLab Live: End-to-End Pipeline Execution (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
$Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

# Step 1: Verify selectors offline
Write-Host "`n[1/7] Running Lesson 1 Offline Selector Verification..." -ForegroundColor Yellow
node lesson1_offline.js

# Step 2: Scrape live books dataset
Write-Host "`n[2/7] Running Lesson 2 Playwright Scraper (books.toscrape.com)..." -ForegroundColor Yellow
node scrape_books.js

# Step 3: Verify dataset with pandas
Write-Host "`n[3/7] Running Lesson 2 Dataset Verification..." -ForegroundColor Yellow
python verify_dataset.py

# Step 4: Run Exploratory Data Analysis
Write-Host "`n[4/7] Running Lesson 3 EDA & Visualizations..." -ForegroundColor Yellow
python eda_analysis.py

# Step 5: Detect Outliers & Non-Destructive Triage
Write-Host "`n[5/7] Running Lesson 4 Outlier Analysis..." -ForegroundColor Yellow
python detect_outliers.py

# Step 6: Run ML Sensitivity Benchmark
Write-Host "`n[6/7] Running Lesson 5 Controlled ML Experiment..." -ForegroundColor Yellow
python outlier_experiment.py

# Step 7: Automated Report Generation
Write-Host "`n[7/7] Generating Automated EDA Report..." -ForegroundColor Yellow
python generate_eda_report.py

# Final Audit
Write-Host "`n[Audit] Running Pipeline Artifact Audit..." -ForegroundColor Yellow
python audit_pipeline.py

$Stopwatch.Stop()
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "  ✓ PIPELINE COMPLETED SUCCESSFULLY IN $($Stopwatch.Elapsed.TotalSeconds.ToString('F1'))s!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
