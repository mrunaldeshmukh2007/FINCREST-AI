import joblib
import pandas as pd
from pathlib import Path
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "datasets" / "personal_finance.csv"
MODEL_OUTPUT_PATH = BASE_DIR / "models" / "category_model.joblib"

# 1. Load your existing dataset
df = pd.read_csv(DATASET_PATH)

# Adjust these column names if your personal_finance.csv uses different headers
# e.g., 'Description', 'Amount', 'Category'
X = df[["Description", "Amount"]]
y = df["Category"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

preprocessor = ColumnTransformer(
    transformers=[
        ("text", TfidfVectorizer(ngram_range=(1, 2), min_df=2), "Description"),
        ("num", StandardScaler(), ["Amount"])
    ]
)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LinearSVC(C=1.0, random_state=42))
])

print("Training model...")
pipeline.fit(X_train, y_train)

y_pred = pipeline.predict(X_test)
print(classification_report(y_test, y_pred))

# Save the trained model into your existing ML_MODELS/models/ directory
joblib.dump(pipeline, MODEL_OUTPUT_PATH)
print(f"Saved model to {MODEL_OUTPUT_PATH}")