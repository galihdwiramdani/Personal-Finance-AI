import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";


function FinancialChart({ income, expense }) {

    const data = [
        {
            name: "Finance",
            Income: income,
            Expense: expense
        }
    ];


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
                    Income vs Expense
                </h2>

                <p>
                    Overview of your financial activity
                </p>

            </div>


            <div className="chart-container">

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <BarChart
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
                            dataKey="name"
                        />

                        <YAxis />

                        <Tooltip
                            formatter={(value) =>
                                formatCurrency(value)
                            }
                        />

                        <Legend />

                        <Bar
                            dataKey="Income"
                            name="Income"
                            fill="#22c55e"
                            radius={[6, 6, 0, 0]}
                        />

                        <Bar
                            dataKey="Expense"
                            name="Expense"
                            fill="#ef4444"
                            radius={[6, 6, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    );
}


export default FinancialChart;