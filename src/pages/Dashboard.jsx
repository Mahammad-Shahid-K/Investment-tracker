import {
  Wallet,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  BriefcaseBusiness,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function Dashboard({ investments }) {
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

  const bestInvestment = [...investments].sort(
    (a, b) => {
      const profitA =
        a.quantity *
        (a.currentPrice - a.buyPrice);

      const profitB =
        b.quantity *
        (b.currentPrice - b.buyPrice);

      return profitB - profitA;
    }
  )[0];

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h1>Good morning 👋</h1>
          <p>
            Here's your investment portfolio
            overview.
          </p>
        </div>

        <div className="portfolio-status">
          <span></span>
          Portfolio Active
        </div>
      </div>

      <div className="summary-grid">

        <div className="summary-card">
          <div className="card-top">
            <div className="card-icon">
              <Wallet size={21} />
            </div>

            <span className="card-label">
              INVESTED
            </span>
          </div>

          <p>Total Invested</p>

          <h2>
            ₹{totalInvested.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <div className="card-icon">
              <IndianRupee size={21} />
            </div>

            <span className="card-label">
              CURRENT
            </span>
          </div>

          <p>Current Value</p>

          <h2>
            ₹{currentValue.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <div className="card-icon">
              {profit >= 0 ? (
                <TrendingUp size={21} />
              ) : (
                <TrendingDown size={21} />
              )}
            </div>

            <span className="card-label">
              P/L
            </span>
          </div>

          <p>Total Profit/Loss</p>

          <h2
            className={
              profit >= 0
                ? "profit"
                : "loss"
            }
          >
            {profit >= 0 ? "+" : "-"}₹
            {Math.abs(profit).toLocaleString(
              "en-IN"
            )}
          </h2>
        </div>

        <div className="summary-card">
          <div className="card-top">
            <div className="card-icon">
              <BriefcaseBusiness size={21} />
            </div>

            <span className="card-label">
              RETURN
            </span>
          </div>

          <p>Total Return</p>

          <h2
            className={
              returnPercentage >= 0
                ? "profit"
                : "loss"
            }
          >
            {returnPercentage.toFixed(2)}%
          </h2>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="section-card">
          <div className="section-header">
            <div>
              <h2>Portfolio Holdings</h2>
              <p>
                Your current investment positions
              </p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Value</th>
                <th>P/L</th>
              </tr>
            </thead>

            <tbody>
              {investments.map((item) => {
                const invested =
                  item.quantity *
                  item.buyPrice;

                const value =
                  item.quantity *
                  item.currentPrice;

                const pnl = value - invested;

                return (
                  <tr key={item.id}>
                    <td>
                      <strong>
                        {item.assetName}
                      </strong>
                    </td>

                    <td>
                      <span className="asset-badge">
                        {item.assetType}
                      </span>
                    </td>

                    <td>{item.quantity}</td>

                    <td>
                      ₹
                      {value.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td
                      className={
                        pnl >= 0
                          ? "profit"
                          : "loss"
                      }
                    >
                      {pnl >= 0 ? "+" : "-"}₹
                      {Math.abs(pnl).toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="section-card performance-card">
          <div className="section-header">
            <h2>Portfolio Insight</h2>
            <p>Your strongest investment</p>
          </div>

          {bestInvestment ? (
            <>
              <div className="insight-icon">
                <TrendingUp size={30} />
              </div>

              <h2>
                {bestInvestment.assetName}
              </h2>

              <p>
                Best performing investment
              </p>

              <div className="insight-profit">
                +₹
                {(
                  bestInvestment.quantity *
                  (bestInvestment.currentPrice -
                    bestInvestment.buyPrice)
                ).toLocaleString("en-IN")}
              </div>

              <div className="insight-row">
                <span>Quantity</span>
                <strong>
                  {bestInvestment.quantity}
                </strong>
              </div>

              <div className="insight-row">
                <span>Current Price</span>
                <strong>
                  ₹
                  {bestInvestment.currentPrice.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </>
          ) : (
            <p>No investments available.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;