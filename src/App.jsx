import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoutes.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminInvestments from "./pages/AdminInvestments.jsx";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { supabase } from "./lib/supabase.js";

import "./App.css";

function AppLayout() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

function UserApp() {
  const { user } = useAuth();

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    if (!user?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      setLoading(false);
      return;
    }

    setInvestments(
      data.map((item) => ({
        id: item.id,
        assetName: item.name,
        assetType: item.category,
        quantity: Number(item.quantity || 0),
        buyPrice: Number(item.buy_price || 0),
        currentPrice: Number(item.current_price || 0),
        investedAmount: Number(item.invested_amount || 0),
        currentValue: Number(item.current_value || 0),
        purchaseDate: item.purchase_date,
      }))
    );

    setLoading(false);
  };

  useEffect(() => {
    fetchInvestments();
  }, [user?.id]);

  const addInvestment = async (investment) => {
    const quantity = Number(investment.quantity);
    const buyPrice = Number(investment.buyPrice);
    const currentPrice = Number(investment.currentPrice);

    const { data, error } = await supabase
      .from("investments")
      .insert({
        user_id: user.id,
        name: investment.assetName,
        category: investment.assetType,
        quantity,
        buy_price: buyPrice,
        current_price: currentPrice,
        invested_amount: quantity * buyPrice,
        current_value: quantity * currentPrice,
        purchase_date:
          investment.purchaseDate ||
          new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      alert(`Failed to add investment: ${error.message}`);
      return;
    }

    setInvestments((prev) => [
      ...prev,
      {
        id: data.id,
        assetName: data.name,
        assetType: data.category,
        quantity: Number(data.quantity),
        buyPrice: Number(data.buy_price),
        currentPrice: Number(data.current_price),
        investedAmount: Number(data.invested_amount),
        currentValue: Number(data.current_value),
        purchaseDate: data.purchase_date,
      },
    ]);
  };

  const deleteInvestment = async (id) => {
    const { error } = await supabase
      .from("investments")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      alert(`Failed to delete investment: ${error.message}`);
      return;
    }

    setInvestments((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const updateInvestment = async (investment) => {
    const quantity = Number(investment.quantity);
    const buyPrice = Number(investment.buyPrice);
    const currentPrice = Number(investment.currentPrice);

    const { data, error } = await supabase
      .from("investments")
      .update({
        name: investment.assetName,
        category: investment.assetType,
        quantity,
        buy_price: buyPrice,
        current_price: currentPrice,
        invested_amount: quantity * buyPrice,
        current_value: quantity * currentPrice,
        purchase_date:
          investment.purchaseDate ||
          new Date().toISOString().split("T")[0],
      })
      .eq("id", investment.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      alert(`Failed to update investment: ${error.message}`);
      return;
    }

    setInvestments((prev) =>
      prev.map((item) =>
        item.id === data.id
          ? {
              id: data.id,
              assetName: data.name,
              assetType: data.category,
              quantity: Number(data.quantity),
              buyPrice: Number(data.buy_price),
              currentPrice: Number(data.current_price),
              investedAmount: Number(data.invested_amount),
              currentValue: Number(data.current_value),
              purchaseDate: data.purchase_date,
            }
          : item
      )
    );
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading portfolio...</h2>
        <p>Connecting to your account</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard investments={investments} />}
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
        element={<Analytics investments={investments} />}
      />

      <Route
        path="/settings"
        element={
          <Settings
            investments={investments}
            onClear={fetchInvestments}
          />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Routes>

          {/* Public Authentication */}
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* Protected Application */}
          <Route element={<ProtectedRoute />}>

            <Route element={<AppLayout />}>

              <Route
                path="/*"
                element={<UserApp />}
              />

              {/* Admin */}
              <Route element={<AdminRoute />}>

                <Route
                  path="/admin"
                  element={<AdminDashboard />}
                />

                <Route
                  path="/admin/users"
                  element={<AdminUsers />}
                />

                <Route
                  path="/admin/investments"
                  element={<AdminInvestments />}
                />

              </Route>

            </Route>

          </Route>

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;