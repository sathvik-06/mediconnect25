// src/components/patient/PrescriptionUpload/PrescriptionUpload.js
import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../../services/api/prescriptions';
import UploadZone from './UploadZone';
import PrescriptionList from './PrescriptionList';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './PrescriptionUpload.css';

const PrescriptionUpload = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const prescriptionsData = await prescriptionService.getPrescriptions();
      setPrescriptions(prescriptionsData);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      const uploadPromises = files.map(file =>
        prescriptionService.uploadPrescription(file)
      );

      const results = await Promise.all(uploadPromises);
      const newPrescriptions = results.map(result => result.prescription);

      setPrescriptions(prev => [...newPrescriptions, ...prev]);

      // Show success message
      alert(`Successfully uploaded ${files.length} prescription(s)`);
    } catch (error) {
      console.error('Error uploading prescriptions:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to upload prescriptions. Please try again.';
      alert(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const updatePrescriptionStatus = (prescriptionId, updates) => {
    setPrescriptions(prev =>
      prev.map(prescription =>
        prescription._id === prescriptionId
          ? { ...prescription, ...updates }
          : prescription
      )
    );
  };

  const deletePrescription = async (prescriptionId) => {
    try {
      await prescriptionService.deletePrescription(prescriptionId);
      setPrescriptions(prev =>
        prev.filter(prescription => prescription._id !== prescriptionId)
      );
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Failed to delete prescription. Please try again.');
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return prescription.status === 'pending';
    if (activeTab === 'approved') return prescription.status === 'approved';
    if (activeTab === 'rejected') return prescription.status === 'rejected';
    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="prescription-upload">
      <div className="upload-header">
        <div className="header-left">
          <h1>Upload Prescriptions</h1>
          <p>Upload your prescriptions and order medicines online</p>
        </div>
      </div>

      <UploadZone
        onFileUpload={handleFileUpload}
        uploading={uploading}
      />

      <div className="prescriptions-section">
        <div className="section-header">
          <h2>Your Prescriptions</h2>
          <div className="prescription-tabs">
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
              <span className="tab-count">{prescriptions.length}</span>
            </button>
            <button
              className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
              <span className="tab-count">
                {prescriptions.filter(p => p.status === 'pending').length}
              </span>
            </button>
            <button
              className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
              <span className="tab-count">
                {prescriptions.filter(p => p.status === 'approved').length}
              </span>
            </button>
            <button
              className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
              <span className="tab-count">
                {prescriptions.filter(p => p.status === 'rejected').length}
              </span>
            </button>
          </div>
        </div>

        <PrescriptionList
          prescriptions={filteredPrescriptions}
          onStatusUpdate={updatePrescriptionStatus}
          onDelete={deletePrescription}
        />
      </div>
    </div>
  );
};

export default PrescriptionUpload;