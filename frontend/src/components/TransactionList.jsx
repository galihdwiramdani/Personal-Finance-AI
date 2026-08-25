function TransactionList({
  transactions,
  onDelete,
}) {

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
    <div className="card">

      <div className="section-header">

        <h2>Transactions</h2>

        <span>
          {transactions.length} transactions
        </span>

      </div>

      {transactions.length === 0 ? (

        <div className="empty-state">
          <p>No transactions yet.</p>

          <span>
            Add your first transaction above.
          </span>
        </div>

      ) : (

        <div className="transaction-list">

          {transactions.map((transaction) => (

            <div
              className="transaction-item"
              key={transaction.id}
            >

              <div className="transaction-info">

                <div className="transaction-icon">
                  {transaction.type === "income"
                    ? "↑"
                    : "↓"}
                </div>

                <div>

                  <h3>
                    {transaction.category}
                  </h3>

                  <p>
                    {transaction.description ||
                      "No description"}
                  </p>

                  <small>
                    {transaction.date}
                  </small>

                </div>

              </div>

              <div className="transaction-right">

                <strong
                  className={
                    transaction.type === "income"
                      ? "income"
                      : "expense"
                  }
                >
                  {transaction.type === "income"
                    ? "+"
                    : "-"}
                  {formatCurrency(transaction.amount)}
                </strong>

                <button
                  className="delete-button"
                  onClick={() =>
                    onDelete(transaction.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default TransactionList;