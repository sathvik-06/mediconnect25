import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PharmacyDashboard from '../../components/pharmacy/Dashboard/PharmacyDashboard';
import Inventory from '../../components/pharmacy/Inventory/Inventory';
import OrderManagement from '../../components/pharmacy/OrderManagement/OrderManagement';
import Payment from '../../components/pharmacy/Payment/Payment';
import PharmacyLayout from './PharmacyLayout';
import './PharmacyPortal.css';

const PharmacyPortal = () => {
    return (
        <PharmacyLayout>
            <Routes>
                <Route path="/dashboard" element={<PharmacyDashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/orders" element={<OrderManagement />} />
                <Route path="/payments" element={<Payment />} />
            </Routes>
        </PharmacyLayout>
    );
};

export default PharmacyPortal;
