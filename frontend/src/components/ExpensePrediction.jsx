import { useEffect, useState } from "react";
import API from "../api";

function ExpensePrediction() {

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchPrediction = async () => {

            try {

                const storedUser =
                    localStorage.getItem("user");

                if (!storedUser) {
                    setError("User not found.");
                    return;
                }

                const user = JSON.parse(storedUser);

                const response = await API.get(
                    "/ml/predict-expense",
                    {
                        params: {
                            user_id: user.id
                        }
                    }
                );

                if (response.data.success) {

                    setPrediction(
                        response.data.predicted_expense
                    );

                } else {

                    setError(
                        response.data.message ||
                        "Prediction unavailable."
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to fetch prediction:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load AI prediction."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchPrediction();

    }, []);

    if (loading) {
        return (
            <div className="card prediction-card">
                <h2>🤖 AI Expense Prediction</h2>
                <p>Analyzing your financial data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card prediction-card">
                <h2>🤖 AI Expense Prediction</h2>
                <p className="error-message">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="card prediction-card">

            <h2>🤖 AI Expense Prediction</h2>

            <p className="prediction-label">
                Predicted Expense
            </p>

            <h1 className="prediction-value">
                Rp{" "}
                {Number(prediction).toLocaleString(
                    "id-ID"
                )}
            </h1>

            <p className="prediction-description">
                Based on your transaction patterns
            </p>

        </div>
    );
}

export default ExpensePrediction;