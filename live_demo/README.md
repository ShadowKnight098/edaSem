# Live Seminar Demonstration Kit
> **Quick Live Coding Scripts for VS Code & Windows PowerShell**

This folder contains 3 sequential, self-contained scripts designed to be opened in VS Code and shown directly to your audience during a seminar or lecture.

---

## 📂 File Directory

| Step | Filename | Language | PowerShell Run Command | What to Explain to the Audience |
| :---: | :--- | :---: | :--- | :--- |
| **01** | [`1_crawler.js`](file:///d:/eda-task/live_demo/1_crawler.js) | JavaScript / Node.js | `node 1_crawler.js` | Automated headless Chromium scraping with Playwright, following pagination links (`li.next a`), cleaning prices, mapping star ratings, and saving to `books_dataset.csv` with UTF-8 BOM. |
| **02** | [`2_data_cleaning.py`](file:///d:/eda-task/live_demo/2_data_cleaning.py) | Python / pandas | `python 2_data_cleaning.py` | Data hygiene: auditing null counts, finding duplicate titles, enforcing strict data types, creating derived price categories, and saving to `books_cleaned.csv`. |
| **03** | [`3_outlier_analysis.py`](file:///d:/eda-task/live_demo/3_outlier_analysis.py) | Python / Matplotlib | `python 3_outlier_analysis.py` | Mathematical Tukey's IQR fences ($Q_1, Q_3, \text{IQR}$, Lower/Upper bounds), explaining the 0-outlier finding on uniform data, demonstrating triage with simulated anomalies, archiving to `outliers_flagged.csv`, and plotting `outlier_demo_chart.png`. |

---

## ⚡ 1-Click Master Execution
To run all three steps sequentially from **Windows PowerShell**:

```powershell
cd d:\eda-task\live_demo
.\run_all.ps1
```

---

## 🎯 Key Presenter Talking Points

1. **Step 1 (Scraping)**:
   - Point out that full book titles are extracted from `<a title="...">` rather than innerText, which avoids ellipsis truncation like `"A Light in the ..."`.
   - Explain why UTF-8 BOM (`\uFEFF`) is prepended to ensure Microsoft Excel opens the CSV cleanly without corrupted character encodings.

2. **Step 2 (Cleaning)**:
   - Emphasize checking data types and invalid values (`price <= 0`) before downstream machine learning models are trained.
   - Point out that 0 nulls were found, but exactly 1 duplicate title was detected and retained for domain inspection.

3. **Step 3 (Outliers)**:
   - Show that Tukey's formula produces Lower Fence = $-£15.92$ and Upper Fence = $£85.48$.
   - Highlight the **Golden Rule of Outlier Triage**: Never delete outliers silently! Archive flagged entries to `outliers_flagged.csv`. One could be a data entry error; the other could be an authentic rare collectible book.
