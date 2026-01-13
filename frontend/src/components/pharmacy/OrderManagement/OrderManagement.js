import React, { useState, useEffect } from 'react';
import pharmacyAPI from '../../../services/api/pharmacy';
import './OrderManagement.css';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [message, setMessage] = useState('');

    const [rejectionModal, setRejectionModal] = useState({ show: false, orderId: null, reason: '' });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await pharmacyAPI.getOrders();
            setOrders(response.data.orders || response.data || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id) => {
        try {
            await pharmacyAPI.acceptOrder(id);
            setMessage('Order accepted successfully');
            fetchOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to accept order:', error);
            setMessage('Failed to accept order');
        }
    };

    const handleRejectClick = (id) => {
        setRejectionModal({ show: true, orderId: id, reason: '' });
    };

    const submitRejection = async () => {
        try {
            await pharmacyAPI.rejectOrder(rejectionModal.orderId, rejectionModal.reason);
            setMessage('Order rejected successfully');
            setRejectionModal({ show: false, orderId: null, reason: '' });
            fetchOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to reject order:', error);
            setMessage('Failed to reject order');
        }
    };

    const handleMarkDelivered = async (id) => {
        try {
            await pharmacyAPI.updateOrderStatus(id, 'delivered');
            setMessage('Order marked as delivered');
            fetchOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to mark as delivered:', error);
            setMessage('Failed to update order status');
        }
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setShowViewModal(true);
    };

    const closeModal = () => {
        setShowViewModal(false);
        setSelectedOrder(null);
    };

    return (
        <div className="order-management">
            <h2>Order Management</h2>
            {message && <div className="alert-message">{message}</div>}

            {loading ? (
                <div>Loading orders...</div>
            ) : (
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map(order => (
                                <tr key={order._id || order.id}>
                                    <td>{order._id ? order._id.substring(0, 8).toUpperCase() : order.id}</td>
                                    <td>{order.patient?.name || order.customerName || 'Guest'}</td>
                                    <td>{order.medicines?.length || order.items?.length || 0}</td>
                                    <td>₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td>
                                    <td>{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {order.status === 'pending' && (
                                            <>
                                                <button className="btn-action check-btn" onClick={() => handleAccept(order._id || order.id)}>
                                                    Accept
                                                </button>
                                                <button className="btn-action cancel-btn" onClick={() => handleRejectClick(order._id || order.id)}>
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'confirmed' && (
                                            <button className="btn-action delivered-btn" onClick={() => handleMarkDelivered(order._id || order.id)}>
                                                Mark as Delivered
                                            </button>
                                        )}
                                        <button className="btn-view" onClick={() => handleView(order)}>View</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center' }}>No orders found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {/* Rejection Modal */}
            {rejectionModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Reject Order</h3>
                        <div className="form-group">
                            <label>Reason for Rejection</label>
                            <textarea
                                value={rejectionModal.reason}
                                onChange={(e) => setRejectionModal({ ...rejectionModal, reason: e.target.value })}
                                placeholder="Enter reason (e.g. Out of stock, Invalid prescription)"
                                rows="3"
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setRejectionModal({ show: false, orderId: null, reason: '' })}>Cancel</button>
                            <button className="btn-submit" style={{ backgroundColor: '#c62828' }} onClick={submitRejection}>Reject Order</button>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Order Details</h3>
                        <div className="order-details">
                            <p><strong>Order ID:</strong> {selectedOrder._id || selectedOrder.id}</p>
                            <p><strong>Customer:</strong> {selectedOrder.customerName || (selectedOrder.user && selectedOrder.user.name)}</p>
                            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleString()}</p>
                            <p><strong>Status:</strong> {selectedOrder.status}</p>

                            <h4>Items:</h4>
                            <ul>
                                {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name || item.medicineName} x {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                                    </li>
                                ))}
                            </ul>

                            <p className="total-amount"><strong>Total: ₹{selectedOrder.totalAmount ? selectedOrder.totalAmount.toFixed(2) : '0.00'}</strong></p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-close" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
