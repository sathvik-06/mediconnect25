import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './UserMenu.css';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const handleProfile = () => {
        const role = user?.role || 'patient';
        navigate(`/${role}/profile`);
        setIsOpen(false);
    };

    const handleSettings = () => {
        const role = user?.role || 'patient';
        navigate(`/${role}/settings`);
        setIsOpen(false);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const getAvatarColor = (name) => {
        const colors = ['#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#16a34a'];
        if (!name) return colors[0];
        const charCode = name.charCodeAt(0);
        return colors[charCode % colors.length];
    };

    if (!user) return null;

    return (
        <div className="user-menu" ref={menuRef}>
            <button
                className="user-menu-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="User menu"
            >
                <div
                    className="user-avatar"
                    style={{ backgroundColor: getAvatarColor(user.name) }}
                >
                    {getInitials(user.name)}
                </div>
                <span className="user-name">{user.name}</span>
                <svg
                    className={`dropdown-icon ${isOpen ? 'open' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                        <div
                            className="user-avatar-large"
                            style={{ backgroundColor: getAvatarColor(user.name) }}
                        >
                            {getInitials(user.name)}
                        </div>
                        <div className="user-info">
                            <p className="user-info-name">{user.name}</p>
                            <p className="user-info-email">{user.email}</p>
                            <span className="user-role-badge">{user.role}</span>
                        </div>
                    </div>

                    <div className="user-menu-divider" />

                    <div className="user-menu-items">
                        <button className="user-menu-item" onClick={handleProfile}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>My Profile</span>
                        </button>

                        <button className="user-menu-item" onClick={handleSettings}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Settings</span>
                        </button>
                    </div>

                    <div className="user-menu-divider" />

                    <div className="user-menu-items">
                        <button className="user-menu-item logout" onClick={handleLogout}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
