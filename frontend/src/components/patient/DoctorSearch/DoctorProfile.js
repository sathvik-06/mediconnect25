import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doctorsService } from '../../../services/api/doctors';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './DoctorProfile.css';

const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            console.log('DoctorProfile: Fetching details for ID:', id);
            try {
                const data = await doctorsService.getDoctorById(id);
                console.log('DoctorProfile: Data received:', data);
                setDoctor(data);
            } catch (err) {
                console.error('Error fetching doctor details:', err);
                setError(err.message || 'Failed to load doctor details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDoctorDetails();
        }
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="error-message">{error}</div>;
    if (!doctor) return <div className="error-message">Doctor not found</div>;

    return (
        <div className="doctor-profile-container">
            {/* Header Section */}
            <div className="profile-header">
                <div className="profile-image-container">
                    {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} />
                    ) : (
                        <div className="profile-avatar">👨‍⚕️</div>
                    )}
                </div>

                <div className="profile-info-header">
                    <span className="specialty-badge">{doctor.specialization}</span>
                    <h1>Dr. {doctor.name}</h1>

                    <div className="rating-summary">
                        <span className="stars">{'⭐'.repeat(Math.round(doctor.rating?.average || 0))}</span>
                        <span className="rating-val">{doctor.rating?.average || 0}</span>
                        <span className="review-count">({doctor.rating?.count || 0} reviews)</span>
                    </div>

                    <div className="doctor-stats">
                        <div className="stat-item">
                            <span className="stat-label">Experience</span>
                            <span className="stat-value">{doctor.experience} Years</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Patients</span>
                            <span className="stat-value">1000+</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">License</span>
                            <span className="stat-value">{doctor.licenseNumber}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="main-info">
                    {/* About Section */}
                    <div className="info-section">
                        <h2>About Doctor</h2>
                        <p className="doctor-bio">
                            Dr. {doctor.name} is a highly skilled {doctor.specialization} with over {doctor.experience} years of experience.
                            Dedicated to providing top-quality healthcare services.
                        </p>
                    </div>

                    {/* Education & Qualifications */}
                    <div className="info-section">
                        <h2>Qualifications</h2>
                        {doctor.qualifications?.map((qual, index) => (
                            <div key={index} className="qualification-item">
                                <div className="qualification-icon">🎓</div>
                                <div className="qualification-details">
                                    <h4>{qual.degree} - {qual.university}</h4>
                                    <p>Completed in {qual.year}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hospital/Clinic Info */}
                    <div className="info-section">
                        <h2>Clinic Location</h2>
                        <div className="hospital-details">
                            <div className="hospital-icon">🏥</div>
                            <div className="hospital-info">
                                <h3>{doctor.hospital?.name}</h3>
                                <p className="clinic-address">
                                    {doctor.hospital?.address?.street}, {doctor.hospital?.address?.city}<br />
                                    {doctor.hospital?.address?.state} - {doctor.hospital?.address?.zipCode}
                                </p>
                                <div className="contact-info">
                                    <span>📞 {doctor.hospital?.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="info-section">
                        <h2>Patient Reviews</h2>
                        <div className="reviews-list">
                            {doctor.rating?.reviews?.length > 0 ? (
                                doctor.rating.reviews.map((review, idx) => (
                                    <div key={idx} className="review-item">
                                        <div className="review-header">
                                            <span className="reviewer-name">Patient</span>
                                            <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="rating-stars">{'⭐'.repeat(review.rating)}</div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Booking Card */}
                <div className="sidebar">
                    <div className="booking-card">
                        <div className="fee-info">
                            <span className="fee-label">Consultation Fee</span>
                            <span className="fee-amount">₹{doctor.consultationFee}</span>
                        </div>

                        <div className="availability-card">
                            <h3>Available Days</h3>
                            <div className="days-list">
                                {doctor.availability?.workingDays?.map((day) => (
                                    <span key={day} className="day-badge">{day}</span>
                                ))}
                            </div>
                            <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                                Time: {doctor.availability?.workingHours?.start} - {doctor.availability?.workingHours?.end}
                            </p>
                        </div>

                        <Link to={`/patient/book-appointment/${doctor._id}`} className="book-btn">
                            Book Appointment
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
