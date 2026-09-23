import { useEffect, useState } from "react";
import API from "../api";

import SummaryCards from "./SummaryCards";
import FinancialChart from "./FinancialChart";
import CategoryChart from "./CategoryChart";
import MonthlyChart from "./MonthlyChart";
import FinancialInsights from "./FinancialInsights";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import ExpensePrediction from "./ExpensePrediction";
import FinancialRecommendation from "./FinancialRecommendation";

function Dashboard() {

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    const userId = user?.id;

    const fetchTransactions = async () => {

        if (!userId) {
            console.error("User ID not found");
            setLoading(false);
            return;
        }

        try {
            const response = await API.get("/transactions/", {
                params: {
                    user_id: userId
                }
            });

            setTransactions(response.data);

        } catch (error) {
            console.error(
                "Failed to fetch transactions:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [userId]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const handleDelete = async (transactionId) => {
        try {
            // Tambahkan params user_id di sini
            await API.delete(`/transactions/${transactionId}`, {
                params: {
                    user_id: userId
                }
            });
            
            fetchTransactions(); 
        } catch (error) {
            console.error("Failed to delete transaction:", error);
            alert("Gagal menghapus transaksi");
        }
    };

    const income = transactions
        .filter(transaction => transaction.type === "income")
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const expense = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const balance = income - expense;

    const transactionCount = transactions.length;

    if (loading) {
        return (
            <div className="dashboard">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <>
            <nav className="navbar">
                <div className="logo">Personal Finance AI</div>

                <div className="navbar-right">
                    <span>👤 {user?.name || "User"}</span>

                    <button
                        className="logout-button"
                        onClick={() => {
                            localStorage.removeItem("user");
                            window.location.reload();
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

        <div className="dashboard">

            <header className="welcome-section">
                    <h1>{getGreeting()} 👋</h1>
                    <p>Here's your financial overview</p>
                </header>

            <SummaryCards
                balance={balance}
                income={income}
                expense={expense}
                transactionCount = {transactionCount}
            />

            <ExpensePrediction />

            <FinancialRecommendation />

            <div className="charts-grid">

                <FinancialChart
                    income={income}
                    expense={expense}
                />

                <CategoryChart
                    transactions={transactions}
                />

                <div className="monthly-chart">

                    <MonthlyChart
                        transactions={transactions}
                    />

                </div>

            </div>

            <FinancialInsights
                transactions={transactions}
                income={income}
                expense={expense}
                balance={balance}
            />


            <div className="transaction-section">

                <h2>Add Transaction</h2>

                <TransactionForm
                    userId={userId}
                    onTransactionAdded={fetchTransactions}
                />
            </div>


            <div className="transaction-section">

                <h2>Recent Transactions</h2>

                <TransactionList
                    transactions={transactions}
                    onDelete={handleDelete}
                />

            </div>

        </div>
        </>
    );
}

export default Dashboard;