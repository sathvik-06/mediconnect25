// src/services/api/medicalHistory.js
import api from './config.js';

export const medicalHistoryService = {
  async getAppointmentHistory() {
    const response = await api.get('/medical-history/appointments');
    return response.appointments;
  },

  async getPrescriptions() {
    const response = await api.get('/medical-history/prescriptions');
    return response.prescriptions;
  },

  async getMedicalReports() {
    const response = await api.get('/medical-history/reports');
    return response.reports;
  },

  async uploadMedicalReport(reportData) {
    const response = await api.post('/medical-history/reports/upload', reportData);
    return response.report;
  },

  async downloadReport(reportId) {
    const response = await api.get(`/medical-history/reports/${reportId}/download`);
    return response;
  }
};