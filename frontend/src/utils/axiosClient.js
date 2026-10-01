import axios from "axios";

// Determine base backend URL
const getBaseURL = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    // Fallback in dev
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:4000';
    }
    return 'https://codeblaze-backend.onrender.com';
};

const axiosClient = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor to attach JWT token from localStorage if present
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to store token on login/register if returned
axiosClient.interceptors.response.use(
    (response) => {
        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            const currentPath = window.location.pathname;
            if (currentPath !== '/login' && currentPath !== '/signup') {
                // Clear stale token if unauthorized
                // localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
