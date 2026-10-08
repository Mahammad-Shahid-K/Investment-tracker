import { useState } from "react";
import { X } from "lucide-react";

function InvestmentForm({ onAdd, onClose, editingInvestment }) {
  const [form, setForm] = useState(
    editingInvestment || {
      assetName: "",
      assetType: "Stock",
      quantity: "",
      buyPrice: "",
      currentPrice: "",
    }
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.assetName ||
      !form.quantity ||
      !form.buyPrice ||
      !form.currentPrice
    ) {
      alert("Please fill all fields.");
      return;
    }

    onAdd({
      ...form,
      id: form.id || Date.now(),
      quantity: Number(form.quantity),
      buyPrice: Number(form.buyPrice),
      currentPrice: Number(form.currentPrice),
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="investment-form">
        <div className="form-header">
          <div>
            <h2>
              {editingInvestment
                ? "Edit Investment"
                : "Add Investment"}
            </h2>
            <p>Enter your investment details</p>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Asset Name</label>
          <input
            name="assetName"
            placeholder="Example: TCS"
            value={form.assetName}
            onChange={handleChange}
          />

          <label>Asset Type</label>
          <select
            name="assetType"
            value={form.assetType}
            onChange={handleChange}
          >
            <option>Stock</option>
            <option>ETF</option>
            <option>Mutual Fund</option>
            <option>Crypto</option>
            <option>Bond</option>
          </select>

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            placeholder="10"
            value={form.quantity}
            onChange={handleChange}
          />

          <label>Buy Price</label>
          <input
            type="number"
            name="buyPrice"
            placeholder="3200"
            value={form.buyPrice}
            onChange={handleChange}
          />

          <label>Current Price</label>
          <input
            type="number"
            name="currentPrice"
            placeholder="3450"
            value={form.currentPrice}
            onChange={handleChange}
          />

          <button className="add-btn" type="submit">
            {editingInvestment
              ? "Update Investment"
              : "Add Investment"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InvestmentForm;