// src/services/api/prescriptions.js
import api from './config.js';

export const prescriptionService = {
  async getPrescriptions(status) {
    const url = status ? `/prescriptions?status=${status}` : '/prescriptions';
    const response = await api.get(url);
    return response.prescriptions;
  },

  async uploadPrescription(file) {
    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const response = await api.post('/prescriptions/upload', formData);
      return response;
    } catch (error) {
      console.error('API Upload Error:', error.response?.data || error.message);
      throw error;
    }
    return response;
  },

  async downloadPrescription(prescriptionId) {
    const response = await api.get(`/prescriptions/${prescriptionId}/download`);
    return response.downloadUrl;
  },

  async deletePrescription(prescriptionId) {
    const response = await api.delete(`/prescriptions/${prescriptionId}`);
    return response;
  },

  async orderMedicines(prescriptionId) {
    const response = await api.post(`/prescriptions/${prescriptionId}/order`);
    return response;
  },

  async getPrescriptionStatus(prescriptionId) {
    const response = await api.get(`/prescriptions/${prescriptionId}/status`);
    return response.status;
  },

  async validatePrescription(id, status, notes) {
    const response = await api.put(`/prescriptions/${id}/validate`, { status, validationNotes: notes });
    return response;
  },

  async updatePrescription(id, data) {
    const response = await api.put(`/prescriptions/${id}`, data);
    return response;
  },

  async createPrescription(data) {
    const response = await api.post('/prescriptions', data);
    return response;
  }
};