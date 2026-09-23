import { useEffect, useState } from "react";
import API from "../api";

function FinancialRecommendation() {

    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchRecommendation = async () => {

            try {

                const storedUser =
                    localStorage.getItem("user");

                if (!storedUser) {
                    setError("User not found.");
                    return;
                }

                const user = JSON.parse(storedUser);

                const response = await API.get(
                    "/ml/recommendation",
                    {
                        params: {
                            user_id: user.id
                        }
                    }
                );

                if (response.data.success) {

                    setRecommendations(
                        response.data.recommendations
                    );

                } else {

                    setError(
                        "Recommendation unavailable."
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to fetch recommendation:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load recommendation."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchRecommendation();

    }, []);

    if (loading) {

        return (
            <div className="card recommendation-card">
                <h2>💡 AI Financial Recommendation</h2>
                <p>
                    Analyzing your financial behavior...
                </p>
            </div>
        );

    }

    if (error) {

        return (
            <div className="card recommendation-card">
                <h2>💡 AI Financial Recommendation</h2>

                <p className="error-message">
                    {error}
                </p>
            </div>
        );

    }

    return (
        <div className="card recommendation-card">

            <h2>
                💡 AI Financial Recommendation
            </h2>

            <div className="recommendation-list">

                {recommendations.map(
                    (recommendation, index) => (

                        <div
                            className="recommendation-item"
                            key={index}
                        >

                            <span className="recommendation-icon">
                                💡
                            </span>

                            <p>
                                {recommendation}
                            </p>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}

export default FinancialRecommendation;