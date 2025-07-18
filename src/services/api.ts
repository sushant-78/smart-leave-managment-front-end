import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { STORAGE_KEYS } from "../utils/constants";

// API base URL - will be set from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data and dispatch event
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_ID);

      // Dispatch custom event for components to handle
      window.dispatchEvent(new CustomEvent("unauthorized"));
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

// Error response type
export interface ApiError {
  success: false;
  message: string;
  error?: unknown;
}

// Pagination type
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default api;
