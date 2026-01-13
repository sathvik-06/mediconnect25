import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, endpoint, data = null, config = {}) => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...config.headers,
            };

            const response = await axios({
                method,
                url: `${API_BASE_URL}${endpoint}`,
                data,
                headers,
                ...config,
            });

            setLoading(false);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Request failed';
            setError(errorMessage);
            setLoading(false);
            return { success: false, error: errorMessage };
        }
    }, []);

    const get = useCallback((endpoint, config) => request('GET', endpoint, null, config), [request]);
    const post = useCallback((endpoint, data, config) => request('POST', endpoint, data, config), [request]);
    const put = useCallback((endpoint, data, config) => request('PUT', endpoint, data, config), [request]);
    const patch = useCallback((endpoint, data, config) => request('PATCH', endpoint, data, config), [request]);
    const del = useCallback((endpoint, config) => request('DELETE', endpoint, null, config), [request]);

    return {
        loading,
        error,
        get,
        post,
        put,
        patch,
        delete: del,
        request,
    };
};

export default useApi;
