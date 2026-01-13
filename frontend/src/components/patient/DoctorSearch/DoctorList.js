// src/components/patient/DoctorSearch/DoctorList.js
import React from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';

const DoctorList = ({ doctors }) => {
  if (!Array.isArray(doctors) || doctors.length === 0) {
    return (
      <div className="doctor-list">
        <div className="empty-state">
          <div className="empty-icon">👨‍⚕️</div>
          <h3>No doctors found</h3>
          <p>Try adjusting your search filters or search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-list">
      <div className="doctors-grid">
        {doctors.map(doctor => (
          <DoctorCard key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default DoctorList;