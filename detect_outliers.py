"""
DataLab Live - Lesson 4: Outlier Detection & Treatment
Filename: detect_outliers.py
Run command: python detect_outliers.py

Performs mathematical Tukey fence outlier detection on book prices,
creates dual-panel boxplot + scatter plots, and safely triages flagged records
to a separate CSV without destructive deletion.
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Ensure Windows PowerShell console handles currency symbols (£) and unicode safely
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

INPUT_CSV = "books_dataset.csv"
OUTLIER_CSV = "outliers_flagged.csv"
PLOT_FILE = "outlier_boxplot.png"

def detect_outliers():
    print("=" * 65)
    print("  DataLab Live: Outlier Detection via Tukey's IQR Fences")
    print(f"  Input Dataset: {INPUT_CSV}")
    print("=" * 65 + "\n")

    if not os.path.exists(INPUT_CSV):
        print(f"[ERROR] {INPUT_CSV} not found. Run 'node scrape_books.js' first.")
        sys.exit(1)

    df = pd.read_csv(INPUT_CSV, encoding="utf-8-sig")

    # 1. Mathematical Quartile Computation
    q1 = df['price'].quantile(0.25)
    q2 = df['price'].median()
    q3 = df['price'].quantile(0.75)
    iqr = q3 - q1

    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr

    print("[1] Tukey Fences Mathematical Breakdown:")
    print(f"    • 25th Percentile (Q1)     : £{q1:.2f}")
    print(f"    • 50th Percentile (Median) : £{q2:.2f}")
    print(f"    • 75th Percentile (Q3)     : £{q3:.2f}")
    print(f"    • Interquartile Range (IQR): £{iqr:.2f}")
    print(f"    • Lower Fence [Q1 - 1.5*IQR]: £{lower_fence:.2f}")
    print(f"    • Upper Fence [Q3 + 1.5*IQR]: £{upper_fence:.2f}")
    print(f"    • Minimum Observed Price   : £{df['price'].min():.2f}")
    print(f"    • Maximum Observed Price   : £{df['price'].max():.2f}\n")

    # 2. Flag Outlier Records
    outliers_mask = (df['price'] < lower_fence) | (df['price'] > upper_fence)
    flagged_df = df[outliers_mask]

    print(f"[2] Outlier Audit Results:")
    print(f"    • Total flagged records: {len(flagged_df)} out of {len(df)}")

    # 3. Handle Zero-Outlier Case Explicitly
    if len(flagged_df) == 0:
        print("    ↳ EXPLICIT FINDING: 0 statistical outliers detected on books.toscrape.com!")
        print("    ↳ RATIONALE: The sandbox author generated prices via a roughly uniform")
        print("      random distribution between ~£10 and ~£60. Because uniform distributions")
        print("      have flat density without heavy exponential tails, all items lie safely")
        print(f"      within the calculated bounds [£{lower_fence:.2f}, £{upper_fence:.2f}].")
    else:
        print("\n[3] Flagged Records Preview:")
        print(flagged_df[['title', 'price', 'rating']].head(10).to_string())

    # 4. Non-Destructive Triage: Save Flagged to Separate CSV
    # Even if 0 records, we write the headers so downstream auditors have the artifact
    flagged_df.to_csv(OUTLIER_CSV, index=False, encoding='utf-8-sig')
    print(f"\n[4] Non-Destructive Triage:")
    print(f"    ✓ Flagged records archived to: {OUTLIER_CSV}")
    print("    ⚠️ NEVER delete outliers silently! In production data science, an extreme")
    print("      price may be a valid rare collector's edition or antique item.")

    # 5. Dual Visualization: Box Plot + Strip/Scatter Plot
    print(f"\n[5] Rendering Tukey Box Plot & Strip Plot -> {PLOT_FILE}...")
    plt.style.use('dark_background')
    fig, (ax_box, ax_scatter) = plt.subplots(1, 2, figsize=(14, 5.5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')

    # Left: Box Plot with Fences
    ax_box.set_facecolor('#0e1424')
    box = ax_box.boxplot(
        df['price'],
        vert=True,
        patch_artist=True,
        widths=0.4,
        boxprops=dict(facecolor='#06b6d4', color='#38bdf8', alpha=0.7),
        capprops=dict(color='#94a3b8', linewidth=1.5),
        whiskerprops=dict(color='#94a3b8', linewidth=1.5),
        flierprops=dict(marker='o', markerfacecolor='#ef4444', markeredgecolor='white', markersize=6),
        medianprops=dict(color='#f59e0b', linewidth=2.5)
    )
    # Highlight fences
    ax_box.axhline(upper_fence, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Upper Fence (£{upper_fence:.2f})')
    ax_box.axhline(lower_fence, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Lower Fence (£{lower_fence:.2f})')
    ax_box.set_title('Tukey Box Plot of Book Prices (£)', fontsize=12, fontweight='bold', color='#f1f5f9', pad=12)
    ax_box.set_ylabel('Price (£)', fontsize=10, color='#94a3b8')
    ax_box.set_xticks([])
    ax_box.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax_box.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=9, loc='upper right')

    # Right: Strip / Scatter distribution with Jitter
    ax_scatter.set_facecolor('#0e1424')
    np.random.seed(42)
    jitter = np.random.normal(0, 0.04, size=len(df))
    ax_scatter.scatter(
        1 + jitter, df['price'],
        alpha=0.4, color='#38bdf8', edgecolors='none', s=25, label='Catalog Books'
    )
    ax_scatter.axhline(q1, color='#a855f7', linestyle=':', label=f'Q1 (£{q1:.2f})')
    ax_scatter.axhline(q2, color='#f59e0b', linestyle='-', label=f'Median (£{q2:.2f})')
    ax_scatter.axhline(q3, color='#a855f7', linestyle=':', label=f'Q3 (£{q3:.2f})')
    ax_scatter.axhline(upper_fence, color='#ef4444', linestyle='--', label='Upper Fence')
    ax_scatter.axhline(lower_fence, color='#ef4444', linestyle='--', label='Lower Fence')

    ax_scatter.set_title('Data Point Scatter & Quartile Bands', fontsize=12, fontweight='bold', color='#f1f5f9', pad=12)
    ax_scatter.set_ylabel('Price (£)', fontsize=10, color='#94a3b8')
    ax_scatter.set_xlim(0.7, 1.3)
    ax_scatter.set_xticks([])
    ax_scatter.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax_scatter.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8, loc='upper right')

    plt.tight_layout()
    plt.savefig(PLOT_FILE, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()

    print(f"✓ SUCCESS: Outlier plot saved to {os.path.abspath(PLOT_FILE)}\n")

if __name__ == "__main__":
    detect_outliers()
