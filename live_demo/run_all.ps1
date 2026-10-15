# ==============================================================================
# Live Seminar Demonstration Script
# Run: .\run_all.ps1
# ==============================================================================

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  DataLab Live: 3-Step Live Demonstration (PowerShell)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Step 1: Web Crawler
Write-Host "`n>>> [STEP 1/3] Running Web Crawler (Playwright)..." -ForegroundColor Yellow
node 1_crawler.js

# Step 2: Data Cleaning
Write-Host "`n>>> [STEP 2/3] Running Data Cleaning & Audit (pandas)..." -ForegroundColor Yellow
python 2_data_cleaning.py

# Step 3: Outlier Analysis
Write-Host "`n>>> [STEP 3/3] Running Outlier Analysis & Triage (NumPy/Matplotlib)..." -ForegroundColor Yellow
python 3_outlier_analysis.py

Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "  ✓ ALL 3 DEMO STEPS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "Generated Files:" -ForegroundColor White
Write-Host "  • books_dataset.csv       (Raw crawled dataset)" -ForegroundColor Gray
Write-Host "  • books_cleaned.csv       (Standardized & categorized)" -ForegroundColor Gray
Write-Host "  • outliers_flagged.csv    (Non-destructive triage records)" -ForegroundColor Gray
Write-Host "  • outlier_demo_chart.png  (Boxplot & distribution figure)" -ForegroundColor Gray
Write-Host ""
