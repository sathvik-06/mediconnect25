import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../../components/admin/Dashboard/AdminDashboard';
import UserManagement from '../../components/admin/UserManagement/UserManagement';
import AppointmentMonitor from '../../components/admin/AppointmentMonitor/AppointmentMonitor';
import TransactionMonitor from '../../components/admin/TransactionMonitor/TransactionMonitor';
import Analytics from '../../components/admin/Analytics/Analytics';
import Reports from '../../components/admin/Reports/Reports';
import AdminLayout from './AdminLayout';
import './AdminPortal.css';

const AdminPortal = () => {
    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/users" element={<UserManagement />} />
                <Route path="/appointments" element={<AppointmentMonitor />} />
                <Route path="/transactions" element={<TransactionMonitor />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminPortal;
