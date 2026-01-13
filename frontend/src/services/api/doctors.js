// src/services/api/doctors.js
import api from './config.js';

export const doctorsService = {
  async getAllDoctors() {
    const response = await api.get('/doctors');
    return response.doctors;
  },

  async getDoctorsBySpecialty(specialty) {
    const response = await api.get(`/doctors/specialty/${specialty}`);
    return response.doctors;
  },

  async searchDoctors(query) {
    const response = await api.get(`/doctors/search?q=${encodeURIComponent(query)}`);
    return response.doctors;
  },

  async getDoctorById(doctorId) {
    const response = await api.get(`/doctors/${doctorId}`);
    return response.doctor;
  },

  async getDoctorAvailability(doctorId, date) {
    const response = await api.get(`/doctors/${doctorId}/availability?date=${date}`);
    return response.availability;
  },

  async updateProfile(profileData) {
    const response = await api.put('/doctors/profile', profileData);
    return response.doctor;
  },

  async getDashboardStats() {
    const response = await api.get('/doctors/dashboard-stats');
    return response.stats;
  }
};