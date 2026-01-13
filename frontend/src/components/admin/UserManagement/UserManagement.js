import React, { useState, useEffect } from 'react';
import api from '../../../services/api/config';
import UserDetailsModal from './UserDetailsModal';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filter !== 'all') params.role = filter;
            if (statusFilter !== 'all') params.status = statusFilter;

            // Construct query string manually or use URLSearchParams if api service doesn't support params object directly
            // The current api.js implementation doesn't support params object in get(), so we append query string
            const queryString = new URLSearchParams(params).toString();
            const url = `/admin/users${queryString ? `?${queryString}` : ''}`;

            const data = await api.get(url);
            setUsers(data.users);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filter, statusFilter]);

    const handleVerify = async (id) => {
        try {
            await api.put(`/admin/users/${id}/verify`, {});
            // Refresh list
            fetchUsers();
            // If the verified user is currently selected in modal, update the modal data too
            if (selectedUser && selectedUser._id === id) {
                setSelectedUser(prev => ({ ...prev, isVerified: true }));
            }
        } catch (err) {
            alert(err.message || 'Failed to verify user');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.delete(`/admin/users/${id}`);
            // Refresh list
            fetchUsers();
            if (selectedUser && selectedUser._id === id) {
                setSelectedUser(null);
            }
        } catch (err) {
            alert(err.message || 'Failed to delete user');
            console.error(err);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="user-management">
            <div className="header-actions">
                <h2>User Management</h2>
                <div className="filters">
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Roles</option>
                        <option value="patient">Patients</option>
                        <option value="doctor">Doctors</option>
                        <option value="pharmacist">Pharmacists</option>
                        <option value="admin">Admins</option>
                    </select>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>License (if applicable)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                                <td>
                                    <span className={`status-badge ${user.isVerified ? 'active' : 'pending'}`}>
                                        {user.isVerified ? 'Verified' : 'Unverified'}
                                    </span>
                                </td>
                                <td>{user.licenseNumber || '-'}</td>
                                <td className="actions-cell">
                                    {(user.role === 'doctor' || user.role === 'pharmacist') && (
                                        <button
                                            className="btn-view"
                                            onClick={() => handleViewDetails(user)}
                                        >
                                            View Details
                                        </button>
                                    )}
                                    {!user.isVerified && (user.role === 'doctor' || user.role === 'pharmacist') && (
                                        <button
                                            className="btn-verify"
                                            onClick={() => handleVerify(user._id)}
                                        >
                                            Verify
                                        </button>
                                    )}
                                    {user.role !== 'admin' && (
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default UserManagement;
