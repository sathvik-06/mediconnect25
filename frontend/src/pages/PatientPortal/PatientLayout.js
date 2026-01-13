// src/pages/PatientPortal/PatientLayout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './PatientLayout.css';

const PatientLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/patient/doctors', label: 'Find Doctors', icon: '👨‍⚕️' },
    { path: '/patient/medical-history', label: 'Medical History', icon: '📋' },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: '💊' },
    { path: '/patient/pharmacy', label: 'Pharmacy Store', icon: '🏪' },
    { path: '/patient/orders', label: 'My Orders', icon: '📦' },
    { path: '/patient/notifications', label: 'Notifications', icon: '🔔' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="patient-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>MediConnect</h3>
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <div>
              <p className="user-name">{user?.name}</p>
              <p className="user-role">Patient</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="patient-main">
        {children}
      </main>
    </div>
  );
};

export default PatientLayout;