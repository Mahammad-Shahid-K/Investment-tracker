import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

import InvestmentForm from "../components/InvestmentForm.jsx";

function Portfolio({
  investments,
  onAdd,
  onDelete,
  onUpdate,
}) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] =
    useState(null);

  const filtered = investments.filter((item) =>
    item.assetName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSave = (investment) => {
    if (editingInvestment) {
      onUpdate(investment);
    } else {
      onAdd(investment);
    }

    setEditingInvestment(null);
  };

  const handleEdit = (item) => {
    setEditingInvestment(item);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingInvestment(null);
  };

  return (
    <div>
      <div className="topbar">
        <h1>My Portfolio</h1>
        <p>Manage all your investments.</p>
      </div>

      <div className="section-card toolbar-card">
        <div className="portfolio-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              placeholder="Search investments..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <button
            className="add-btn-small"
            onClick={() => {
              setEditingInvestment(null);
              setShowForm(true);
            }}
          >
            <Plus size={18} />
            Add Investment
          </button>
        </div>
      </div>

      <div className="section-card">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>P/L</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => {
              const invested =
                item.quantity * item.buyPrice;

              const value =
                item.quantity * item.currentPrice;

              const pnl = value - invested;

              return (
                <tr key={item.id}>
                  <td>
                    <strong>{item.assetName}</strong>
                  </td>

                  <td>{item.assetType}</td>

                  <td>{item.quantity}</td>

                  <td>
                    ₹{item.buyPrice.toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹{item.currentPrice.toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td
                    className={
                      pnl >= 0 ? "profit" : "loss"
                    }
                  >
                    {pnl >= 0 ? "+" : "-"}₹
                    {Math.abs(pnl).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() =>
                        handleEdit(item)
                      }
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="icon-btn delete"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Delete this investment?"
                          )
                        ) {
                          onDelete(item.id);
                        }
                      }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            No investments found.
          </div>
        )}
      </div>

      {showForm && (
        <InvestmentForm
          onAdd={handleSave}
          onClose={handleClose}
          editingInvestment={editingInvestment}
        />
      )}
    </div>
  );
}

export default Portfolio;