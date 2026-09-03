import requests


ML_API_URL = "http://127.0.0.1:5000/predict"


def predict_expense(description):
    response = requests.post(
        ML_API_URL,
        json={"description": description},
        timeout=10
    )

    response.raise_for_status()

    data = response.json()

    return data