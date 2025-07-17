import api from "./api";
import type { ApiResponse, Pagination } from "./api";
import type { User } from "./authService";

// Types based on the dummy responses
export interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

export interface UnassignedUsersResponse {
  users: User[];
}

export interface ManagersResponse {
  managers: User[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "employee" | "manager";
  manager_id?: number;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "employee" | "manager";
  manager_id?: number;
}

// User management service
export const userService = {
  // Get all users with pagination
  async getUsers(page = 1, limit = 10): Promise<ApiResponse<UsersResponse>> {
    const response = await api.get<ApiResponse<UsersResponse>>(
      `/users?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get unassigned users (users without manager)
  async getUnassignedUsers(): Promise<ApiResponse<UnassignedUsersResponse>> {
    const response = await api.get<ApiResponse<UnassignedUsersResponse>>(
      "/users/unassigned"
    );
    return response.data;
  },

  // Get all managers
  async getManagers(): Promise<ApiResponse<ManagersResponse>> {
    const response = await api.get<ApiResponse<ManagersResponse>>(
      "/users/managers"
    );
    return response.data;
  },

  // Get specific user by ID
  async getUserById(id: number): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data;
  },

  // Create new user
  async createUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post<ApiResponse<{ user: User }>>(
      "/users",
      userData
    );
    return response.data;
  },

  // Update user
  async updateUser(
    id: number,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put<ApiResponse<{ user: User }>>(
      `/users/${id}`,
      userData
    );
    return response.data;
  },

  // Delete user
  async deleteUser(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/users/${id}`
    );
    return response.data;
  },
};
