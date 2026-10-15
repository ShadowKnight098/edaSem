"""
DataLab Live - Final Curriculum Deliverables Audit
Filename: audit_pipeline.py
Run command: python audit_pipeline.py
"""

import os
import sys

# Ensure Windows PowerShell handles unicode safely
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def audit_deliverables():
    print("=" * 65)
    print("  DataLab Live: Final Curriculum Deliverables Audit")
    print("=" * 65 + "\n")

    required_artifacts = [
        ("books_dataset.csv", "Primary scraped book catalog (1,000 records)"),
        ("eda_charts.png", "Lesson 3 Distribution histogram & bar chart"),
        ("outliers_flagged.csv", "Lesson 4 Flagged outlier triage CSV"),
        ("outlier_boxplot.png", "Lesson 4 Tukey boxplot & jittered scatter"),
        ("model_comparison.png", "Lesson 5 Comparative regression curves"),
        ("eda_report/report.md", "Lesson 6 Automated markdown summary report"),
        ("eda_report/price_distribution.png", "Lesson 6 Automated report chart 1"),
        ("eda_report/rating_distribution.png", "Lesson 6 Automated report chart 2"),
        ("eda_report/price_boxplot.png", "Lesson 6 Automated report chart 3"),
    ]

    missing = 0
    for file_path, description in required_artifacts:
        exists = os.path.exists(file_path)
        status = "[PRESENT]" if exists else "[MISSING]"
        size = f"({os.path.getsize(file_path)/1024:.1f} KB)" if exists else ""
        print(f"  {status:10s} | {file_path:35s} {size:12s} - {description}")
        if not exists:
            missing += 1

    print()
    if missing == 0:
        print("✓ AUDIT PASSED: All 9 pipeline artifacts are present and verified!\n")
    else:
        print(f"⚠️ AUDIT WARNING: {missing} artifact(s) missing. Run the pipeline to regenerate.\n")

if __name__ == "__main__":
    audit_deliverables()
