import React, { useState, useEffect } from 'react';
import pharmacyAPI from '../../../services/api/pharmacy';
import './PatientPharmacy.css';

const PatientPharmacy = () => {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [bookModal, setBookModal] = useState({ show: false, medicine: null });
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchMedicines();
    }, [search]);

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await pharmacyAPI.getInventory({ search });
            setMedicines(response.data.medicines || []);
        } catch (error) {
            console.error('Failed to fetch medicines:', error);
            setError('Failed to load medicines. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (medicine) => {
        setBookModal({ show: true, medicine });
        setQuantity(1);
        setAddress(''); // Can be pre-filled from user profile if available
    };

    const handleBooking = async () => {
        try {
            const orderData = {
                medicines: [{
                    medicineId: bookModal.medicine._id,
                    quantity: parseInt(quantity),
                    price: bookModal.medicine.price
                }],
                paymentMethod: 'cash_on_delivery', // Default for booking
                deliveryAddress: {
                    street: address,
                    // Minimal address for now, can be expanded
                    city: 'Local',
                    zipCode: '000000'
                }
            };

            await pharmacyAPI.createOrder(orderData);
            setMessage('Booking request sent successfully! Pharmacist will review.');
            setBookModal({ show: false, medicine: null });
            setTimeout(() => setMessage(''), 4000);
        } catch (error) {
            console.error('Failed to book medicine:', error);
            setMessage('Failed to place booking request.');
        }
    };

    return (
        <div className="patient-pharmacy">
            <div className="pharmacy-header">
                <h2>Pharmacy Store</h2>
                <input
                    type="text"
                    placeholder="Search medicines..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '0.5rem', width: '300px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            {message && <div className={`alert-message ${message.includes('Failed') ? 'error' : 'success'}`}>{message}</div>}

            {error && <div className="alert-message error">{error}</div>}

            {loading ? (
                <div>Loading medicines...</div>
            ) : (
                <>
                    {medicines.length === 0 ? (
                        <div className="no-medicines">
                            <p>No medicines found matching your search.</p>
                        </div>
                    ) : (
                        <div className="medicine-grid">
                            {medicines.map(med => (
                                <div key={med._id} className="medicine-card">
                                    <div className="medicine-info">
                                        <h3>{med.name}</h3>
                                        <div className="medicine-meta">
                                            {med.manufacturer} • {med.form}
                                        </div>
                                        <div className="medicine-details">
                                            <span className="price">₹{med.price}</span>
                                            <span className="stock">{med.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-book"
                                        disabled={med.stock <= 0}
                                        onClick={() => handleBookClick(med)}
                                    >
                                        {med.stock > 0 ? 'Book Now' : 'Out of Stock'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {bookModal.show && bookModal.medicine && (
                <div className="modal-overlay">
                    <div className="booking-modal-content">
                        <h3>Book Medicine</h3>
                        <div className="booking-summary">
                            <div className="summary-item">
                                <span>Item:</span>
                                <strong>{bookModal.medicine.name}</strong>
                            </div>
                            <div className="summary-item">
                                <span>Price:</span>
                                <span>₹{bookModal.medicine.price} / unit</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                max={bookModal.medicine.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Delivery Address</label>
                            <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full delivery address..."
                                rows="3"
                                style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
                                required
                            />
                        </div>

                        <div className="summary-item total-row">
                            <span>Total Estimated:</span>
                            <span>₹{(bookModal.medicine.price * quantity).toFixed(2)}</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                            * Note: This is a booking request. Payment will be collected upon delivery or processing.
                        </p>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setBookModal({ show: false, medicine: null })}>Cancel</button>
                            <button className="btn-submit" onClick={handleBooking} disabled={!address}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientPharmacy;
