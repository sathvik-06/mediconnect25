// src/pages/Home/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ isAuthenticated, user }) => {
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
    <section className="hero-section">
      <div className="hero-content">
        <h1>Your Health, Our Priority</h1>
        <p>
          Book doctor appointments, consult online, and get medicines delivered - 
          all in one platform. Experience healthcare made simple and accessible.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to={getDashboardPath()} className="btn btn-primary btn-large">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="hero-image">
        <div className="placeholder-image">
          <span>Healthcare Illustration</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;