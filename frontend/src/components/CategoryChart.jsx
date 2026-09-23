import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


function CategoryChart({ transactions }) {

    const categoryTotals = {};

    transactions
        .filter(
            transaction =>
                transaction.type === "expense"
        )
        .forEach(transaction => {

            const category = transaction.category;

            const amount = Number(
                transaction.amount
            );

            if (categoryTotals[category]) {

                categoryTotals[category] += amount;

            } else {

                categoryTotals[category] = amount;

            }

        });


    const data = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            name: category,
            value: amount
        }))
        .sort((a, b) => b.value - a.value);


    const formatCurrency = (value) => {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(value);

    };


    return (

        <div className="chart-card">

            <div className="chart-header">

                <h2>
                    Expense by Category
                </h2>

                <p>
                    Where your money is being spent
                </p>

            </div>


            {data.length === 0 ? (

                <div className="empty-chart">

                    <p>
                        No expense data available.
                    </p>

                </div>

            ) : (

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={300}
                    >

                        <PieChart>

                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={3}
                            >

                                {data.map(
                                    (entry, index) => (

                                        <Cell
                                            key={
                                                `cell-${index}`
                                            }
                                        />

                                    )
                                )}

                            </Pie>


                            <Tooltip
                                formatter={(value) =>
                                    formatCurrency(value)
                                }
                            />


                            <Legend />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            )}

        </div>

    );
}


export default CategoryChart;