from fastapi import APIRouter

from ml.predictor import predict_next_expense


router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"]
)


@router.get("/predict-expense")
def predict_expense(user_id: int):

    return predict_next_expense(user_id)