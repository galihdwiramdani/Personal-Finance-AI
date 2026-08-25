from fastapi import APIRouter, HTTPException
from models.schemas import UserRegister, UserLogin
from database import get_connection


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(user: UserRegister):

    connection = get_connection()
    cursor = connection.cursor()

    # Check existing email
    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (user.email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Insert user
    cursor.execute(
        """
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
        """,
        (
            user.name,
            user.email,
            user.password
        )
    )

    connection.commit()

    user_id = cursor.lastrowid

    connection.close()

    return {
        "message": "User registered successfully",
        "user_id": user_id
    }

@router.post("/login")
def login(user: UserLogin):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT id, name, email
        FROM users
        WHERE email = ? AND password = ?
        """,
        (
            user.email,
            user.password
        )
    )

    existing_user = cursor.fetchone()

    connection.close()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user": {
            "id": existing_user["id"],
            "name": existing_user["name"],
            "email": existing_user["email"]
        }
    }