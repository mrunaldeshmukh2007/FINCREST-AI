import os
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

from preprocessing import load_dataset


# Paths
DATA_PATH = "../data/raw/expenses.csv"
MODEL_PATH = "../models/expense_classifier.pkl"


# Load dataset
df = load_dataset(DATA_PATH)

X = df["clean_description"]
y = df["category"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Create ML pipeline
model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=5000
        )
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])


# Train model
print("Training model...")
model.fit(X_train, y_train)


# Evaluate
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:")
print(f"{accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# Create models directory if needed
os.makedirs("../models", exist_ok=True)


# Save model
joblib.dump(model, MODEL_PATH)

print(f"\nModel saved successfully to: {MODEL_PATH}")