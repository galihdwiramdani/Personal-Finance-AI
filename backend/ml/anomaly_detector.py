from database import get_connection
from sklearn.ensemble import IsolationForest


def detect_anomalies(user_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            amount,
            category,
            description,
            date
        FROM transactions
        WHERE user_id = ?
        AND type = 'expense'
        ORDER BY date ASC
        """,
        (user_id,)
    )

    transactions = cursor.fetchall()
    connection.close()

    # Minimal data untuk menjalankan model
    if len(transactions) < 5:
        return {
            "success": True,
            "message": "Not enough transaction data for anomaly detection.",
            "anomalies": []
        }

    amounts = [
        [float(transaction["amount"])]
        for transaction in transactions
    ]

    model = IsolationForest(
        contamination=0.1,
        random_state=42
    )

    predictions = model.fit_predict(amounts)

    anomalies = []

    for transaction, prediction in zip(
        transactions,
        predictions
    ):
        if prediction == -1:
            anomalies.append({
                "id": transaction["id"],
                "amount": float(transaction["amount"]),
                "category": transaction["category"],
                "description": transaction["description"],
                "date": transaction["date"]
            })

    return {
        "success": True,
        "message": (
            "Anomaly detection completed."
            if anomalies
            else "No unusual transactions detected."
        ),
        "anomalies": anomalies
    }