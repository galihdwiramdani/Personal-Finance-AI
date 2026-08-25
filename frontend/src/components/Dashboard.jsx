import { useEffect, useState } from "react";
import API from "../api";

import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

function Dashboard({ user, onLogout }) {

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {

    try {

      setLoading(true);

      const response = await API.get(
        "/transactions/",
        {
          params: {
            user_id: user.id,
          },
        }
      );

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
  }, []);

  const handleDelete = async (transactionId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await API.delete(
        `/transactions/${transactionId}`,
        {
          params: {
            user_id: user.id,
          },
        }
      );

      fetchTransactions();

    } catch (error) {

      console.error(
        "Failed to delete transaction:",
        error
      );

    }
  };

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount) => {

    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(amount);

  };

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          Personal Finance AI
        </div>

        <div className="navbar-right">

          <span>
            Hi, {user.name} 👋
          </span>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN CONTENT */}

      <main className="dashboard-container">

        <div className="welcome-section">

          <div>

            <h1>
              Financial Dashboard
            </h1>

            <p>
              Here's your financial overview.
            </p>

          </div>

        </div>


        {/* STATISTICS */}

        <div className="stats-grid">

          <div className="stat-card balance-card">

            <span>
              Balance
            </span>

            <h2>
              {formatCurrency(balance)}
            </h2>

          </div>


          <div className="stat-card">

            <span>
              Income
            </span>

            <h2 className="income">
              {formatCurrency(totalIncome)}
            </h2>

          </div>


          <div className="stat-card">

            <span>
              Expense
            </span>

            <h2 className="expense">
              {formatCurrency(totalExpense)}
            </h2>

          </div>

        </div>


        {/* CONTENT */}

        <div className="dashboard-grid">

          <TransactionForm
            userId={user.id}
            onTransactionAdded={fetchTransactions}
          />

          {loading ? (

            <div className="card loading">
              Loading transactions...
            </div>

          ) : (

            <TransactionList
              transactions={transactions}
              onDelete={handleDelete}
            />

          )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;