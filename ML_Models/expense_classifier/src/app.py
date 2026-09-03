from flask import Flask, request, jsonify
import joblib
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load trained model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "expense_classifier.pkl"
)

model = joblib.load(MODEL_PATH)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "FINCREST AI Expense Classifier API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    if not data or "description" not in data:
        return jsonify({
            "error": "Expense description is required"
        }), 400

    description = data["description"]

    prediction = model.predict([description])

    return jsonify({
        "description": description,
        "category": prediction[0]
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)