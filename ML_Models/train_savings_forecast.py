import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "datasets" / "personal_finance.csv"
MODEL_PATH = BASE_DIR / "models" / "simple_savings_model.joblib"
TARGET = "actual_savings"
RANDOM_STATE = 42

FEATURES = [
    "monthly_income",
    "monthly_expense_total",
    "savings_rate",
    "budget_goal",
    "credit_score",
    "debt_to_income_ratio",
    "loan_payment",
    "investment_amount",
    "subscription_services",
    "emergency_fund",
    "transaction_count",
    "fraud_flag",
    "discretionary_spending",
    "essential_spending",
    "rent_or_mortgage",
    "financial_advice_score",
    "savings_goal_met",
]


def main() -> None:
    frame = pd.read_csv(DATA_PATH)
    frame.columns = frame.columns.str.strip()

    missing_columns = sorted(set([TARGET, *FEATURES]) - set(frame.columns))
    if missing_columns:
        raise ValueError(f"Dataset is missing columns: {missing_columns}")

    X = frame[FEATURES].apply(pd.to_numeric, errors="coerce")
    X = X.fillna(X.median())
    y = pd.to_numeric(frame[TARGET], errors="coerce")

    valid_rows = y.notna()
    X = X.loc[valid_rows]
    y = y.loc[valid_rows]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    metrics = {
        "mae": float(mean_absolute_error(y_test, predictions)),
        "r2": float(r2_score(y_test, predictions)),
    }

    MODEL_PATH.parent.mkdir(exist_ok=True)
    joblib.dump(
        {
            "model": model,
            "features": FEATURES,
            "medians": X.median().to_dict(),
            "target": TARGET,
        },
        MODEL_PATH,
    )

    print(json.dumps({
        "rows": len(X),
        "train_rows": len(X_train),
        "test_rows": len(X_test),
        "features": FEATURES,
        "target": TARGET,
        "model": "RandomForestRegressor",
        "metrics": metrics,
        "model_path": str(MODEL_PATH),
    }, indent=2))


if __name__ == "__main__":
    main()