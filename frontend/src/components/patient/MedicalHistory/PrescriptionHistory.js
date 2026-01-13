// src/components/patient/MedicalHistory/PrescriptionHistory.js
import React from 'react';
import './PrescriptionHistory.css';

const PrescriptionHistory = ({ prescriptions }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownloadPDF = (prescription) => {
    try {
      // Generate prescription content
      const content = `
MEDICAL PRESCRIPTION
====================

Prescribed by: ${prescription.doctor?.name ? `Dr. ${prescription.doctor.name}` : 'Self Uploaded'}
Date: ${formatDate(prescription.createdAt || prescription.date)}
${prescription.diagnosis ? `Diagnosis: ${prescription.diagnosis}` : ''}

MEDICINES:
${prescription.medicines && prescription.medicines.length > 0
          ? prescription.medicines.map((m, i) => `
${i + 1}. ${m.name}
   Dosage: ${m.dosage}
   Frequency: ${m.frequency}
   Duration: ${m.duration}
   ${m.notes ? `Notes: ${m.notes}` : ''}
`).join('\n')
          : 'No medicines prescribed'}

${prescription.notes ? `DOCTOR'S NOTES:\n${prescription.notes}` : ''}

Status: ${prescription.status}
`;

      // Create and download the file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Prescription_${formatDate(prescription.createdAt || prescription.date).replace(/\s/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading prescription:', error);
      alert('Failed to download prescription. Please try again.');
    }
  };

  if (prescriptions.length === 0) {
    return (
      <div className="empty-prescriptions">
        <div className="empty-icon">💊</div>
        <h3>No Prescriptions</h3>
        <p>Your prescriptions will appear here once prescribed by doctors.</p>
      </div>
    );
  }

  return (
    <div className="prescription-history">
      <h3>Prescription History</h3>

      <div className="prescriptions-list">
        {prescriptions.map((prescription) => (
          <div key={prescription._id} className="prescription-card">
            <div className="prescription-header">
              <div className="prescription-info">
                <h4>
                  {prescription.doctor?.name
                    ? `Dr. ${prescription.doctor.name}`
                    : 'Self Uploaded'}
                </h4>
                <p className="date">Prescribed on {formatDate(prescription.createdAt || prescription.date)}</p>
                {prescription.diagnosis && (
                  <p className="diagnosis">
                    <strong>Diagnosis:</strong> {prescription.diagnosis}
                  </p>
                )}
              </div>

              <div className="prescription-status">
                <span className={`status ${prescription.status}`}>
                  {prescription.status}
                </span>
              </div>
            </div>

            {prescription.medicines && prescription.medicines.length > 0 && (
              <div className="medicines-list">
                <h5>Medicines:</h5>
                {prescription.medicines.map((medicine, index) => (
                  <div key={index} className="medicine-item">
                    <span className="medicine-name">{medicine.name}</span>
                    <span className="medicine-dosage">
                      {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                    </span>
                    <span className="medicine-notes">{medicine.notes}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Show file preview link/button if it's an uploaded prescription */}
            {prescription.fileUrl && (
              <div className="file-link">
                <a href={prescription.fileUrl} target="_blank" rel="noopener noreferrer">View Prescription File</a>
              </div>
            )}

            {prescription.notes && (
              <div className="prescription-notes">
                <strong>Doctor's Notes:</strong> {prescription.notes}
              </div>
            )}

            <div className="prescription-actions">
              <button
                className="btn btn-outline btn-small"
                onClick={() => handleDownloadPDF(prescription)}
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionHistory;