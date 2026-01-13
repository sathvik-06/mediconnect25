// src/pages/PrivacyPolicy/PrivacyPolicy.jsx
import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-page">
            <div className="privacy-container">
                <section className="privacy-hero">
                    <h1>Privacy Policy</h1>
                    <p className="subtitle">Last updated: November 2024</p>
                </section>

                <div className="privacy-content">
                    <section className="privacy-section">
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to MediConnect. We are committed to protecting your personal information and your right to privacy.
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
                            healthcare platform.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>2. Information We Collect</h2>
                        <h3>Personal Information</h3>
                        <ul>
                            <li>Name, email address, and contact details</li>
                            <li>Date of birth and gender</li>
                            <li>Medical history and health records</li>
                            <li>Prescription and medication information</li>
                            <li>Insurance information</li>
                            <li>Payment and billing information</li>
                        </ul>
                        <h3>Technical Information</h3>
                        <ul>
                            <li>IP address and device information</li>
                            <li>Browser type and version</li>
                            <li>Usage data and analytics</li>
                            <li>Cookies and tracking technologies</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>3. How We Use Your Information</h2>
                        <p>We use your information for the following purposes:</p>
                        <ul>
                            <li>To provide and maintain our healthcare services</li>
                            <li>To schedule and manage appointments</li>
                            <li>To process prescriptions and pharmacy orders</li>
                            <li>To facilitate communication between patients and healthcare providers</li>
                            <li>To improve our services and user experience</li>
                            <li>To send important notifications and updates</li>
                            <li>To comply with legal and regulatory requirements</li>
                            <li>To prevent fraud and ensure platform security</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>4. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal and medical information,
                            including:
                        </p>
                        <ul>
                            <li>End-to-end encryption for sensitive data</li>
                            <li>Secure servers with regular security audits</li>
                            <li>Access controls and authentication protocols</li>
                            <li>Regular backups and disaster recovery procedures</li>
                            <li>HIPAA compliance for healthcare data</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>5. Information Sharing</h2>
                        <p>We may share your information with:</p>
                        <ul>
                            <li><strong>Healthcare Providers:</strong> Doctors, specialists, and pharmacists involved in your care</li>
                            <li><strong>Service Providers:</strong> Third-party vendors who assist in operating our platform</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            <li><strong>With Your Consent:</strong> Any other parties you authorize</li>
                        </ul>
                        <p>We never sell your personal or medical information to third parties.</p>
                    </section>

                    <section className="privacy-section">
                        <h2>6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access your personal and medical information</li>
                            <li>Request corrections to inaccurate data</li>
                            <li>Request deletion of your data (subject to legal requirements)</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent for certain data processing</li>
                            <li>Request a copy of your data in a portable format</li>
                        </ul>
                    </section>

                    <section className="privacy-section">
                        <h2>7. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar tracking technologies to improve your experience, analyze usage patterns,
                            and personalize content. You can control cookie settings through your browser preferences.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>8. Children's Privacy</h2>
                        <p>
                            Our services are not intended for children under 13 years of age. We do not knowingly collect personal
                            information from children. If you believe we have collected information from a child, please contact us
                            immediately.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                            new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this
                            Privacy Policy periodically.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>10. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <ul>
                            <li>Email: mediconnect111222325@gmail.com</li>
                            <li>Phone: +91 9989882411</li>
                            <li>Address: 123 Healthcare Ave, Medical District, City, State 12345</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
