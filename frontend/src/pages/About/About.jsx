// src/pages/About/About.jsx
import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <section className="about-hero">
                    <h1>About MediConnect</h1>
                    <p className="subtitle">Your trusted partner in healthcare management</p>
                </section>

                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        MediConnect is dedicated to revolutionizing healthcare delivery by providing a seamless,
                        integrated platform that connects patients, doctors, and pharmacies. We believe in making
                        quality healthcare accessible, efficient, and patient-centered.
                    </p>
                </section>

                <section className="about-section">
                    <h2>What We Offer</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🏥</div>
                            <h3>Doctor Appointments</h3>
                            <p>Easy scheduling and management of appointments with healthcare professionals</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💻</div>
                            <h3>Online Consultations</h3>
                            <p>Connect with doctors remotely through secure video consultations</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💊</div>
                            <h3>Pharmacy Services</h3>
                            <p>Order prescriptions and medications online with home delivery</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📋</div>
                            <h3>Medical Records</h3>
                            <p>Securely store and access your medical history anytime, anywhere</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Why Choose MediConnect?</h2>
                    <ul className="benefits-list">
                        <li><strong>Convenience:</strong> Access healthcare services from the comfort of your home</li>
                        <li><strong>Security:</strong> Your medical data is protected with industry-leading encryption</li>
                        <li><strong>Comprehensive:</strong> All your healthcare needs in one integrated platform</li>
                        <li><strong>24/7 Support:</strong> Our team is always available to assist you</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Our Commitment</h2>
                    <p>
                        We are committed to maintaining the highest standards of patient care, privacy, and security.
                        MediConnect complies with all healthcare regulations and continuously works to improve our
                        services to better serve our community.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default About;
