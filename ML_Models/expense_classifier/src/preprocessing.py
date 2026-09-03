import pandas as pd
import re


def clean_text(text):
    """
    Clean a transaction description before sending it
    to the ML model.
    """

    text = str(text).lower()

    # Remove numbers
    text = re.sub(r"\d+", "", text)

    # Remove special characters
    text = re.sub(r"[^a-z\s]", " ", text)

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text).strip()

    return text


def load_dataset(file_path):
    """
    Load the expense dataset and clean descriptions.
    """

    df = pd.read_csv(file_path)

    # Check required columns
    if "description" not in df.columns or "category" not in df.columns:
        raise ValueError(
            "Dataset must contain 'description' and 'category' columns."
        )

    # Remove empty rows
    df = df.dropna(subset=["description", "category"])

    # Clean descriptions
    df["clean_description"] = df["description"].apply(clean_text)

    return df