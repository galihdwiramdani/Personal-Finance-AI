import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


function MonthlyChart({ transactions }) {

    const monthlyData = {};


    transactions.forEach((transaction) => {

        if (!transaction.date) {
            return;
        }

        const date = new Date(transaction.date);

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const key = `${year}-${month}`;


        if (!monthlyData[key]) {

            monthlyData[key] = {
                month: key,
                income: 0,
                expense: 0
            };

        }


        const amount = Number(
            transaction.amount
        );


        if (transaction.type === "income") {

            monthlyData[key].income += amount;

        }


        if (transaction.type === "expense") {

            monthlyData[key].expense += amount;

        }

    });


    const data = Object.values(monthlyData)
        .sort((a, b) =>
            a.month.localeCompare(b.month)
        )
        .map((item) => ({

            ...item,

            label: formatMonth(item.month)

        }));


    function formatMonth(month) {

        const [year, monthNumber] =
            month.split("-");


        const date = new Date(
            Number(year),
            Number(monthNumber) - 1
        );


        return date.toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric"
            }
        );

    }


    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0
            }
        ).format(value);

    };


    return (

        <div className="chart-card">

            <div className="chart-header">

                <h2>
                    Monthly Financial Overview
                </h2>

                <p>
                    Track your income and expenses
                    over time
                </p>

            </div>


            {data.length === 0 ? (

                <div className="empty-chart">

                    <p>
                        No monthly data available.
                    </p>

                </div>

            ) : (

                <div className="chart-container">

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <LineChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 20,
                                bottom: 20
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="label"
                            />

                            <YAxis />

                            <Tooltip
                                formatter={(value) =>
                                    formatCurrency(value)
                                }
                            />

                            <Legend />


                            <Line
                                type="monotone"
                                dataKey="income"
                                name="Income"
                                stroke="#22c55e"
                                strokeWidth={3}
                                dot={{
                                    r: 5
                                }}
                            />


                            <Line
                                type="monotone"
                                dataKey="expense"
                                name="Expense"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{
                                    r: 5
                                }}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            )}

        </div>

    );

}


export default MonthlyChart;