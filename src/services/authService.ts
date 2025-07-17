import api from "./api";
import type { ApiResponse } from "./api";

// Types based on the dummy responses
export interface User {
  id: number;
  name: string;
  email: string;
  role: "employee" | "manager" | "admin";
  manager_id?: number | null;
  created_at: string;
  updated_at: string;
  manager?: User | null;
  reportees?: User[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthResponse {
  user: User;
}

// Authentication service
export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  // Get current user info (for role fetching)
  async getCurrentUser(): Promise<ApiResponse<AuthResponse>> {
    const response = await api.get<ApiResponse<AuthResponse>>("/auth/me");
    return response.data;
  },

  // Logout user
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      "/auth/logout"
    );
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  // Get stored user ID
  getUserId(): string | null {
    return localStorage.getItem("user_id");
  },

  // Store auth data
  storeAuthData(token: string, userId: string): void {
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", userId);
  },

  // Clear auth data
  clearAuthData(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
  },
};
