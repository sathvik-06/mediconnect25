// src/components/common/Footer/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MediConnect</h3>
            <p>Your trusted healthcare platform for appointments, consultations, and pharmacy services.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li>Doctor Appointments</li>
              <li>Online Consultations</li>
              <li>Pharmacy Orders</li>
              <li>Medical Records</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 MediConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;