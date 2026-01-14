// src/services/api/config.js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Debug logging for deployment troubleshooting
console.log('🔧 API Configuration:');
console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL || '(not set)');
console.log('  - Using API Base URL:', API_BASE_URL);


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

    try {
      const fullUrl = `${API_BASE_URL}${url}`;
      console.log(`📡 API Request: ${options.method || 'GET'} ${fullUrl}`);

      const response = await fetch(fullUrl, config);

      if (response.status === 401) {
        console.warn('🔒 Unauthorized - clearing session');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `API error: ${response.status}`;
        console.error(`❌ API Error (${response.status}):`, errorMessage);
        throw new Error(errorMessage);
      }

      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
      return data;
    } catch (error) {
      // Network errors or JSON parsing errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('🌐 Network Error: Cannot reach API server at', API_BASE_URL);
        console.error('   Make sure VITE_API_URL is set correctly in Vercel');
        throw new Error('Cannot connect to server. Please check your internet connection.');
      }
      throw error;
    }
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