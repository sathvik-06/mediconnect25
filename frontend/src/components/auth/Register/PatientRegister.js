import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { validateForm } from '../../../utils/validators';

const PatientRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validation = validateForm(formData, {
            name: { required: true, type: 'name', label: 'Name' },
            email: { required: true, type: 'email', label: 'Email' },
            password: { required: true, type: 'password', label: 'Password' },
            phone: { required: true, type: 'phone', label: 'Phone' },
            dateOfBirth: { required: true, label: 'Date of Birth' },
            gender: { required: true, label: 'Gender' },
        });

        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }

        setLoading(true);
        // Remove confirmPassword before sending to backend
        const { confirmPassword, address, ...registrationData } = formData;

        // Format address as object if it exists
        const formattedData = { ...registrationData };
        if (address) {
            formattedData.address = { street: address };
        }

        const result = await register({ ...formattedData, role: 'patient' });
        setLoading(false);

        if (result.success) {
            navigate('/patient/dashboard');
        } else {
            setErrors({ submit: result.error });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="10-digit mobile number"
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Date of Birth *</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="form-control"
                    />
                    {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                    rows="2"
                    placeholder="Your address"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Create a strong password"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Re-enter your password"
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Patient Account'}
            </button>
        </form>
    );
};

export default PatientRegister;
