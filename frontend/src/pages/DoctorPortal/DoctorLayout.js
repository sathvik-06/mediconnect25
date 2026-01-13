import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import socketService from "../../services/websocket/socketService";

const DoctorLayout = ({ children }) => {
    const { user, token } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (user && user.role === 'doctor' && token) {
            socketService.connect(token);
            socketService.joinRoom(`doctor:${user._id}`);

            return () => {
                socketService.leaveRoom(`doctor:${user._id}`);
                socketService.disconnect();
            };
        }
    }, [user, token]);

    const navItems = [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/doctor/schedule', label: 'My Schedule', icon: '📅' },
        { path: '/doctor/patients', label: 'My Patients', icon: '👥' },
        { path: '/doctor/queue', label: 'Queue', icon: '⏳' },
        // { path: '/doctor/consultations', label: 'Consultations', icon: '🩺' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="doctor-layout" style={{ display: 'flex', minHeight: '100vh' }}>
            <aside className="sidebar" style={{ width: '250px', background: '#fff', borderRight: '1px solid #eee' }}>
                <div className="sidebar-header" style={{ padding: '1.5rem' }}>
                    <h3>MediConnect Doctor</h3>
                    <div className="user-info" style={{ marginTop: '1rem' }}>
                        <span className="user-avatar">👨‍⚕️</span>
                        <div>
                            <p className="user-name">{user?.name}</p>
                            <p className="user-role">Doctor</p>
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

            <main className="doctor-main" style={{ flex: 1, padding: '2rem', background: '#f5f7fa' }}>
                {children}
            </main>
        </div>
    );
};

export default DoctorLayout;
