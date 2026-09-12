import pandas as pd
import numpy as np
from pathlib import Path
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# =========================
# PATHS
# =========================

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "datasets" / "personal_finance.csv"
MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(exist_ok=True)


# =========================
# LOAD DATA
# =========================

print("Loading dataset...")

df = pd.read_csv(DATA_PATH)

df.columns = df.columns.str.strip()

print("Dataset loaded successfully!")
print("Rows:", len(df))
print("Columns:", len(df.columns))
print("\nAvailable columns:")
print(df.columns.tolist())


# =========================
# CREATE AI COACH TARGET
# =========================

if "financial_advice_score" not in df.columns:
    raise ValueError(
        "financial_advice_score column not found in dataset."
    )


def create_advice_level(score):
    if score < 34:
        return "Poor"
    elif score < 67:
        return "Moderate"
    else:
        return "Good"


df["advice_level"] = df["financial_advice_score"].apply(
    create_advice_level
)


# =========================
# POSSIBLE FEATURES
# =========================

possible_features = [
    "monthly_income",
    "monthly_expense",
    "total_savings",
    "savings_rate",
    "budget_goal",
    "credit_score",
    "debt_to_income_ratio",
    "loan_payment",
    "investment_amount",
    "subscription_spending",
    "emergency_fund",
    "transaction_count",
    "discretionary_spending",
    "essential_spending",
    "rent_or_mortgage",
    "actual_savings",
    "savings_goal_met"
]


# Only use columns that actually exist
feature_columns = [
    col for col in possible_features
    if col in df.columns
]

missing_columns = [
    col for col in possible_features
    if col not in df.columns
]


print("\nFeatures being used:")
print(feature_columns)

print("\nFeatures not found:")
print(missing_columns)


if len(feature_columns) == 0:
    raise ValueError("No usable feature columns found.")


# =========================
# PREPARE DATA
# =========================

X = df[feature_columns].copy()
y = df["advice_level"].copy()


# Convert numeric columns
for column in X.columns:
    X[column] = pd.to_numeric(
        X[column],
        errors="coerce"
    )


# Replace infinite values
X = X.replace(
    [np.inf, -np.inf],
    np.nan
)


# Fill missing values
X = X.fillna(
    X.median(numeric_only=True)
)


# =========================
# ENCODE TARGET
# =========================

encoder = LabelEncoder()

y_encoded = encoder.fit_transform(y)


# =========================
# TRAIN / TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)


# =========================
# TRAIN MODEL
# =========================

print("\nTraining AI Coach model...")

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    class_weight="balanced"
)

model.fit(
    X_train,
    y_train
)


# =========================
# EVALUATE
# =========================

predictions = model.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\n==========================")
print("AI COACH MODEL RESULTS")
print("==========================")

print(
    "Accuracy:",
    round(accuracy * 100, 2),
    "%"
)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        target_names=encoder.classes_,
        zero_division=0
    )
)


# =========================
# SAVE MODEL
# =========================

joblib.dump(
    model,
    MODEL_DIR / "ai_coach_model.pkl"
)

joblib.dump(
    encoder,
    MODEL_DIR / "ai_coach_label_encoder.pkl"
)

joblib.dump(
    feature_columns,
    MODEL_DIR / "ai_coach_features.pkl"
)


print("\n==========================")
print("MODEL SAVED SUCCESSFULLY")
print("==========================")

print(
    MODEL_DIR / "ai_coach_model.pkl"
)