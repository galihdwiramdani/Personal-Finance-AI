function FinancialInsights({ transactions, income, expense, balance }) {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="card insights-card">
                <h2>Financial Insights</h2>
                <p>
                    Add some transactions to get financial insights.
                </p>
            </div>
        );
    }

    // =========================
    // CATEGORY EXPENSE ANALYSIS
    // =========================

    const categoryExpenses = {};

    transactions
        .filter(transaction => transaction.type === "expense")
        .forEach(transaction => {
            const category = transaction.category;

            if (!categoryExpenses[category]) {
                categoryExpenses[category] = 0;
            }

            categoryExpenses[category] += Number(transaction.amount);
        });

    const categoryEntries = Object.entries(categoryExpenses);

    categoryEntries.sort((a, b) => b[1] - a[1]);

    const topCategory = categoryEntries[0];

    // =========================
    // FINANCIAL STATUS
    // =========================

    let status = "";
    let recommendation = "";

    if (balance < 0) {
        status = "⚠️ Financial Warning";

        recommendation =
            "Your expenses are higher than your income. Try reducing unnecessary spending and prioritize essential expenses.";
    } else if (expense > income * 0.8) {
        status = "⚠️ High Spending";

        recommendation =
            "Your expenses are taking a large portion of your income. Consider reducing non-essential spending.";
    } else if (expense > income * 0.5) {
        status = "💡 Moderate Spending";

        recommendation =
            "Your financial condition is relatively stable, but there is still room to increase your savings.";
    } else {
        status = "✅ Healthy Financial Condition";

        recommendation =
            "Your expenses are well controlled compared to your income. Keep maintaining this spending habit.";
    }

    // =========================
    // TOP CATEGORY
    // =========================

    let categoryInsight = "";

    if (topCategory) {
        const [category, amount] = topCategory;

        const percentage =
            expense > 0
                ? ((amount / expense) * 100).toFixed(1)
                : 0;

        categoryInsight =
            `Your largest expense category is ${category}, `
            + `accounting for ${percentage}% of your total expenses.`;
    }

    return (
        <div className="card insights-card">

            <h2>🤖 Financial Insights</h2>

            <div className="insight-status">
                <h3>{status}</h3>
            </div>

            <div className="insight-item">
                <strong>📊 Spending Analysis</strong>

                <p>
                    {categoryInsight}
                </p>
            </div>

            <div className="insight-item">
                <strong>💡 Recommendation</strong>

                <p>
                    {recommendation}
                </p>
            </div>

        </div>
    );
}

export default FinancialInsights;