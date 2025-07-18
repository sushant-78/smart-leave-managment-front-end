import api from "./api";
import type { ApiResponse, Pagination } from "./api";
import type { User } from "./authService";
import type { Leave } from "./leaveService";
import type { AssignedUser } from "./userService";
import type { ManagerLeave } from "./leaveService";

// Types based on the dummy responses
export interface SystemConfig {
  id: number;
  year: number;
  holidays: Record<string, string>;
  working_days_per_week: number;
  leave_types: Record<string, number>;
  created_by?: number | null; // References users(id), nullable
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    name: string;
    email: string;
  };
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
  created_by: number | null;
  resource: string;
  resource_id: string;
  action: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  pagination: Pagination;
}

export interface UpdateHolidaysRequest {
  year: number;
  holidays: Record<string, string>; // Changed to key-value pairs
}

export interface UpdateWorkingDaysRequest {
  year: number;
  working_days_per_week: number;
}

export interface UpdateLeaveTypesRequest {
  year: number;
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

  // Update holidays for a specific year (upsert)
  async updateHolidays(
    holidaysData: UpdateHolidaysRequest
  ): Promise<ApiResponse<{ config: SystemConfig }>> {
    const response = await api.post<ApiResponse<{ config: SystemConfig }>>(
      `/admin/config/${holidaysData.year}/holidays`,
      {
        holidays: holidaysData.holidays,
      }
    );
    return response.data;
  },

  // Update working days for a specific year (upsert)
  async updateWorkingDays(
    workingDaysData: UpdateWorkingDaysRequest
  ): Promise<ApiResponse<{ config: SystemConfig }>> {
    const response = await api.post<ApiResponse<{ config: SystemConfig }>>(
      `/admin/config/${workingDaysData.year}/working-days`,
      {
        working_days_per_week: workingDaysData.working_days_per_week,
      }
    );
    return response.data;
  },

  // Update leave types for a specific year (upsert)
  async updateLeaveTypes(
    leaveTypesData: UpdateLeaveTypesRequest
  ): Promise<ApiResponse<{ config: SystemConfig }>> {
    const response = await api.post<ApiResponse<{ config: SystemConfig }>>(
      `/admin/config/${leaveTypesData.year}/leave-types`,
      {
        leave_types: leaveTypesData.leave_types,
      }
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

  // Get all audit logs with filters
  async getAuditLogsWithFilters(
    params: {
      page?: number;
      limit?: number;
      user_id?: number;
      action_type?: string;
    } = {}
  ): Promise<ApiResponse<AuditLogsResponse>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.user_id)
      searchParams.append("user_id", params.user_id.toString());
    if (params.action_type)
      searchParams.append("action_type", params.action_type);

    const response = await api.get<ApiResponse<AuditLogsResponse>>(
      `/audit?${searchParams.toString()}`
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

  // Admin team management APIs
  // Get all managers assigned to admin
  async getAdminManagers(): Promise<ApiResponse<{ managers: AssignedUser[] }>> {
    const response = await api.get<ApiResponse<{ managers: AssignedUser[] }>>(
      "/admin/managers"
    );
    return response.data;
  },

  // Get all leaves for admin's managers
  async getAdminLeaves(): Promise<ApiResponse<{ leaves: ManagerLeave[] }>> {
    const response = await api.get<ApiResponse<{ leaves: ManagerLeave[] }>>(
      "/api/admin/leaves"
    );
    return response.data;
  },

  // Get all manager leaves for admin
  async getAdminManagerLeaves(): Promise<
    ApiResponse<{ leaves: ManagerLeave[] }>
  > {
    const response = await api.get<ApiResponse<{ leaves: ManagerLeave[] }>>(
      "/admin/managers/leaves"
    );
    return response.data;
  },
};
