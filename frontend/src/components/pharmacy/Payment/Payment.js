import React, { useState, useEffect } from 'react';
import pharmacyAPI from '../../../services/api/pharmacy';
import './Payment.css';

const Payment = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await pharmacyAPI.getPaymentHistory();
            setPayments(response.data.payments || response.data || []);
        } catch (error) {
            console.error('Failed to fetch payment history:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-management">
            <h2>Transaction & Payment History</h2>

            {loading ? (
                <div>Loading transactions...</div>
            ) : (
                <div className="payment-table-container">
                    <table className="payment-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length > 0 ? (
                                payments.map(payment => (
                                    <tr key={payment._id || payment.id}>
                                        <td>{payment.transactionId || (payment._id && payment._id.substring(0, 10)) || 'N/A'}</td>
                                        <td>{payment.orderId || 'N/A'}</td>
                                        <td>{new Date(payment.createdAt || payment.date).toLocaleDateString()}</td>
                                        <td>₹{payment.amount ? payment.amount.toFixed(2) : '0.00'}</td>
                                        <td>{payment.method || 'Credit Card'}</td>
                                        <td>
                                            <span className={`status-badge ${payment.status}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No payment history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Payment;
