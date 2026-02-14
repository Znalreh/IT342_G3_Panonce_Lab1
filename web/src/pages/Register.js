import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Register = ({ onAuthStateChange }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError('');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setError(data.message || 'Registration failed. Please check your input.');
        } else if (response.status === 409) {
          setError('Username or email already exists. Please try another.');
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (!data.token) {
        setError('Invalid response from server');
        setLoading(false);
        return;
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        username: data.username,
        email: data.email
      }));

      // Navigate to dashboard
      if (onAuthStateChange) {
        onAuthStateChange();
      }
      setTimeout(() => navigate('/dashboard'), 100);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof TypeError) {
        setError('Cannot connect to server. Make sure the backend is running on http://localhost:8080');
      } else {
        setError('Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <button className="link-btn" onClick={handleBackClick}>Login here</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
