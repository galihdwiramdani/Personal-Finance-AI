from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional


# =========================
# USER
# =========================

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# TRANSACTION
# =========================

class TransactionCreate(BaseModel):
    amount: float
    type: str
    category: str
    description: Optional[str] = None
    date: date


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    amount: float
    type: str
    category: str
    description: Optional[str]
    date: str