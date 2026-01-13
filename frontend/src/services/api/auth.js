// src/services/api/auth.js
import api from './config.js';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response;
  },

  async verifyToken(token) {
    const response = await api.get('/auth/verify');
    return response.user;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh-token');
    localStorage.setItem('token', response.token);
    return response;
  },

  async forgotPassword(phone) {
    const response = await api.post('/auth/forgot-password', { phone });
    return response;
  },

  async verifyOTP(phone, otp) {
    const response = await api.post('/auth/verify-otp', { phone, otp });
    return response;
  },

  async resetPassword(resetToken, newPassword) {
    const response = await api.post('/auth/reset-password', { resetToken, newPassword });
    return response;
  }
};