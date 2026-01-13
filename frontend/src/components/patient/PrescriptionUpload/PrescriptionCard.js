// src/components/patient/PrescriptionUpload/PrescriptionCard.js
import React, { useState } from 'react';
import { prescriptionService } from '../../../services/api/prescriptions';
import './PrescriptionCard.css';

const PrescriptionCard = ({ prescription, onStatusUpdate, onDelete, showOrderButton = true, showDeleteButton = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const {
    _id,
    fileName = 'Unknown File',
    fileUrl = '',
    fileSize = 0,
    status = 'pending',
    createdAt,
    validatedBy,
    validationNotes,
    medicines
  } = prescription || {};

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return '#059669';
      case 'rejected':
        return '#dc2626';
      case 'pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📄';
    }
  };

  const handleDownload = async () => {
    try {
      if (fileUrl) {
        const downloadUrl = await prescriptionService.downloadPrescription(_id);
        window.open(downloadUrl, '_blank');
      } else {
        // Handle digital prescription download
        const content = `
MEDICAL PRESCRIPTION
-------------------
Date: ${new Date(createdAt).toLocaleDateString()}
Diagnosis: ${prescription.diagnosis || 'N/A'}

MEDICINES:
${medicines.map((m, i) => `${i + 1}. ${m.name} - ${m.dosage} (${m.frequency}) for ${m.duration}
   Notes: ${m.notes || ''}`).join('\n')}

NOTES:
${prescription.notes || 'None'}
`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `Prescription_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading prescription:', error);
      alert('Failed to download prescription. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      await onDelete(_id);
    }
  };

  return (
    <div className="prescription-card">
      <div className="card-header">
        <div className="file-info">
          <div className="file-icon">{getStatusIcon()}</div>
          <div className="file-details">
            <h4 className="file-name">{fileName}</h4>
            <p className="file-meta">
              {formatFileSize(fileSize)} • {formatDate(createdAt)}
            </p>
          </div>
        </div>

        <div className="status-badge" style={{ color: getStatusColor() }}>
          {status}
        </div>
      </div>

      <div className="prescription-preview">
        {fileUrl ? (
          <div
            className="preview-image"
            onClick={() => !fileUrl.endsWith('.pdf') && setShowFullImage(true)}
            style={{ cursor: fileUrl.endsWith('.pdf') ? 'default' : 'pointer' }}
          >
            {fileUrl.endsWith('.pdf') ? (
              <div className="pdf-preview">
                <div className="pdf-icon">📄</div>
                <span>PDF Document</span>
                <button
                  className="btn btn-outline btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  View PDF
                </button>
              </div>
            ) : (
              <>
                <img
                  src={fileUrl}
                  alt="Prescription"
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    setImageLoaded(true);
                    e.target.style.display = 'none';
                  }}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
                {!imageLoaded && <div className="image-loading">Loading...</div>}
                {imageLoaded && (
                  <div className="preview-overlay">
                    <span>Click to enlarge</span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="preview-image no-image">
            <div className="no-image-placeholder">
              <span>No image available</span>
            </div>
          </div>
        )}
      </div>

      {validationNotes && (
        <div className="validation-notes">
          <strong>Pharmacist Notes:</strong> {validationNotes}
        </div>
      )}

      {validatedBy && (
        <div className="validated-by">
          <strong>Validated by:</strong> {validatedBy.name}
        </div>
      )}

      {medicines && medicines.length > 0 && (
        <div className="medicines-detected">
          <strong>Medicines Detected:</strong>
          <div className="medicines-list">
            {medicines.map((medicine, index) => (
              <span key={index} className="medicine-tag">
                {medicine.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card-actions">
        <button
          className="btn btn-outline btn-small"
          onClick={handleDownload}
        >
          Download PDF
        </button>

        {showDeleteButton && (
          <button
            className="btn btn-danger btn-small"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </div>

      {showFullImage && fileUrl && !fileUrl.endsWith('.pdf') && (
        <div className="image-modal">
          <div className="modal-overlay" onClick={() => setShowFullImage(false)} />
          <div className="modal-content">
            <button
              className="close-button"
              onClick={() => setShowFullImage(false)}
            >
              ×
            </button>
            <img src={fileUrl} alt="Prescription" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;