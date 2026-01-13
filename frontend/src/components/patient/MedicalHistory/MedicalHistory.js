// src/components/patient/MedicalHistory/MedicalHistory.js
import React, { useState, useEffect } from 'react';
import { medicalHistoryService } from '../../../services/api/medicalHistory';
import AppointmentHistory from './AppointmentHistory';
import PrescriptionHistory from './PrescriptionHistory';
import ReportViewer from './ReportViewer';
import LoadingSpinner from '../../common/LoadingSpinner/LoadingSpinner';
import './MedicalHistory.css';

const MedicalHistory = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalData();
  }, []);

  const fetchMedicalData = async () => {
    try {
      const [historyData, prescriptionsData, reportsData] = await Promise.all([
        medicalHistoryService.getAppointmentHistory(),
        medicalHistoryService.getPrescriptions(),
        medicalHistoryService.getMedicalReports()
      ]);

      setMedicalHistory(historyData);
      setPrescriptions(prescriptionsData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching medical data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'appointments', label: 'Appointment History', count: medicalHistory.length },
    { id: 'prescriptions', label: 'Prescriptions', count: prescriptions.length },
    { id: 'reports', label: 'Medical Reports', count: reports.length }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="medical-history">
      <div className="medical-header">
        <h1>Medical History</h1>
        <p>View your complete healthcare journey and records</p>
      </div>

      <div className="medical-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'appointments' && (
          <AppointmentHistory history={medicalHistory} />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionHistory prescriptions={prescriptions} />
        )}

        {activeTab === 'reports' && (
          <ReportViewer reports={reports} />
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;