import React from 'react';
import './Features.css';

const Features = () => {
    const features = [
        {
            icon: '🏥',
            title: 'Find Doctors',
            description: 'Search and connect with qualified doctors across various specializations',
        },
        {
            icon: '📅',
            title: 'Book Appointments',
            description: 'Schedule appointments with your preferred doctors at your convenience',
        },
        {
            icon: '💊',
            title: 'Order Medicines',
            description: 'Upload prescriptions and order medicines from verified pharmacies',
        },
        {
            icon: '📋',
            title: 'Medical History',
            description: 'Access your complete medical history and prescriptions anytime',
        },
        {
            icon: '🔔',
            title: 'Smart Reminders',
            description: 'Never miss your medication with intelligent reminder notifications',
        },
        {
            icon: '🎤',
            title: 'Voice Assistant',
            description: 'Navigate and manage your health with voice commands',
        },
    ];

    return (
        <section className="features-section">
            <div className="container">
                <div className="section-header">
                    <h2>Why Choose MediConnect?</h2>
                    <p>Comprehensive healthcare solutions at your fingertips</p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
