import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Navigation.css';

const Navigation = () => {
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    const getNavigationItems = () => {
        if (!isAuthenticated || !user) {
            return [
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About' },
                { path: '/contact', label: 'Contact' },
            ];
        }

        const role = user.role;

        switch (role) {
            case 'patient':
                return [
                    { path: '/patient/dashboard', label: 'Dashboard' },
                    { path: '/patient/doctors', label: 'Find Doctors' },
                    { path: '/patient/appointments', label: 'Appointments' },
                    { path: '/patient/prescriptions', label: 'Prescriptions' },
                    { path: '/patient/medical-history', label: 'Medical History' },
                ];

            case 'doctor':
                return [
                    { path: '/doctor/dashboard', label: 'Dashboard' },
                    { path: '/doctor/appointments', label: 'Appointments' },
                    { path: '/doctor/schedule', label: 'Schedule' },
                    { path: '/doctor/patients', label: 'Patients' },
                ];

            case 'pharmacy':
                return [
                    { path: '/pharmacy/dashboard', label: 'Dashboard' },
                    { path: '/pharmacy/orders', label: 'Orders' },
                    { path: '/pharmacy/inventory', label: 'Inventory' },
                ];

            case 'admin':
                return [
                    { path: '/admin/dashboard', label: 'Dashboard' },
                    { path: '/admin/users', label: 'Users' },
                    { path: '/admin/analytics', label: 'Analytics' },
                    { path: '/admin/reports', label: 'Reports' },
                ];

            default:
                return [{ path: '/', label: 'Home' }];
        }
    };

    const navigationItems = getNavigationItems();

    return (
        <nav className="navigation">
            <ul className="nav-list">
                {navigationItems.map((item) => (
                    <li key={item.path} className="nav-item">
                        <Link
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
