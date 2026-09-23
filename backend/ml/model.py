import pandas as pd

from sklearn.linear_model import LinearRegression


def prepare_dataset(df):

    if df.empty:
        return None, None

    daily_expense = (
        df.groupby("date")["amount"]
        .sum()
        .reset_index()
    )

    daily_expense["day_index"] = range(
        len(daily_expense)
    )

    X = daily_expense[["day_index"]]

    y = daily_expense["amount"]

    return X, y


def train_model(df):

    X, y = prepare_dataset(df)

    if X is None or len(X) < 2:
        return None

    model = LinearRegression()

    model.fit(X, y)

    return model