import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Pharmacy API endpoints
export const pharmacyAPI = {
    // Get pharmacy dashboard stats
    getDashboardStats: () => api.get('/pharmacy/dashboard'),

    // Orders
    getOrders: (params) => api.get('/pharmacy/orders', { params }),
    getOrderById: (orderId) => api.get(`/pharmacy/orders/${orderId}`),
    updateOrderStatus: (orderId, status) => api.put(`/pharmacy/orders/${orderId}/status`, { status }),
    createOrder: (orderData) => api.post(`/pharmacy/orders`, orderData),
    acceptOrder: (orderId) => api.post(`/pharmacy/orders/${orderId}/accept`),
    rejectOrder: (orderId, reason) => api.post(`/pharmacy/orders/${orderId}/reject`, { reason }),
    cancelOrder: (orderId, reason) => api.post(`/pharmacy/orders/${orderId}/cancel`, { reason }),
    markAsReady: (orderId) => api.post(`/pharmacy/orders/${orderId}/ready`),
    markAsDelivered: (orderId) => api.post(`/pharmacy/orders/${orderId}/delivered`),

    // Inventory
    getInventory: (params) => api.get('/pharmacy/inventory', { params }),
    getMedicineById: (medicineId) => api.get(`/pharmacy/inventory/${medicineId}`),
    addMedicine: (medicineData) => api.post('/pharmacy/medicines', medicineData),
    updateMedicine: (medicineId, medicineData) => api.put(`/pharmacy/medicines/${medicineId}`, medicineData),
    deleteMedicine: (medicineId) => api.delete(`/pharmacy/medicines/${medicineId}`),
    updateStock: (medicineId, quantity) => api.patch(`/pharmacy/inventory/${medicineId}/stock`, { quantity }),
    getLowStockItems: () => api.get('/pharmacy/inventory/low-stock'),

    // Prescription validation
    validatePrescription: (prescriptionId, validationData) =>
        api.post(`/pharmacy/prescriptions/${prescriptionId}/validate`, validationData),
    getPrescription: (prescriptionId) => api.get(`/pharmacy/prescriptions/${prescriptionId}`),

    // Payment
    createPaymentOrder: (orderData) => api.post('/pharmacy/payment/create-order', orderData),
    verifyPayment: (paymentData) => api.post('/pharmacy/payment/verify', paymentData),
    getPaymentHistory: (params) => api.get('/pharmacy/payment/history', { params }),

    // Analytics
    getAnalytics: (params) => api.get('/pharmacy/analytics', { params }),
    getRevenueReport: (startDate, endDate) =>
        api.get('/pharmacy/analytics/revenue', { params: { startDate, endDate } }),
    getTopSellingMedicines: (limit = 10) =>
        api.get('/pharmacy/analytics/top-selling', { params: { limit } }),
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

export default pharmacyAPI;
