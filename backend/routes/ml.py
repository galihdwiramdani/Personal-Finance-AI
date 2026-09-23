from fastapi import APIRouter

from ml.predictor import predict_next_expense
from database import get_connection


router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"]
)


@router.get("/predict-expense")
def predict_expense(user_id: int):

    return predict_next_expense(user_id)


@router.get("/recommendation")
def financial_recommendation(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            type,
            SUM(amount) AS total
        FROM transactions
        WHERE user_id = ?
        GROUP BY type
        """,
        (user_id,)
    )

    summary = cursor.fetchall()

    cursor.execute(
        """
        SELECT
            category,
            SUM(amount) AS total
        FROM transactions
        WHERE user_id = ?
        AND type = 'expense'
        GROUP BY category
        ORDER BY total DESC
        """,
        (user_id,)
    )

    categories = cursor.fetchall()

    connection.close()

    income = 0
    expense = 0

    for row in summary:

        if row["type"] == "income":
            income = row["total"]

        elif row["type"] == "expense":
            expense = row["total"]

    recommendations = []

    # Tidak ada data transaksi
    if income == 0 and expense == 0:

        recommendations.append(
            "Start recording your transactions "
            "to receive personalized financial insights."
        )

    # Expense lebih besar dari income
    elif expense > income:

        recommendations.append(
            "Your expenses are currently higher "
            "than your income. Consider reducing "
            "non-essential spending."
        )

    # Expense cukup besar dibanding income
    elif income > 0 and expense / income >= 0.8:

        recommendations.append(
            "Your expenses are relatively high "
            "compared to your income. Try to "
            "increase your savings by reducing "
            "unnecessary spending."
        )

    else:

        recommendations.append(
            "Your spending is currently below "
            "your income. Keep maintaining a "
            "healthy spending habit."
        )

    # Analisis kategori terbesar
    if categories:

        top_category = categories[0]

        category_name = top_category["category"]
        category_total = top_category["total"]

        recommendations.append(
            f"Your highest spending category is "
            f"{category_name} with total spending "
            f"of Rp{category_total:,.0f}."
        )

    return {
        "success": True,
        "income": income,
        "expense": expense,
        "recommendations": recommendations
    }