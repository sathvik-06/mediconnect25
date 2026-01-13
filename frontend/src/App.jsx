// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Components
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import PatientPortal from './pages/PatientPortal/PatientPortal';
import DoctorPortal from './pages/DoctorPortal/DoctorPortal';
import PharmacyPortal from './pages/PharmacyPortal/PharmacyPortal';
import AdminPortal from './pages/AdminPortal/AdminPortal';
import AdminLogin from './components/auth/Login/AdminLogin';
import PatientPharmacy from './components/patient/PatientPharmacy/PatientPharmacy';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ErrorBoundary>
            <div className="App">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />

                  {/* Protected Routes */}
                  <Route path="/patient/pharmacy" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientPharmacy />
                    </ProtectedRoute>
                  } />
                  <Route path="/patient/*" element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientPortal />
                    </ProtectedRoute>
                  } />

                  <Route path="/doctor/*" element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorPortal />
                    </ProtectedRoute>
                  } />

                  <Route path="/pharmacy/*" element={
                    <ProtectedRoute requiredRole="pharmacist">
                      <PharmacyPortal />
                    </ProtectedRoute>
                  } />

                  <Route path="/admin-portal-secure/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<Navigate to="/admin-portal-secure/login" replace />} />
                  <Route path="/admin-portal-secure/*" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPortal />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;