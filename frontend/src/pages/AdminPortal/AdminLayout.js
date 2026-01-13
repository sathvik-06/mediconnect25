import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminPortal.css'; // Reusing portal CSS for layout styles if applicable or create AdminLayout.css

const AdminLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/admin-portal-secure/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin-portal-secure/users', label: 'User Management', icon: '👥' },
        { path: '/admin-portal-secure/appointments', label: 'Appointments', icon: '📅' },
        { path: '/admin-portal-secure/transactions', label: 'Transactions', icon: '💰' },
        { path: '/admin-portal-secure/analytics', label: 'Analytics', icon: '📈' },
        { path: '/admin-portal-secure/reports', label: 'Reports', icon: '📑' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
            <aside className="sidebar" style={{ width: '250px', background: '#fff', borderRight: '1px solid #eee' }}>
                <div className="sidebar-header" style={{ padding: '1.5rem' }}>
                    <h3>MediConnect Admin</h3>
                    <div className="user-info" style={{ marginTop: '1rem' }}>
                        <span className="user-avatar">🛡️</span>
                        <div>
                            <p className="user-name">{user?.name}</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem 1.5rem',
                                textDecoration: 'none',
                                color: isActive(item.path) ? '#007bff' : '#333',
                                background: isActive(item.path) ? '#f0f7ff' : 'transparent'
                            }}
                        >
                            <span className="nav-icon" style={{ marginRight: '10px' }}>{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="admin-main" style={{ flex: 1, padding: '2rem', background: '#f5f7fa' }}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
