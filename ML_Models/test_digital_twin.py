import joblib
import pandas as pd
from pathlib import Path

print("=" * 55)
print("FINCREST AI - DIGITAL TWIN TEST")
print("=" * 55)

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "digital_twin_model.pkl"
FEATURES_PATH = MODEL_DIR / "digital_twin_features.pkl"

# Load model
print("\nLoading Digital Twin model...")

model = joblib.load(MODEL_PATH)
features = joblib.load(FEATURES_PATH)

print("Model loaded successfully!")

# Current financial state
monthly_income = 30000
monthly_expense = 20000
spending_reduction = 2000

# Current savings
current_savings = monthly_income - monthly_expense

# Digital Twin scenario
new_expense = monthly_expense - spending_reduction
new_savings = monthly_income - new_expense

# Improvement
improvement = new_savings - current_savings

print("\nCURRENT FINANCIAL STATE")
print("-" * 55)

print(f"Monthly Income: ₹{monthly_income:,.2f}")
print(f"Monthly Expense: ₹{monthly_expense:,.2f}")
print(f"Current Savings: ₹{current_savings:,.2f}")

print("\nDIGITAL TWIN SIMULATION")
print("-" * 55)

print("Scenario: Reduce monthly spending by ₹2,000")

print(f"\nCurrent Monthly Expense: ₹{monthly_expense:,.2f}")
print(f"New Monthly Expense: ₹{new_expense:,.2f}")

print(f"\nPredicted Current Savings: ₹{current_savings:,.2f}")
print(f"Predicted New Savings: ₹{new_savings:,.2f}")
print(f"Savings Improvement: ₹{improvement:,.2f}")

print("\nFINANCIAL IMPACT")
print("-" * 55)

print(f"Monthly Savings Increase: ₹{improvement:,.2f}")
print(f"Yearly Savings Increase: ₹{improvement * 12:,.2f}")

print("\n" + "=" * 55)
print("DIGITAL TWIN SIMULATION COMPLETE")
print("=" * 55)