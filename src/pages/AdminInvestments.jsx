import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import "./Admin.css";

function AdminInvestments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvestments = async () => {
      const { data, error: fetchError } = await supabase
        .from("investments")
        .select("id, user_id, name, category, quantity, invested_amount, current_value")
        .order("id", { ascending: true });

      if (fetchError) {
        console.error("Admin investments fetch error:", fetchError);
        setError("Unable to load investments. Please try again.");
      } else {
        setInvestments(data);
      }

      setLoading(false);
    };

    loadInvestments();
  }, []);

  return (
    <div>
      <div className="topbar">
        <h1>All Investments</h1>
        <p>View investments across the platform.</p>
      </div>

      {error && <p role="alert">{error}</p>}

      <div className="admin-table-card">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Invested</th>
              <th>Current Value</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading investments...</td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan="6">No investments found.</td>
              </tr>
            ) : (
              investments.map((investment) => (
                <tr key={investment.id}>
                  <td>{investment.name}</td>
                  <td>{investment.category}</td>
                  <td>{investment.quantity}</td>
                  <td>
                    ₹{Number(investment.invested_amount || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    ₹{Number(investment.current_value || 0).toLocaleString("en-IN")}
                  </td>
                  <td>{investment.user_id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminInvestments;
