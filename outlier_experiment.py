"""
DataLab Live - Lesson 5: Controlled ML Experiment
Filename: outlier_experiment.py
Run command: python outlier_experiment.py

Controlled synthetic benchmark testing OLS Linear Regression sensitivity to outliers.
Ground truth: y = 3x + 5 + noise
Compares:
  - Model A: Clean training set
  - Model B: Training set contaminated with 1 extreme leverage outlier
  - Model C: Outlier removed via IQR on residuals
Evaluated on the exact same clean holdout test set.
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CHART_FILE = "model_comparison.png"

def run_experiment():
    print("=" * 68)
    print("  DataLab Live: Controlled ML Outlier Sensitivity Experiment")
    print("  (Clearly Labelled Synthetic Benchmark - Separate from Book Data)")
    print("  Known Ground Truth Function: y = 3.00*x + 5.00 + Gaussian Noise")
    print("=" * 68 + "\n")

    # 1. Generate clean synthetic ground truth dataset
    np.random.seed(42)
    n_samples = 100
    X_clean = np.random.uniform(0, 10, size=(n_samples, 1))
    noise = np.random.normal(0, 1.2, size=(n_samples, 1))
    y_clean = 3.0 * X_clean + 5.0 + noise

    # 2. Fixed Train/Test Split (70% train, 30% test)
    X_train_clean, X_test, y_train_clean, y_test = train_test_split(
        X_clean, y_clean, test_size=0.30, random_state=42
    )

    print(f"[1] Data Partitioning:")
    print(f"    • Clean Training Set : {len(X_train_clean)} observations")
    print(f"    • Clean Holdout Test : {len(X_test)} observations (strictly uncorrupted)\n")

    # 3. Fit Model A: Clean Baseline
    model_a = LinearRegression()
    model_a.fit(X_train_clean, y_train_clean)
    pred_a = model_a.predict(X_test)
    mae_a = mean_absolute_error(y_test, pred_a)
    rmse_a = np.sqrt(mean_squared_error(y_test, pred_a))

    # 4. Construct Contaminated Training Set for Model B
    # Inject exactly ONE severe leverage outlier point (x=8.5, true y~30.5, corrupted to y=-15.0)
    outlier_x = np.array([[8.5]])
    outlier_y = np.array([[-15.0]])  # Severe downward leverage pulling OLS line

    X_train_b = np.vstack([X_train_clean, outlier_x])
    y_train_b = np.vstack([y_train_clean, outlier_y])

    # Fit Model B: Contaminated
    model_b = LinearRegression()
    model_b.fit(X_train_b, y_train_b)
    pred_b = model_b.predict(X_test)
    mae_b = mean_absolute_error(y_test, pred_b)
    rmse_b = np.sqrt(mean_squared_error(y_test, pred_b))

    # 5. Model C: Outlier Detection via IQR on Residuals
    initial_residuals = y_train_b.flatten() - model_b.predict(X_train_b).flatten()
    res_q1 = np.percentile(initial_residuals, 25)
    res_q3 = np.percentile(initial_residuals, 75)
    res_iqr = res_q3 - res_q1
    res_lower = res_q1 - 1.5 * res_iqr
    res_upper = res_q3 + 1.5 * res_iqr

    # Keep points inside IQR fence
    keep_mask = (initial_residuals >= res_lower) & (initial_residuals <= res_upper)
    flagged_indices = np.where(~keep_mask)[0]

    X_train_c = X_train_b[keep_mask]
    y_train_c = y_train_b[keep_mask]

    # Fit Model C: IQR Recovered
    model_c = LinearRegression()
    model_c.fit(X_train_c, y_train_c)
    pred_c = model_c.predict(X_test)
    mae_c = mean_absolute_error(y_test, pred_c)
    rmse_c = np.sqrt(mean_squared_error(y_test, pred_c))

    # 6. Display Performance Metrics Table
    print("[2] Empirical Model Performance Comparison on Identical Clean Test Set:")
    summary_df = pd.DataFrame({
        'Model Condition': [
            'Ground Truth (Actual)',
            'Model A (Clean Data)',
            'Model B (1 Extreme Outlier)',
            'Model C (IQR Residual Cleaned)'
        ],
        'Slope (Coeff)': [3.0000, model_a.coef_[0][0], model_b.coef_[0][0], model_c.coef_[0][0]],
        'Intercept': [5.0000, model_a.intercept_[0], model_b.intercept_[0], model_c.intercept_[0]],
        'Test MAE': [0.0000, mae_a, mae_b, mae_c],
        'Test RMSE': [0.0000, rmse_a, rmse_b, rmse_c]
    })
    print(summary_df.round(4).to_string(index=False))
    print()

    # 7. Side-by-Side Predictions on Identical Inputs
    test_inputs = np.array([[2.0], [5.0], [8.0]])
    true_outputs = 3.0 * test_inputs + 5.0
    preds_a_sample = model_a.predict(test_inputs)
    preds_b_sample = model_b.predict(test_inputs)
    preds_c_sample = model_c.predict(test_inputs)

    print("[3] Side-by-Side Predictions for Unseen Inputs:")
    comp_df = pd.DataFrame({
        'Input X': test_inputs.flatten(),
        'True y (3x+5)': true_outputs.flatten(),
        'Model A Pred': preds_a_sample.flatten(),
        'Model B Pred (Distorted)': preds_b_sample.flatten(),
        'Model C Pred (Recovered)': preds_c_sample.flatten()
    })
    print(comp_df.round(2).to_string(index=False))
    print()

    print("[4] Key Methodological Takeaways:")
    print("    • Squared-Error Sensitivity: Ordinary Least Squares (OLS) minimizes sum(residual^2).")
    print("      Squaring a large error (e.g. 40^2 = 1600) gives that single point disproportionate leverage,")
    print(f"      tilting the slope from {model_a.coef_[0][0]:.2f} down to {model_b.coef_[0][0]:.2f}!")
    print("    • Contextual Domain Rule: Removing an outlier only helps when the observation is a genuine")
    print("      transmission/measurement corruption. If the point represents a valid black-swan or rare")
    print("      tail event, discarding it biases the model and induces false confidence.")

    # 8. Visualizations: 3-Panel Side-by-Side Regression Comparison
    print(f"\n[5] Rendering Comparative Regression Curves -> {CHART_FILE}...")
    plt.style.use('dark_background')
    fig, axes = plt.subplots(1, 3, figsize=(16, 5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')

    x_line = np.linspace(0, 10, 100).reshape(-1, 1)

    # Panel 1: Model A (Clean)
    ax = axes[0]
    ax.set_facecolor('#0e1424')
    ax.scatter(X_train_clean, y_train_clean, color='#38bdf8', alpha=0.6, label='Clean Train Points (N=70)', s=25)
    ax.plot(x_line, model_a.predict(x_line), color='#10b981', linewidth=2.5, label=f'Model A: y={model_a.coef_[0][0]:.2f}x+{model_a.intercept_[0]:.2f}')
    ax.plot(x_line, 3.0*x_line+5.0, color='#94a3b8', linestyle=':', label='True Function (3x+5)')
    ax.set_title(f'Model A: Clean Baseline\nRMSE: {rmse_a:.2f} | MAE: {mae_a:.2f}', fontsize=11, fontweight='bold', color='#f1f5f9')
    ax.set_xlabel('Predictor X', color='#94a3b8')
    ax.set_ylabel('Target y', color='#94a3b8')
    ax.set_ylim(-20, 42)
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8, loc='upper left')

    # Panel 2: Model B (Contaminated)
    ax = axes[1]
    ax.set_facecolor('#0e1424')
    ax.scatter(X_train_clean, y_train_clean, color='#38bdf8', alpha=0.4, s=25)
    ax.scatter(outlier_x, outlier_y, color='#ef4444', s=120, edgecolor='white', linewidth=2, label='Single Outlier (x=8.5, y=-15)', zorder=5)
    ax.plot(x_line, model_b.predict(x_line), color='#ef4444', linewidth=2.5, linestyle='--', label=f'Model B: y={model_b.coef_[0][0]:.2f}x+{model_b.intercept_[0]:.2f}')
    ax.plot(x_line, 3.0*x_line+5.0, color='#94a3b8', linestyle=':', label='True Function (3x+5)')
    ax.set_title(f'Model B: 1 Outlier Contamination\nRMSE: {rmse_b:.2f} (+{(rmse_b/rmse_a-1)*100:.0f}%) | MAE: {mae_b:.2f}', fontsize=11, fontweight='bold', color='#f87171')
    ax.set_xlabel('Predictor X', color='#94a3b8')
    ax.set_ylim(-20, 42)
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8, loc='upper left')

    # Panel 3: Model C (IQR Recovered)
    ax = axes[2]
    ax.set_facecolor('#0e1424')
    ax.scatter(X_train_c, y_train_c, color='#38bdf8', alpha=0.6, s=25, label='Retained Points (N=70)')
    ax.scatter(outlier_x, outlier_y, facecolors='none', edgecolors='#ef4444', s=100, linewidth=2, linestyle='--', label='Filtered Outlier', zorder=5)
    ax.plot(x_line, model_c.predict(x_line), color='#a855f7', linewidth=2.5, label=f'Model C: y={model_c.coef_[0][0]:.2f}x+{model_c.intercept_[0]:.2f}')
    ax.plot(x_line, 3.0*x_line+5.0, color='#94a3b8', linestyle=':', label='True Function (3x+5)')
    ax.set_title(f'Model C: IQR Residual Filtered\nRMSE: {rmse_c:.2f} | MAE: {mae_c:.2f}', fontsize=11, fontweight='bold', color='#c084fc')
    ax.set_xlabel('Predictor X', color='#94a3b8')
    ax.set_ylim(-20, 42)
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8, loc='upper left')

    plt.tight_layout()
    plt.savefig(CHART_FILE, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()

    print(f"✓ SUCCESS: Model comparison chart saved to {os.path.abspath(CHART_FILE)}\n")

if __name__ == "__main__":
    run_experiment()
