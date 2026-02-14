import React, { useState } from "react";

const LoginModal = ({ onClose, onLoginSuccess, onRegisterClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setError("Invalid username or password");
        } else if (response.status === 400) {
          setError(data.message || "Invalid input. Please check your credentials.");
        } else {
          setError(data.message || "Login failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      if (!data.token) {
        setError("Invalid response from server");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          username: data.username,
          email: data.email,
        })
      );

      onLoginSuccess();
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof TypeError) {
        setError("Cannot connect to server. Make sure the backend is running on http://localhost:8080");
      } else {
        setError("Connection error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    onClose();
    if (onRegisterClick) {
      onRegisterClick();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account yet? <button className="link-btn" onClick={handleRegister}>Register here</button></p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
