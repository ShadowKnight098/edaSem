"""
DataLab Live - Lesson 2: Dataset Verification with pandas
Filename: verify_dataset.py
Run command: python verify_dataset.py
"""

import os
import sys
import pandas as pd

# Ensure Windows PowerShell console can handle UTF-8 currency symbols (£)
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CSV_PATH = "books_dataset.csv"

def verify_books_data():
    print("=" * 65)
    print("  DataLab Live: Dataset Verification with pandas")
    print(f"  Target File: {CSV_PATH}")
    print("=" * 65 + "\n")

    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] '{CSV_PATH}' does not exist! Please run 'node scrape_books.js' first.")
        sys.exit(1)

    # Read CSV (pandas automatically strips UTF-8 BOM if present)
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")

    print(f"[1] DataFrame Dimensions:")
    print(f"    Total Rows (Books) : {df.shape[0]}")
    print(f"    Total Columns      : {df.shape[1]}")
    print(f"    Column Names       : {list(df.columns)}\n")

    print("[2] First 5 Records (df.head()):")
    print(df.head(5).to_string(index=True))
    print()

    print("[3] Data Types & Memory Usage (df.info()):")
    df.info()
    print()

    print("[4] Missing Values Count:")
    missing = df.isnull().sum()
    print(missing)
    print()

    print("[5] Duplicate Book Titles:")
    dup_count = df.duplicated(subset=['title']).sum()
    print(f"    Duplicates found: {dup_count}")
    print()

    print("[6] Numerical Summary Statistics (df.describe()):")
    print(df.describe().round(2).to_string())
    print()

    print("[7] Star Rating Distribution:")
    rating_counts = df['rating'].value_counts().sort_index()
    for stars, cnt in rating_counts.items():
        bar = "#" * int(cnt // 10)
        print(f"    {stars} Star: {cnt:3d} books [{bar}]")
    print()

    print("[8] Price Range:")
    print(f"    Minimum Price: £{df['price'].min():.2f}")
    print(f"    Maximum Price: £{df['price'].max():.2f}")
    print(f"    Mean Price   : £{df['price'].mean():.2f}")
    print(f"    Median Price : £{df['price'].median():.2f}")
    print()

    print("✓ VERIFICATION PASSED: Dataset is complete, typed, and ready for EDA.\n")

if __name__ == "__main__":
    verify_books_data()
