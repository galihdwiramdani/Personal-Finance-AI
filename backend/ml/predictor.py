import pandas as pd
from ml.dataset import get_expense_dataset
from ml.model import train_model


def predict_next_expense(user_id: int):

    df = get_expense_dataset(user_id)

    if df.empty:
        return {
            "success": False,
            "message": "Not enough transaction data."
        }

    model = train_model(df)

    if model is None:
        return {
            "success": False,
            "message": "At least 2 days of expense data are required."
        }

    next_day_index = len(
        df["date"].unique()
    )

    prediction = model.predict(
        pd.DataFrame(
            {"day_index": [next_day_index]}
        )
    )[0]

    prediction = max(0, prediction)

    return {
        "success": True,
        "predicted_expense": round(
            float(prediction),
            2
        )
    }