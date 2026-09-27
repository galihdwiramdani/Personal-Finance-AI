import { useEffect, useState } from "react";

import API from "../api";

function AnomalyDetection({ transactions }) {
    const [anomalies, setAnomalies] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnomalies = async () => {
            try {
                const storedSession = localStorage.getItem("session");

                if (!storedSession) {
                    setError("User session not found.");
                    return;
                }

                const session = JSON.parse(storedSession);
                const user = session.user;

                if (!user?.id) {
                    setError("User not found.");
                    return;
                }

                const response = await API.get(
                    "/ml/anomalies",
                    {
                        params: {
                            user_id: user.id
                        }
                    }
                );

                if (response.data.success) {
                    setAnomalies(
                        response.data.anomalies || []
                    );

                    setMessage(
                        response.data.message || ""
                    );
                } else {
                    setError(
                        response.data.message ||
                        "Anomaly detection unavailable."
                    );
                }

            } catch (error) {
                console.error(
                    "Failed to fetch anomalies:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load anomaly detection."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnomalies();
    }, [transactions]);

    if (loading) {
        return (
            <div className="card anomaly-card">
                <h2>🔍 AI Spending Anomaly Detection</h2>

                <p>
                    Analyzing your spending patterns...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card anomaly-card">
                <h2>🔍 AI Spending Anomaly Detection</h2>

                <p className="error-message">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="card anomaly-card">

            <div className="anomaly-header">
                <div>
                    <h2>
                        🔍 AI Spending Anomaly Detection
                    </h2>

                    <p className="anomaly-description">
                        Transactions that differ significantly
                        from your usual spending pattern.
                    </p>
                </div>

                {anomalies.length > 0 && (
                    <span className="anomaly-count">
                        {anomalies.length} detected
                    </span>
                )}
            </div>

            {message === "Not enough transaction data for anomaly detection." ? (
                <div className="no-anomaly">
                    <div className="no-anomaly-icon">
                        ℹ️
                    </div>

                    <div>
                        <h3>
                            Not enough transaction data
                        </h3>

                        <p>
                            Add at least 5 expense transactions
                            to enable AI anomaly detection.
                        </p>
                    </div>
                </div>

            ) : anomalies.length === 0 ? (
                <div className="no-anomaly">
                    <div className="no-anomaly-icon">
                        ✓
                    </div>

                    <div>
                        <h3>
                            No unusual transactions detected
                        </h3>

                        <p>
                            {message ||
                                "Your spending pattern currently looks normal."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="anomaly-list">

                    {anomalies.map((anomaly) => (
                        <div
                            className="anomaly-item"
                            key={anomaly.id}
                        >

                            <div className="anomaly-icon">
                                ⚠️
                            </div>

                            <div className="anomaly-info">

                                <div className="anomaly-title-row">

                                    <h3>
                                        {anomaly.category ||
                                            "Uncategorized"}
                                    </h3>

                                    <strong>
                                        Rp{" "}
                                        {Number(
                                            anomaly.amount
                                        ).toLocaleString(
                                            "id-ID"
                                        )}
                                    </strong>

                                </div>

                                <p>
                                    {anomaly.description ||
                                        "No description"}
                                </p>

                                <small>
                                    {anomaly.date}
                                </small>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default AnomalyDetection;