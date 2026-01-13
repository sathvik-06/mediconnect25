// src/components/patient/PrescriptionUpload/UploadZone.js
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadZone.css';

const UploadZone = ({ onFileUpload, uploading }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleDragEnter = () => {
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div className="upload-zone">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive || dragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="uploading-content">
            <div className="uploading-spinner"></div>
            <h3>Uploading Prescriptions...</h3>
            <p>Please wait while we process your files</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <div className="upload-icon">📄</div>
            <h3>Upload Prescriptions</h3>
            <p>Drag & drop your prescription files here, or click to browse</p>
            <div className="file-types">
              <span>Supported formats: JPG, PNG, PDF</span>
              <span>Max file size: 10MB</span>
            </div>
            <button
              type="button"
              className="btn btn-primary"
            >
              Choose Files
            </button>
          </div>
        )}
      </div>

      <div className="upload-tips">
        <h4>Tips for better prescription processing:</h4>
        <ul>
          <li>Ensure the prescription is clear and readable</li>
          <li>Take photos in good lighting conditions</li>
          <li>Include all pages of the prescription</li>
          <li>Make sure doctor's signature is visible</li>
          <li>Upload PDF format for multi-page prescriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadZone;