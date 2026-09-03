import joblib
import os

# Path to trained model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "expense_classifier.pkl"
)

# Load trained model
model = joblib.load(MODEL_PATH)

print("======================================")
print("       FINCREST AI EXPENSE CLASSIFIER")
print("======================================")
print("Type an expense description.")
print("Type 'exit' to stop.\n")

while True:

    description = input("Enter expense: ")

    if description.lower() == "exit":
        print("\nExiting Expense Classifier...")
        break

    if not description.strip():
        print("Please enter an expense description.\n")
        continue

    # Predict category
    prediction = model.predict([description])

    print(f"Predicted Category: {prediction[0]}")
    print("--------------------------------------")