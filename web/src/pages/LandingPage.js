import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";

const LandingPage = ({ onAuthStateChange }) => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (onAuthStateChange) {
      onAuthStateChange();
    }
    setTimeout(() => navigate("/dashboard"), 100);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    navigate("/register");
  };

  return (
    <div className="landing-container">
      <nav className="navbar">
        <h2 className="logo">MyApp</h2>
        <div className="navbar-buttons">
          <button className="btn-primary" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button className="btn-secondary" onClick={handleRegisterClick}>
            Register
          </button>
        </div>
      </nav>

      <div className="hero">
        <h1>Welcome to MyApp</h1>
        <p>A clean and professional React starter UI.</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button className="btn-secondary" onClick={handleRegisterClick}>
            Register Now
          </button>
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick}
        />
      )}
    </div>
  );
};

export default LandingPage;
