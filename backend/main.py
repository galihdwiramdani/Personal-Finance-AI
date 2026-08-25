from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.transactions import router as transaction_router


app = FastAPI(
    title="Personal Finance AI API",
    description="Backend API for Personal Finance AI",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(transaction_router)


@app.get("/")
def root():
    return {
        "message": "Personal Finance AI API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }