import pandas as pd
from database import get_connection


def get_expense_dataset(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            date,
            amount
        FROM transactions
        WHERE user_id = ?
        AND type = 'expense'
        ORDER BY date ASC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    connection.close()

    if not rows:
        return pd.DataFrame()

    data = []

    for row in rows:
        data.append({
            "date": row["date"],
            "amount": float(row["amount"])
        })

    df = pd.DataFrame(data)

    df["date"] = pd.to_datetime(df["date"])

    return df