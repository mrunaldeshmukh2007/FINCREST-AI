import pandas as pd
import joblib
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "ai_coach_model.pkl"
ENCODER_PATH = BASE_DIR / "models" / "ai_coach_label_encoder.pkl"
FEATURES_PATH = BASE_DIR / "models" / "ai_coach_features.pkl"
DATA_PATH = BASE_DIR / "datasets" / "personal_finance.csv"

# Load model
model = joblib.load(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)
features = joblib.load(FEATURES_PATH)

# Load dataset
df = pd.read_csv(DATA_PATH)

# Take one real user's financial data
sample = df[features].iloc[[0]].copy()

# Convert values to numbers
for column in sample.columns:
    sample[column] = pd.to_numeric(
        sample[column],
        errors="coerce"
    )

sample = sample.fillna(0)

# Predict
prediction = model.predict(sample)

# Convert prediction back to label
advice_level = encoder.inverse_transform(prediction)[0]

print("\n==============================")
print("FINCREST AI - AI COACH TEST")
print("==============================")

print("\nInput financial data:")
print(sample.to_string(index=False))

print("\nAI Coach Prediction:")
print(advice_level)

print("\n==============================")