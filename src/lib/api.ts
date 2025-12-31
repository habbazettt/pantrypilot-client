import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const SESSION_KEY = "pantrypilot_session";
const AUTH_STORAGE_KEY = "auth-storage"; // Zustand persist key

api.interceptors.request.use((config) => {
    // Try to get token from Zustand store first (it stores as JSON string)
    let token = null;
    try {
        const authStorage = localStorage.getItem(AUTH_STORAGE_KEY);
        if (authStorage) {
            const parsed = JSON.parse(authStorage);
            token = parsed.state?.token;
        }
    } catch (e) {
        // ignore parse error
    }

    // Fallback to legacy session key if no auth store token
    if (!token) {
        token = localStorage.getItem(SESSION_KEY);
    }

    if (token) {
        // Check if token is already Bearer formatted
        if (token.startsWith('Bearer ')) {
            config.headers.Authorization = token;
        } else {
            // For backward compatibility or raw tokens, use Bearer scheme
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Also keep legacy header for now just in case backend checks it somewhere else (though we migrated)
        config.headers["x-session-token"] = token;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global 401 handler
        if (error.response?.status === 401) {
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                // Optional: Clear auth and redirect
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
