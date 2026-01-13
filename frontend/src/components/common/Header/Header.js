// src/components/common/Header/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationBell from '../NotificationBell/NotificationBell';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'patient': return '/patient/dashboard';
      case 'doctor': return '/doctor/dashboard';
      case 'pharmacist': return '/pharmacy/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h2>MediConnect</h2>
        </Link>

        <nav className="navigation">
          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} className="nav-link">
                Dashboard
              </Link>
              {user.role === 'patient' && (
                <Link to="/patient/doctors" className="nav-link">
                  Find Doctors
                </Link>
              )}
              <NotificationBell />
              <div className="user-menu">
                <span className="user-name">Hello, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;