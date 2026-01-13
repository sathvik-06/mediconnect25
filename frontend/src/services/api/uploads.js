import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Uploads API endpoints
export const uploadsAPI = {
    // Upload single file
    upload: (formData, config = {}) => api.post('/uploads', formData, config),

    // Upload prescription
    uploadPrescription: (formData, config = {}) =>
        api.post('/uploads/prescription', formData, config),

    // Upload medical report
    uploadMedicalReport: (formData, config = {}) =>
        api.post('/uploads/medical-report', formData, config),

    // Upload profile picture
    uploadProfilePicture: (formData, config = {}) =>
        api.post('/uploads/profile-picture', formData, config),

    // Get file by ID
    getFile: (fileId) => api.get(`/uploads/${fileId}`),

    // Delete file
    deleteFile: (fileId) => api.delete(`/uploads/${fileId}`),

    // Get user's uploaded files
    getUserFiles: (params) => api.get('/uploads/user', { params }),

    // Get file URL
    getFileUrl: (fileId) => `${API_BASE_URL}/uploads/${fileId}/download`,
};

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default uploadsAPI;
