import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { validateForm } from '../../../utils/validators';

const PharmacyRegister = () => {
    const [formData, setFormData] = useState({
        pharmacyName: '',
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        licenseNumber: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        gstNumber: '',
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
            pharmacyName: { required: true, label: 'Pharmacy Name' },
            ownerName: { required: true, label: 'Owner Name' },
            email: { required: true, type: 'email', label: 'Email' },
            password: { required: true, type: 'password', label: 'Password' },
            phone: { required: true, type: 'phone', label: 'Phone' },
            licenseNumber: { required: true, label: 'License Number' },
            address: { required: true, label: 'Address' },
            city: { required: true, label: 'City' },
            state: { required: true, label: 'State' },
            pinCode: { required: true, label: 'PIN Code' },
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
        const result = await register({
            ...registrationData,
            name: formData.pharmacyName, // backend requires 'name'
            role: 'pharmacist'
        });
        setLoading(false);

        if (result.success) {
            navigate('/pharmacy/dashboard');
        } else {
            setErrors({ submit: result.error });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

            <div className="form-group">
                <label className="form-label">Pharmacy Name *</label>
                <input
                    type="text"
                    name="pharmacyName"
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Your pharmacy name"
                />
                {errors.pharmacyName && <span className="error-text">{errors.pharmacyName}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Pharmacy owner name"
                />
                {errors.ownerName && <span className="error-text">{errors.ownerName}</span>}
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
                        placeholder="pharmacy@example.com"
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
                    <label className="form-label">License Number *</label>
                    <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Pharmacy license number"
                    />
                    {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">GST Number</label>
                    <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="GST registration number"
                    />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                    rows="2"
                    placeholder="Complete pharmacy address"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="City"
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="State"
                    />
                    {errors.state && <span className="error-text">{errors.state}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="6-digit PIN"
                        maxLength="6"
                    />
                    {errors.pinCode && <span className="error-text">{errors.pinCode}</span>}
                </div>
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
                {loading ? 'Creating Account...' : 'Create Pharmacy Account'}
            </button>

            <p className="note">
                <small>* Your account will be verified by admin before activation</small>
            </p>
        </form>
    );
};

export default PharmacyRegister;
