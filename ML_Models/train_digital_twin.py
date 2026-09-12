import pandas as pd
import joblib
from pathlib import Path

print("=" * 55)
print("FINCREST AI - DIGITAL TWIN TEST")
print("=" * 55)

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
DATA_PATH = BASE_DIR / "datasets" / "personal_finance.csv"

# Load model
model = joblib.load(MODEL_DIR / "digital_twin_model.pkl")
feature_columns = joblib.load(MODEL_DIR / "digital_twin_features.pkl")

# Load a real financial record
df = pd.read_csv(DATA_PATH)

sample = df.iloc[0].copy()

print("\nCURRENT FINANCIAL STATE")
print("-" * 55)
print(f"Monthly Income: ₹{sample['monthly_income']:,.2f}")
print(f"Monthly Expense: ₹{sample['monthly_expense_total']:,.2f}")
print(f"Current Savings: ₹{sample['actual_savings']:,.2f}")

# Current prediction
current_data = pd.DataFrame([sample[feature_columns]])
current_data = current_data.apply(pd.to_numeric, errors="coerce")

current_savings = model.predict(current_data)[0]

# What-if scenario
reduction = 2000

scenario = sample.copy()

scenario["monthly_expense_total"] = (
    float(scenario["monthly_expense_total"]) - reduction
)

# Recalculate savings rate
scenario["savings_rate"] = (
    (float(scenario["monthly_income"]) -
     float(scenario["monthly_expense_total"]))
    / float(scenario["monthly_income"])
)

# Recalculate discretionary spending
scenario["discretionary_spending"] = max(
    0,
    float(scenario["discretionary_spending"]) - reduction
)

scenario_data = pd.DataFrame([scenario[feature_columns]])
scenario_data = scenario_data.apply(pd.to_numeric, errors="coerce")

new_savings = model.predict(scenario_data)[0]

improvement = new_savings - current_savings

print("\nDIGITAL TWIN SIMULATION")
print("-" * 55)
print(f"Scenario: Reduce monthly spending by ₹{reduction:,}")

print(f"\nPredicted Current Savings: ₹{current_savings:,.2f}")
print(f"Predicted New Savings:     ₹{new_savings:,.2f}")
print(f"Savings Improvement:       ₹{improvement:,.2f}")

print("\n" + "=" * 55)
print("SIMULATION COMPLETE")
print("=" * 55)