function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
}

function SummaryCards({
    balance,
    income,
    expense,
    transactionCount,
}) {

    return (
        <div className="summary-grid">

            <div className="summary-card">
                <h3>Balance</h3>

                <p className="summary-value">
                    {formatCurrency(balance)}
                </p>
            </div>


            <div className="summary-card">
                <h3>Total Income</h3>

                <p className="summary-value">
                    {formatCurrency(income)}
                </p>
            </div>


            <div className="summary-card">
                <h3>Total Expense</h3>

                <p className="summary-value">
                    {formatCurrency(expense)}
                </p>
            </div>


            <div className="summary-card">
                <h3>Transactions</h3>

                <p className="summary-value">
                    {transactionCount}
                </p>
            </div>

        </div>
    );
}

export default SummaryCards;