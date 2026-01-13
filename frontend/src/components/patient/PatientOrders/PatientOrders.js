import React, { useState, useEffect } from 'react';
import pharmacyAPI from '../../../services/api/pharmacy';
import './PatientOrders.css';

const PatientOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelModal, setCancelModal] = useState({ show: false, orderId: null, reason: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await pharmacyAPI.getOrders();
            const allOrders = response.data.orders || response.data || [];
            // Filter out cancelled orders
            const activeOrders = allOrders.filter(order => order.status !== 'cancelled');
            setOrders(activeOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setError('Failed to load orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (orderId) => {
        setCancelModal({ show: true, orderId, reason: '' });
    };

    const submitCancellation = async () => {
        try {
            await pharmacyAPI.cancelOrder(cancelModal.orderId, cancelModal.reason);
            setMessage('Order cancelled successfully');
            setCancelModal({ show: false, orderId: null, reason: '' });
            fetchOrders();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to cancel order:', error);
            setMessage(error.response?.data?.message || 'Failed to cancel order');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f57c00',
            confirmed: '#1976d2',
            processing: '#1976d2',
            delivered: '#2e7d32',
            cancelled: '#c62828'
        };
        return colors[status] || '#666';
    };

    return (
        <div className="patient-orders">
            <h2>My Medicine Orders</h2>

            {message && <div className={`alert-message ${message.includes('Failed') || message.includes('Cannot') ? 'error' : 'success'}`}>{message}</div>}

            {error && <div className="alert-message error">{error}</div>}

            {loading ? (
                <div>Loading orders...</div>
            ) : (
                <>
                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <p>You haven't placed any medicine orders yet.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order._id} className="order-card">
                                    <div className="order-header">
                                        <div>
                                            <h3>Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                                            <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span
                                            className="order-status"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="order-body">
                                        <div className="order-items">
                                            <strong>Items:</strong>
                                            <ul>
                                                {order.medicines?.map((item, idx) => (
                                                    <li key={idx}>
                                                        {item.medicineId?.name || 'Medicine'} x {item.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="order-details">
                                            <p><strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                                            <p><strong>Payment:</strong> {order.paymentMethod}</p>
                                            {order.rejectionReason && (
                                                <p className="rejection-reason">
                                                    <strong>Rejection Reason:</strong> {order.rejectionReason}
                                                </p>
                                            )}
                                            {order.cancellationReason && (
                                                <p className="cancellation-reason">
                                                    <strong>Cancellation Reason:</strong> {order.cancellationReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <button
                                            className="btn-view-details"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            View Details
                                        </button>
                                        {['pending', 'confirmed'].includes(order.status) && (
                                            <button
                                                className="btn-cancel-order"
                                                onClick={() => handleCancelClick(order._id)}
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Cancel Modal */}
            {cancelModal.show && (
                <div className="modal-overlay" onClick={() => setCancelModal({ show: false, orderId: null, reason: '' })}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Cancel Order</h3>
                        <p>Are you sure you want to cancel this order?</p>
                        <div className="form-group">
                            <label>Reason (optional)</label>
                            <textarea
                                value={cancelModal.reason}
                                onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                                placeholder="Enter cancellation reason..."
                                rows="3"
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div className="modal-actions">
                            <button className="btn-close" onClick={() => setCancelModal({ show: false, orderId: null, reason: '' })}>
                                Keep Order
                            </button>
                            <button className="btn-cancel-confirm" onClick={submitCancellation}>
                                Yes, Cancel Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Order Details</h3>
                        <div className="order-detail-section">
                            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                            <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedOrder.status) }}>{selectedOrder.status}</span></p>
                            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount?.toFixed(2)}</p>
                            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>

                            <h4>Items:</h4>
                            <ul>
                                {selectedOrder.medicines?.map((item, idx) => (
                                    <li key={idx}>
                                        {item.medicineId?.name || 'Medicine'} - Qty: {item.quantity} - ₹{item.price}
                                    </li>
                                ))}
                            </ul>

                            {selectedOrder.deliveryAddress && (
                                <>
                                    <h4>Delivery Address:</h4>
                                    <p>{selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.zipCode}</p>
                                </>
                            )}

                            {selectedOrder.rejectionReason && (
                                <div className="rejection-info">
                                    <h4>Rejection Reason:</h4>
                                    <p>{selectedOrder.rejectionReason}</p>
                                </div>
                            )}

                            {selectedOrder.cancellationReason && (
                                <div className="cancellation-info">
                                    <h4>Cancellation Reason:</h4>
                                    <p>{selectedOrder.cancellationReason}</p>
                                </div>
                            )}
                        </div>

                        <button className="btn-close" onClick={() => setSelectedOrder(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientOrders;
