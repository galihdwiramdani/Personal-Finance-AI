import { useState } from "react";
import API from "../api";

function TransactionForm({ userId, onTransactionAdded }) {

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setLoading(true);

    try {

      await API.post(
        "/transactions/",
        {
          amount: Number(amount),
          type,
          category,
          description,
          date,
        },
        {
          params: {
            user_id: userId,
          },
        }
      );

      setAmount("");
      setDescription("");

      onTransactionAdded();

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to create transaction"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">

      <h2>Add Transaction</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">

          <label>Amount</label>

          <input
            type="number"
            placeholder="25000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

        </div>

        <div className="form-group">

          <label>Type</label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >

            <option value="expense">
              Expense
            </option>

            <option value="income">
              Income
            </option>

          </select>

        </div>

        <div className="form-group">

          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Education</option>
            <option>Health</option>
            <option>Entertainment</option>
            <option>Bills</option>
            <option>Salary</option>
            <option>Other</option>

          </select>

        </div>

        <div className="form-group">

          <label>Description</label>

          <input
            type="text"
            placeholder="Example: Lunch"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

        </div>

        <div className="form-group">

          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

        </div>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Add Transaction"}
        </button>

      </form>

    </div>
  );
}

export default TransactionForm;