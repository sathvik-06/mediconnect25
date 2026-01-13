import React from 'react';
import './UserDetailsModal.css';

const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Details</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="detail-section">
                        <h4>Personal Information</h4>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Status:</strong> {user.isVerified ? 'Verified' : 'Unverified'}</p>
                    </div>

                    {user.role === 'doctor' && (
                        <>
                            <div className="detail-section">
                                <h4>Professional Details</h4>
                                <p><strong>Specialization:</strong> {user.specialization}</p>
                                <p><strong>License Number:</strong> {user.licenseNumber}</p>
                                <p><strong>Experience:</strong> {user.experience} years</p>
                                <p><strong>Consultation Fee:</strong> ${user.consultationFee}</p>
                            </div>
                            <div className="detail-section">
                                <h4>Hospital/Clinic</h4>
                                <p><strong>Name:</strong> {user.hospital?.name}</p>
                                <p><strong>Address:</strong> {user.hospital?.address?.street}, {user.hospital?.address?.city}, {user.hospital?.address?.state}</p>
                                <p><strong>Phone:</strong> {user.hospital?.phone}</p>
                            </div>
                            <div className="detail-section">
                                <h4>Qualifications</h4>
                                {user.qualifications?.map((qual, index) => (
                                    <div key={index} className="qualification-item">
                                        <p>{qual.degree} - {qual.university} ({qual.year})</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {user.role === 'pharmacist' && (
                        <>
                            <div className="detail-section">
                                <h4>Pharmacy Details</h4>
                                <p><strong>Pharmacy Name:</strong> {user.pharmacyName}</p>
                                <p><strong>License Number:</strong> {user.licenseNumber}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                            </div>
                            <div className="detail-section">
                                <h4>Address</h4>
                                <p>{user.address?.street}</p>
                                <p>{user.address?.city}, {user.address?.state} {user.address?.zipCode}</p>
                            </div>
                        </>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn-close" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsModal;
