import React, { useState } from "react";
import LogoutModal from "../components/LogoutModal";

const Dashboard = ({ onLogout }) => {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="logo">Dashboard</h2>
        <button className="btn-danger" onClick={() => setShowLogout(true)}>
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <h1>Welcome Back 👋</h1>
        <p>This is your dashboard.</p>
      </div>

      {showLogout && (
        <LogoutModal
          onConfirm={() => {
            setShowLogout(false);
            onLogout();
          }}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
