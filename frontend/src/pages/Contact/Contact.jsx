// src/pages/Contact/Contact.jsx
import React, { useState } from 'react';
import api from '../../services/api/config';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.post('/contact', formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Reset submitted state after 5 seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 5000);
        } catch (err) {
            console.error('Contact form error:', err);
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <section className="contact-hero">
                    <h1>Contact Us</h1>
                    <p className="subtitle">We're here to help and answer any questions you might have</p>
                </section>

                <div className="contact-content">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <div className="info-card">
                            <div className="info-icon">📧</div>
                            <div className="info-details">
                                <h3>Email</h3>
                                <p><a href="mailto:mediconnect111222325@gmail.com" className="contact-link">mediconnect111222325@gmail.com</a></p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">📞</div>
                            <div className="info-details">
                                <h3>Phone</h3>
                                <p><a href="tel:+919989882411" className="contact-link">+91 9989882411</a></p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">🕒</div>
                            <div className="info-details">
                                <h3>Support Hours</h3>
                                <p>24/7 - We're always here for you</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">📍</div>
                            <div className="info-details">
                                <h3>Address</h3>
                                <p>123 Healthcare Ave<br />Medical District<br />City, State 12345</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-section">
                        <h2>Send us a Message</h2>
                        {submitted ? (
                            <div className="success-message">
                                <div className="success-icon">✓</div>
                                <h3>Thank you for contacting us!</h3>
                                <p>We'll get back to you as soon as possible.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit}>
                                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="What is this regarding?"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Tell us more about your inquiry..."
                                        disabled={loading}
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
