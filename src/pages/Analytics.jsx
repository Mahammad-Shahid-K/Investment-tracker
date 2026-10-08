import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Analytics({ investments }) {
  const totalInvested = investments.reduce(
    (sum, item) =>
      sum + item.quantity * item.buyPrice,
    0
  );

  const currentValue = investments.reduce(
    (sum, item) =>
      sum + item.quantity * item.currentPrice,
    0
  );

  const profit = currentValue - totalInvested;

  const returnPercentage =
    totalInvested > 0
      ? (profit / totalInvested) * 100
      : 0;

  // Asset allocation
  const allocation = {};

  investments.forEach((item) => {
    const value =
      item.quantity * item.currentPrice;

    allocation[item.assetType] =
      (allocation[item.assetType] || 0) + value;
  });

  const pieData = Object.entries(allocation).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Investment comparison
  const barData = investments.map((item) => ({
    name: item.assetName,
    invested:
      item.quantity * item.buyPrice,
    current:
      item.quantity * item.currentPrice,
  }));

  return (
    <div>
      <div className="topbar">
        <h1>Analytics</h1>
        <p>
          Analyze your investment portfolio
          performance.
        </p>
      </div>

      {/* Summary */}
      <div className="analytics-summary">
        <div className="analytics-stat">
          <span>Total Invested</span>
          <strong>
            ₹{totalInvested.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="analytics-stat">
          <span>Current Value</span>
          <strong>
            ₹{currentValue.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="analytics-stat">
          <span>Profit / Loss</span>
          <strong
            className={
              profit >= 0 ? "profit" : "loss"
            }
          >
            {profit >= 0 ? "+" : "-"}₹
            {Math.abs(profit).toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>

        <div className="analytics-stat">
          <span>Total Return</span>
          <strong
            className={
              returnPercentage >= 0
                ? "profit"
                : "loss"
            }
          >
            {returnPercentage.toFixed(2)}%
          </strong>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">

        {/* Pie Chart */}
        <div className="section-card chart-card">
          <h2>Asset Allocation</h2>
          <p className="chart-description">
            Distribution of your current portfolio
          </p>

          {pieData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${index * 70 + 200}, 70%, 55%)`}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No investment data available.</p>
          )}
        </div>

        {/* Bar Chart */}
        <div className="section-card chart-card">
          <h2>Investment Performance</h2>
          <p className="chart-description">
            Invested amount vs current value
          </p>

          {barData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString(
                      "en-IN"
                    )}`
                  }
                />

                <Legend />

                <Bar
                  dataKey="invested"
                  name="Invested"
                />

                <Bar
                  dataKey="current"
                  name="Current Value"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No investment data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;