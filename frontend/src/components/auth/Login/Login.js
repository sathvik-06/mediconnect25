// src/components/auth/Login/Login.js
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import LoginForm from './LoginForm';
import './Login.css';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (credentials) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(credentials);

      if (result.success) {
        const user = JSON.parse(localStorage.getItem('user'));
        let redirectPath = '/';

        switch (user.role) {
          case 'patient':
            redirectPath = '/patient/dashboard';
            break;
          case 'doctor':
            redirectPath = '/doctor/dashboard';
            break;
          case 'pharmacist':
            redirectPath = '/pharmacy/dashboard';
            break;
          case 'admin':
            redirectPath = '/admin/dashboard';
            break;
          default:
            redirectPath = '/';
        }

        navigate(redirectPath, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back to MediConnect</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <LoginForm onSubmit={handleSubmit} loading={loading} />

        <div className="login-footer">
          <p>
            <Link to="/forgot-password" className="link forgot-password-link">
              Forgot Password?
            </Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;