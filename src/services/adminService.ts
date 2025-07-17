import api from "./api";
import type { ApiResponse, Pagination } from "./api";
import type { User } from "./authService";
import type { Leave } from "./leaveService";

// Types based on the dummy responses
export interface SystemConfig {
  id: number;
  year: number;
  working_days_per_week: number;
  holidays: string[];
  leave_types: Record<string, number>;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  users: {
    total: number;
    employees: number;
    managers: number;
    unassigned: number;
  };
  leaves: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  system: {
    currentYear: number;
    configSet: boolean;
    configLocked: boolean;
  };
  recentActivities: Array<{
    id: number;
    action_by: number;
    action_type: string;
    action_target: string;
    timestamp: string;
    user: User;
  }>;
  leaveTypeStats: Array<{
    type: string;
    count: number;
  }>;
}

export interface AuditLog {
  id: number;
  action_by: number;
  action_type: string;
  action_target: string;
  details?: Record<string, unknown>;
  timestamp: string;
  user?: User;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: Pagination;
}

export interface CreateConfigRequest {
  year: number;
  working_days_per_week: number;
  holidays: string[];
  leave_types: Record<string, number>;
}

export interface ResetBalancesResponse {
  resetCount: number;
}

// Admin service
export const adminService = {
  // Get admin dashboard stats
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await api.get<ApiResponse<DashboardStats>>(
      "/admin/dashboard"
    );
    return response.data;
  },

  // Get current year config
  async getCurrentConfig(): Promise<ApiResponse<{ config: SystemConfig }>> {
    const response = await api.get<ApiResponse<{ config: SystemConfig }>>(
      "/admin/config/current"
    );
    return response.data;
  },

  // Get config for specific year
  async getConfigByYear(
    year: number
  ): Promise<ApiResponse<{ config: SystemConfig }>> {
    const response = await api.get<ApiResponse<{ config: SystemConfig }>>(
      `/admin/config/${year}`
    );
    return response.data;
  },

  // Set yearly configuration
  async setConfig(
    configData: CreateConfigRequest
  ): Promise<ApiResponse<{ config: SystemConfig }>> {
    const response = await api.post<ApiResponse<{ config: SystemConfig }>>(
      "/admin/config",
      configData
    );
    return response.data;
  },

  // Lock configuration for the year
  async lockConfig(
    year: number
  ): Promise<ApiResponse<{ config: SystemConfig }>> {
    const response = await api.put<ApiResponse<{ config: SystemConfig }>>(
      `/admin/config/${year}/lock`
    );
    return response.data;
  },

  // Reset leave balances for a year
  async resetBalances(
    year: number
  ): Promise<ApiResponse<ResetBalancesResponse>> {
    const response = await api.post<ApiResponse<ResetBalancesResponse>>(
      `/admin/reset-balances/${year}`
    );
    return response.data;
  },

  // Get pending leaves by manager
  async getPendingLeavesByManager(
    managerId: number
  ): Promise<ApiResponse<{ leaves: Leave[] }>> {
    const response = await api.get<ApiResponse<{ leaves: Leave[] }>>(
      `/admin/pending-leaves/${managerId}`
    );
    return response.data;
  },

  // Get all audit logs
  async getAuditLogs(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<AuditLogsResponse>> {
    const response = await api.get<ApiResponse<AuditLogsResponse>>(
      `/audit?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get current user's audit logs
  async getMyAuditLogs(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<AuditLogsResponse>> {
    const response = await api.get<ApiResponse<AuditLogsResponse>>(
      `/audit/me?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get audit logs for specific user
  async getUserAuditLogs(
    userId: number,
    page = 1,
    limit = 20
  ): Promise<ApiResponse<AuditLogsResponse>> {
    const response = await api.get<ApiResponse<AuditLogsResponse>>(
      `/audit/user/${userId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
