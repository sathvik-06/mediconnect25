import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            number: '1',
            title: 'Create Account',
            description: 'Sign up as a patient, doctor, or pharmacy in minutes',
            icon: '👤',
        },
        {
            number: '2',
            title: 'Search & Connect',
            description: 'Find doctors by specialization or search for medicines',
            icon: '🔍',
        },
        {
            number: '3',
            title: 'Book & Order',
            description: 'Schedule appointments or order medicines online',
            icon: '📱',
        },
        {
            number: '4',
            title: 'Get Care',
            description: 'Receive quality healthcare services at your convenience',
            icon: '❤️',
        },
    ];

    return (
        <section className="how-it-works-section">
            <div className="container">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Get started with MediConnect in 4 simple steps</p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card">
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            {index < steps.length - 1 && <div className="step-connector" />}
                        </div>
                    ))}
                </div>

                <div className="cta-section">
                    <h3>Ready to get started?</h3>
                    <div className="cta-buttons">
                        <a href="/register" className="btn btn-primary btn-lg">
                            Sign Up Now
                        </a>
                        <a href="/login" className="btn btn-outline btn-lg">
                            Login
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
