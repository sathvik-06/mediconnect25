// src/services/api/config.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = {
  async request(url, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
      ...options.headers,
    };

    // Only set Content-Type to json if body is not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  },

  get(url) {
    return this.request(url);
  },

  post(url, data) {
    const isFormData = data instanceof FormData;
    return this.request(url, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  put(url, data) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(url) {
    return this.request(url, {
      method: 'DELETE',
    });
  }
};

export default api;