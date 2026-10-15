"""
============================================================================
STEP 2: DATA CLEANING & AUDITING (Python + pandas)
============================================================================
Seminar Topic: Data Hygiene, Schema Validation, Null Audit & Feature Engineering
Input File   : books_dataset.csv
Output File  : books_cleaned.csv
Run Command  : python 2_data_cleaning.py
============================================================================
"""

import os
import sys
import pandas as pd
import numpy as np

# Ensure Windows PowerShell console displays UTF-8 (£ and emojis) correctly
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

INPUT_FILE = "books_dataset.csv"
OUTPUT_FILE = "books_cleaned.csv"

def clean_data():
    print("------------------------------------------------------------")
    print("  DataLab Live: Step 2 - Data Cleaning & Health Audit")
    print("------------------------------------------------------------\n")

    # Fallback to parent directory if running from inside live_demo folder
    file_path = INPUT_FILE
    if not os.path.exists(file_path):
        parent_path = os.path.join("..", INPUT_FILE)
        if os.path.exists(parent_path):
            file_path = parent_path
        else:
            print(f"[ERROR] '{INPUT_FILE}' not found. Please run 'node 1_crawler.js' first.")
            sys.exit(1)

    print(f"[1/5] Loading raw data from: {os.path.abspath(file_path)}...")
    df = pd.read_csv(file_path, encoding='utf-8-sig')
    print(f"      Initial shape: {df.shape[0]} rows x {df.shape[1]} columns\n")

    # 1. Missingness & Quality Audit
    print("[2/5] Auditing Missing Values & Duplicates:")
    null_counts = df.isnull().sum()
    for col in df.columns:
        print(f"      • {col:15s}: {null_counts[col]} null values")

    duplicate_titles = df.duplicated(subset=['title']).sum()
    print(f"      • Duplicate book titles: {duplicate_titles}\n")

    # 2. Type Standardization & Cleaning
    print("[3/5] Cleaning Text Fields & Enforcing Type Contracts...")
    df['title'] = df['title'].astype(str).str.strip()
    df['availability'] = df['availability'].astype(str).str.strip()
    df['price'] = pd.to_numeric(df['price'], errors='coerce')
    df['rating'] = pd.to_numeric(df['rating'], errors='coerce').fillna(0).astype(int)

    # Validate price boundaries
    invalid_prices = (df['price'] <= 0).sum()
    invalid_ratings = (~df['rating'].between(1, 5)).sum()
    print(f"      • Invalid prices (<= 0): {invalid_prices}")
    print(f"      • Invalid ratings (< 1 or > 5): {invalid_ratings}\n")

    # 3. Feature Engineering: Price Categories & In-Stock Flag
    print("[4/5] Adding Derived Analytical Features...")
    # Categorize into budget, mid-range, premium tiers
    bins = [0, 20.0, 40.0, 100.0]
    labels = ['Budget (£0-£20)', 'Mid-Range (£20-£40)', 'Premium (£40+)']
    df['price_tier'] = pd.cut(df['price'], bins=bins, labels=labels, right=False)
    df['is_in_stock'] = df['availability'].str.lower().str.contains('in stock')

    tier_counts = df['price_tier'].value_counts()
    for tier, count in tier_counts.items():
        bar = "#" * int(count // 20)
        print(f"      • {tier:22s}: {count:3d} books [{bar}]")
    print()

    # 4. Summary Statistics
    print("[5/5] Numerical Summary (Cleaned Data):")
    print(df[['price', 'rating']].describe().round(2).to_string())
    print()

    # Export Cleaned Dataset
    out_path = OUTPUT_FILE
    df.to_csv(out_path, index=False, encoding='utf-8-sig')
    print(f"✓ SUCCESS: Cleaned dataset saved to {os.path.abspath(out_path)}")
    print(f"  Final Shape: {df.shape[0]} rows x {df.shape[1]} columns\n")

if __name__ == "__main__":
    clean_data()
