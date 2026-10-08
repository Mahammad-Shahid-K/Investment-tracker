import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";

import { supabase } from "./lib/supabase.js";

import "./App.css";

function App() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load investments from Supabase
  const fetchInvestments = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      alert("Unable to load investments from Supabase.");
      setLoading(false);
      return;
    }

    // Convert database names to the format used by React
    const formattedData = data.map((item) => ({
      id: item.id,
      assetName: item.name,
      assetType: item.category,
      quantity: Number(item.quantity || 0),
      buyPrice: Number(item.buy_price || 0),
      currentPrice: Number(item.current_price || 0),
      investedAmount: Number(item.invested_amount || 0),
      currentValue: Number(item.current_value || 0),
      purchaseDate: item.purchase_date,
    }));

    setInvestments(formattedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // Add investment
  const addInvestment = async (investment) => {
    const quantity = Number(investment.quantity);
    const buyPrice = Number(investment.buyPrice);
    const currentPrice = Number(investment.currentPrice);

    const investedAmount = quantity * buyPrice;
    const currentValue = quantity * currentPrice;

    const { data, error } = await supabase
      .from("investments")
      .insert([
        {
          name: investment.assetName,
          category: investment.assetType,
          quantity,
          buy_price: buyPrice,
          current_price: currentPrice,
          invested_amount: investedAmount,
          current_value: currentValue,
          purchase_date:
            investment.purchaseDate ||
            new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      alert(`Failed to add investment: ${error.message}`);
      return;
    }

    const newInvestment = {
      id: data.id,
      assetName: data.name,
      assetType: data.category,
      quantity: Number(data.quantity),
      buyPrice: Number(data.buy_price),
      currentPrice: Number(data.current_price),
      investedAmount: Number(data.invested_amount),
      currentValue: Number(data.current_value),
      purchaseDate: data.purchase_date,
    };

    setInvestments((prev) => [...prev, newInvestment]);
  };

  // Delete investment
  const deleteInvestment = async (id) => {
    const { error } = await supabase
      .from("investments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      alert(`Failed to delete investment: ${error.message}`);
      return;
    }

    setInvestments((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // Update investment
  const updateInvestment = async (investment) => {
    const quantity = Number(investment.quantity);
    const buyPrice = Number(investment.buyPrice);
    const currentPrice = Number(investment.currentPrice);

    const investedAmount = quantity * buyPrice;
    const currentValue = quantity * currentPrice;

    const { data, error } = await supabase
      .from("investments")
      .update({
        name: investment.assetName,
        category: investment.assetType,
        quantity,
        buy_price: buyPrice,
        current_price: currentPrice,
        invested_amount: investedAmount,
        current_value: currentValue,
        purchase_date:
          investment.purchaseDate ||
          new Date().toISOString().split("T")[0],
      })
      .eq("id", investment.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      alert(`Failed to update investment: ${error.message}`);
      return;
    }

    const updatedInvestment = {
      id: data.id,
      assetName: data.name,
      assetType: data.category,
      quantity: Number(data.quantity),
      buyPrice: Number(data.buy_price),
      currentPrice: Number(data.current_price),
      investedAmount: Number(data.invested_amount),
      currentValue: Number(data.current_value),
      purchaseDate: data.purchase_date,
    };

    setInvestments((prev) =>
      prev.map((item) =>
        item.id === updatedInvestment.id
          ? updatedInvestment
          : item
      )
    );
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main-content">
          {loading ? (
            <div className="loading-screen">
              <h2>Loading portfolio...</h2>
              <p>Connecting to Supabase</p>
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    investments={investments}
                  />
                }
              />

              <Route
                path="/portfolio"
                element={
                  <Portfolio
                    investments={investments}
                    onAdd={addInvestment}
                    onDelete={deleteInvestment}
                    onUpdate={updateInvestment}
                  />
                }
              />

              <Route
                path="/analytics"
                element={
                  <Analytics
                    investments={investments}
                  />
                }
              />

              <Route
                path="/settings"
                element={<Settings />}
              />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;