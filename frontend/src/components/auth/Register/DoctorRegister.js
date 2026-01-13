import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { validateForm } from '../../../utils/validators';
import { SPECIALIZATIONS } from '../../../utils/constants';

const DoctorRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: '',
        licenseNumber: '',
        clinicName: '',
        clinicAddress: '',
        consultationFee: '',
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
            name: { required: true, label: 'Name' },
            email: { required: true, type: 'email', label: 'Email' },
            password: { required: true, type: 'password', label: 'Password' },
            phone: { required: true, type: 'phone', label: 'Phone' },
            specialization: { required: true, label: 'Specialization' },
            qualification: { required: true, label: 'Qualification' },
            experience: { required: true, type: 'number', min: 0, label: 'Experience' },
            licenseNumber: { required: true, label: 'License Number' },
            consultationFee: { required: true, type: 'number', min: 0, label: 'Consultation Fee' },
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
        const { confirmPassword, ...registrationData } = formData;
        const result = await register({ ...registrationData, role: 'doctor' });
        setLoading(false);

        if (result.success) {
            navigate('/doctor/dashboard');
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
                    placeholder="Dr. Your Name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-row">
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
                    <label className="form-label">Phone *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="10-digit number"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Specialization *</label>
                    <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Specialization</option>
                        {SPECIALIZATIONS.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                    {errors.specialization && <span className="error-text">{errors.specialization}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Experience (years) *</label>
                    <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                        placeholder="Years of experience"
                    />
                    {errors.experience && <span className="error-text">{errors.experience}</span>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Qualification *</label>
                <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="MBBS, MD, etc."
                />
                {errors.qualification && <span className="error-text">{errors.qualification}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">License Number *</label>
                    <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Medical Council License"
                    />
                    {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Consultation Fee (₹) *</label>
                    <input
                        type="number"
                        name="consultationFee"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                        placeholder="Fee amount"
                    />
                    {errors.consultationFee && <span className="error-text">{errors.consultationFee}</span>}
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Clinic Name</label>
                <input
                    type="text"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Your clinic name"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Clinic Address</label>
                <textarea
                    name="clinicAddress"
                    value={formData.clinicAddress}
                    onChange={handleChange}
                    className="form-control"
                    rows="2"
                    placeholder="Clinic address"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Create password"
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
                        placeholder="Confirm password"
                    />
                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Doctor Account'}
            </button>

            <p className="note">
                <small>* Your account will be verified by admin before activation</small>
            </p>
        </form>
    );
};

export default DoctorRegister;
