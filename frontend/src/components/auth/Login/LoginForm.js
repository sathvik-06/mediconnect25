// src/components/auth/Login/LoginForm.js
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-input"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="role" className="form-label">
          I am a
        </label>
        <select
          id="role"
          name="role"
          className="form-input"
          value={formData.role}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
      </div>

      <button
        type="submit"
        className="btn btn-primary login-btn"
        disabled={loading}
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;