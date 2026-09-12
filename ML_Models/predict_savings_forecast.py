from pathlib import Path
from typing import Mapping

import joblib
import pandas as pd


MODEL_PATH = Path(__file__).resolve().parent / "models" / "simple_savings_model.joblib"


def predict_next_savings(record: Mapping[str, object]) -> float:
    """Load the saved model and return a predicted savings value."""
    bundle = joblib.load(MODEL_PATH)
    missing_columns = sorted(set(bundle["features"]) - set(record))
    if missing_columns:
        raise ValueError(f"Prediction record is missing columns: {missing_columns}")

    frame = pd.DataFrame([dict(record)])[bundle["features"]]
    frame = frame.apply(pd.to_numeric, errors="coerce")
    frame = frame.fillna(pd.Series(bundle["medians"]))

    return float(bundle["model"].predict(frame)[0])


if __name__ == "__main__":
    print("Import predict_next_savings(record) to make a future prediction.")