"""
============================================================================
STEP 3: OUTLIER DETECTION & TRIAGE (Python + NumPy + Matplotlib)
============================================================================
Seminar Topic: Tukey's IQR Fences, Non-Destructive Triage & Visual Inspection
Input File   : books_cleaned.csv
Output Files : outliers_flagged.csv & outlier_demo_chart.png
Run Command  : python 3_outlier_analysis.py
============================================================================
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Ensure Windows PowerShell console displays UTF-8 correctly
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

INPUT_FILE = "books_cleaned.csv"
OUTLIER_CSV = "outliers_flagged.csv"
CHART_FILE = "outlier_demo_chart.png"

def analyze_outliers():
    print("------------------------------------------------------------")
    print("  DataLab Live: Step 3 - Outlier Detection & Triage")
    print("------------------------------------------------------------\n")

    # Locate cleaned file
    file_path = INPUT_FILE
    if not os.path.exists(file_path):
        parent_path = os.path.join("..", INPUT_FILE)
        if os.path.exists(parent_path):
            file_path = parent_path
        else:
            # Fallback to books_dataset.csv if cleaning script was skipped
            if os.path.exists("books_dataset.csv"):
                file_path = "books_dataset.csv"
            elif os.path.exists("../books_dataset.csv"):
                file_path = "../books_dataset.csv"
            else:
                print(f"[ERROR] Cleaned dataset not found. Run 'python 2_data_cleaning.py' first.")
                sys.exit(1)

    df = pd.read_csv(file_path, encoding='utf-8-sig')
    print(f"[1/4] Loaded dataset: {len(df)} records.")

    # 1. Compute Tukey's IQR Fences
    q1 = df['price'].quantile(0.25)
    median = df['price'].median()
    q3 = df['price'].quantile(0.75)
    iqr = q3 - q1

    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr

    print("\n[2/4] Mathematical Tukey Fences Breakdown:")
    print(f"      • 25th Percentile (Q1)     : £{q1:.2f}")
    print(f"      • 50th Percentile (Median) : £{median:.2f}")
    print(f"      • 75th Percentile (Q3)     : £{q3:.2f}")
    print(f"      • Interquartile Range (IQR): £{iqr:.2f}")
    print(f"      • Lower Fence [Q1 - 1.5*IQR]: £{lower_fence:.2f}")
    print(f"      • Upper Fence [Q3 + 1.5*IQR]: £{upper_fence:.2f}")
    print(f"      • Observed Price Range     : [£{df['price'].min():.2f}, £{df['price'].max():.2f}]")

    # 2. Flag Outliers
    flagged = df[(df['price'] < lower_fence) | (df['price'] > upper_fence)]
    print(f"\n      Natural Outliers Detected in Raw Catalog: {len(flagged)} books")
    print("      ↳ RATIONALE: books.toscrape.com generates prices roughly uniformly across")
    print("        [£10, £60]. Because uniform data lacks exponential tails, all items lie")
    print(f"        safely within [£{lower_fence:.2f}, £{upper_fence:.2f}].")

    # 3. Seminar Demonstration: What happens when real outliers occur?
    print("\n[3/4] Classroom Demonstration: Adding 2 Realistic Outliers to Show Triage:")
    demo_outliers = pd.DataFrame([
        {'title': "The Gutenberg Bible (Rare Collector's Folio)", 'price': 149.95, 'rating': 5, 'availability': 'In stock'},
        {'title': 'Corrupted Transmission Entry #999', 'price': 199.99, 'rating': 1, 'availability': 'In stock'}
    ])
    df_demo = pd.concat([df, demo_outliers], ignore_index=True)
    
    # Re-evaluate with the demonstration points
    flagged_demo = df_demo[(df_demo['price'] < lower_fence) | (df_demo['price'] > upper_fence)]
    print(f"      ↳ Flagged {len(flagged_demo)} anomalous records:")
    for idx, row in flagged_demo.iterrows():
        print(f"        * '{row['title']}' -> Price: £{row['price']:.2f}")

    # Non-destructive triage: Save flagged to separate audit file
    flagged_demo.to_csv(OUTLIER_CSV, index=False, encoding='utf-8-sig')
    print(f"\n      ✓ Non-Destructive Triage: Flagged rows saved to '{OUTLIER_CSV}'")
    print("      ⚠️ NEVER delete silently! One is an entry error; the other is a genuine luxury book.")

    # 4. Generate Visualization
    print(f"\n[4/4] Rendering Box Plot & Distribution -> {CHART_FILE}...")
    plt.style.use('dark_background')
    fig, (ax_box, ax_hist) = plt.subplots(1, 2, figsize=(14, 5.2), dpi=150)
    fig.patch.set_facecolor('#0b0f19')

    # Panel A: Boxplot
    ax_box.set_facecolor('#0e1424')
    ax_box.boxplot(
        df_demo['price'],
        patch_artist=True,
        boxprops=dict(facecolor='#06b6d4', color='#38bdf8', alpha=0.7),
        capprops=dict(color='#94a3b8', linewidth=1.5),
        whiskerprops=dict(color='#94a3b8', linewidth=1.5),
        flierprops=dict(marker='o', markerfacecolor='#ef4444', markeredgecolor='white', markersize=7),
        medianprops=dict(color='#f59e0b', linewidth=2.5)
    )
    ax_box.axhline(upper_fence, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Upper Fence (£{upper_fence:.2f})')
    ax_box.axhline(lower_fence, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Lower Fence (£{lower_fence:.2f})')
    ax_box.set_title("Tukey's Box Plot (With Demonstration Outliers)", fontsize=11, fontweight='bold', color='#f1f5f9')
    ax_box.set_ylabel('Price (£)', color='#94a3b8')
    ax_box.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax_box.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=9)

    # Panel B: Histogram showing the outlier spikes
    ax_hist.set_facecolor('#0e1424')
    ax_hist.hist(df['price'], bins=25, color='#06b6d4', alpha=0.8, label='Normal Catalog Books')
    ax_hist.scatter(demo_outliers['price'], [5, 5], color='#ef4444', s=80, zorder=5, label='Flagged Outliers (>£85)')
    ax_hist.axvline(upper_fence, color='#ef4444', linestyle='--', linewidth=1.5)
    ax_hist.set_title('Price Histogram with Outlier Regions', fontsize=11, fontweight='bold', color='#f1f5f9')
    ax_hist.set_xlabel('Price (£)', color='#94a3b8')
    ax_hist.set_ylabel('Book Frequency', color='#94a3b8')
    ax_hist.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax_hist.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=9)

    plt.tight_layout()
    plt.savefig(CHART_FILE, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()

    print(f"✓ SUCCESS: Visualization saved to {os.path.abspath(CHART_FILE)}\n")

if __name__ == "__main__":
    analyze_outliers()
