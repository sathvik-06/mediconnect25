// src/services/api/appointments.js
import api from './config.js';

export const appointmentService = {
  async getPatientAppointments() {
    const response = await api.get('/appointments/patient');
    return response.appointments;
  },

  async bookAppointment(appointmentData) {
    const response = await api.post('/appointments/book', appointmentData);
    return response;
  },

  async getDoctorAppointments() {
    const response = await api.get('/appointments/doctor');
    return response;
  },

  async updateAppointmentStatus(appointmentId, status) {
    const response = await api.put(`/appointments/${appointmentId}/status`, { status });
    return response;
  },

  async getDoctorAvailability(doctorId, date) {
    const response = await api.get(`/appointments/availability/${doctorId}?date=${date}`);
    return response.availability;
  },

  async cancelAppointment(appointmentId) {
    const response = await api.put(`/appointments/${appointmentId}/cancel`);
    return response;
  },

  async rescheduleAppointment(appointmentId, newDate) {
    const response = await api.put(`/appointments/${appointmentId}/reschedule`, {
      newDate
    });
    return response;
  },

  // Workflow methods
  async checkInAppointment(appointmentId) {
    const response = await api.post(`/appointments/${appointmentId}/check-in`);
    return response.data;
  },

  async startConsultation(appointmentId) {
    const response = await api.post(`/appointments/${appointmentId}/start`);
    return response.data;
  },

  async completeConsultation(appointmentId, data) {
    const response = await api.post(`/appointments/${appointmentId}/complete`, data);
    return response.data;
  },

  async markNoShow(appointmentId) {
    const response = await api.post(`/appointments/${appointmentId}/no-show`);
    return response.data;
  }
};