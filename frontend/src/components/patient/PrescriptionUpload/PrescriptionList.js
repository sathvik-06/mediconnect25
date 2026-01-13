// src/components/patient/PrescriptionUpload/PrescriptionList.js
import React from 'react';
import PrescriptionCard from './PrescriptionCard';
import './PrescriptionList.css';

const PrescriptionList = ({ prescriptions, onStatusUpdate, onDelete }) => {
  if (prescriptions.length === 0) {
    return (
      <div className="empty-prescriptions">
        <div className="empty-icon">📄</div>
        <h3>No Prescriptions Found</h3>
        <p>Upload your first prescription to get started with online medicine orders.</p>
      </div>
    );
  }

  return (
    <div className="prescription-list">
      <div className="prescriptions-grid">
        {prescriptions.map(prescription => (
          <PrescriptionCard
            key={prescription._id}
            prescription={prescription}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
            showOrderButton={false}
          />
        ))}
      </div>
    </div>
  );
};

export default PrescriptionList;