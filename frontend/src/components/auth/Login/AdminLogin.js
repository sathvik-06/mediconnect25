// src/components/auth/Login/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css'; // Reusing login styles, but we'll add inline styles for admin distinction

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // We pass role: 'admin' to ensure we are logging in as admin
            // The backend might not strictly enforce role in the login endpoint itself, 
            // but we can check the result.
            const result = await login({ email, password, role: 'admin' });

            if (result.success) {
                const user = JSON.parse(localStorage.getItem('user'));

                if (user.role !== 'admin') {
                    setError('Access Denied: You are not an administrator.');
                    // Optionally logout if they managed to login as non-admin
                    return;
                }

                navigate('/admin-portal-secure/dashboard', { replace: true });
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            console.error("Admin Login Error:", err);
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" style={{ background: '#1a1a2e' }}>
            <div className="login-container" style={{ borderColor: '#0f3460', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                <div className="login-header">
                    <h2 style={{ color: '#e94560' }}>Admin Portal</h2>
                    <p style={{ color: '#a0a0a0' }}>Secure Access Only</p>
                </div>

                {error && <div className="error-message" style={{ background: '#e94560', color: 'white' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label style={{ color: '#ccc' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@mediconnect.com"
                            style={{ background: '#16213e', color: 'white', border: '1px solid #0f3460' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ color: '#ccc' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter admin password"
                            style={{ background: '#16213e', color: 'white', border: '1px solid #0f3460' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ background: '#e94560', borderColor: '#e94560' }}
                    >
                        {loading ? 'Authenticating...' : 'Access Portal'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
