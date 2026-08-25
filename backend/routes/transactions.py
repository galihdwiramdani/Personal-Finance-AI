from fastapi import APIRouter, HTTPException
from models.schemas import TransactionCreate
from database import get_connection


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


@router.post("/")
def create_transaction(
    transaction: TransactionCreate,
    user_id: int
):

    connection = get_connection()
    cursor = connection.cursor()

    # Check user
    cursor.execute(
        "SELECT id FROM users WHERE id = ?",
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    cursor.execute(
        """
        INSERT INTO transactions
        (
            user_id,
            amount,
            type,
            category,
            description,
            date
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            user_id,
            transaction.amount,
            transaction.type,
            transaction.category,
            transaction.description,
            str(transaction.date)
        )
    )

    connection.commit()

    transaction_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Transaction created successfully",
        "transaction_id": transaction_id
    }

@router.get("/")
def get_transactions(user_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM transactions
        WHERE user_id = ?
        ORDER BY date DESC
        """,
        (user_id,)
    )

    transactions = cursor.fetchall()

    connection.close()

    return [
        dict(transaction)
        for transaction in transactions
    ]

@router.put("/{transaction_id}")
def update_transaction(
    transaction_id: int,
    transaction: TransactionCreate,
    user_id: int
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE transactions
        SET
            amount = ?,
            type = ?,
            category = ?,
            description = ?,
            date = ?
        WHERE id = ?
        AND user_id = ?
        """,
        (
            transaction.amount,
            transaction.type,
            transaction.category,
            transaction.description,
            str(transaction.date),
            transaction_id,
            user_id
        )
    )

    if cursor.rowcount == 0:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    connection.commit()
    connection.close()

    return {
        "message": "Transaction updated successfully"
    }

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    user_id: int
):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        DELETE FROM transactions
        WHERE id = ?
        AND user_id = ?
        """,
        (
            transaction_id,
            user_id
        )
    )

    if cursor.rowcount == 0:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    connection.commit()
    connection.close()

    return {
        "message": "Transaction deleted successfully"
    }