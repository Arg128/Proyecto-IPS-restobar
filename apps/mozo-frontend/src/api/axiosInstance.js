import axios from "axios";

const API_URL =
    process.env.REACT_APP_API_URL ||
    `${process.env.HOST || "http://localhost"}:${process.env.RESTO_BACKEND_PORT || 5000}/api`;

const api = axios.create({
    baseURL: API_URL,
});

let currentToken = null;

export const setAuthToken = (token) => {
    currentToken = token;
};

api.interceptors.request.use((config) => {
    if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
});

export default api;