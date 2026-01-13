import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientRegister from './PatientRegister';
import DoctorRegister from './DoctorRegister';
import PharmacyRegister from './PharmacyRegister';
import './Register.css';

const Register = () => {
    const [userType, setUserType] = useState('patient');
    const navigate = useNavigate();

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create Account</h2>
                <p className="register-subtitle">Join MediConnect today</p>

                <div className="user-type-selector">
                    <button
                        className={`type-btn ${userType === 'patient' ? 'active' : ''}`}
                        onClick={() => setUserType('patient')}
                    >
                        Patient
                    </button>
                    <button
                        className={`type-btn ${userType === 'doctor' ? 'active' : ''}`}
                        onClick={() => setUserType('doctor')}
                    >
                        Doctor
                    </button>
                    <button
                        className={`type-btn ${userType === 'pharmacy' ? 'active' : ''}`}
                        onClick={() => setUserType('pharmacy')}
                    >
                        Pharmacy
                    </button>
                </div>

                <div className="register-form-container">
                    {userType === 'patient' && <PatientRegister />}
                    {userType === 'doctor' && <DoctorRegister />}
                    {userType === 'pharmacy' && <PharmacyRegister />}
                </div>

                <div className="login-link">
                    Already have an account?{' '}
                    <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
                        Login here
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Register;
