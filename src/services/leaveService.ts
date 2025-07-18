import api from "./api";
import type { ApiResponse, Pagination } from "./api";
import type { User } from "./authService";

// Types based on the updated database schema
export interface Leave {
  id: number;
  created_by: number;
  manager_id?: number | null;
  from_date: string;
  to_date: string;
  type: "casual" | "sick" | "earned";
  reason: string;
  status: "pending" | "approved" | "rejected";
  manager_comment?: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  manager?: User;
}

export interface LeaveBalance {
  id: number;
  user_id: number;
  type: "casual" | "sick" | "earned";
  balance: number;
  year: number;
}

export interface LeavesResponse {
  leaves: Leave[];
  pagination: Pagination;
}

export interface TeamLeavesResponse {
  leaves: Leave[];
}

export interface LeaveBalancesResponse {
  balances: LeaveBalance[];
}

export interface CreateLeaveRequest {
  from_date: string;
  to_date: string;
  type: "casual" | "sick" | "earned";
  reason: string;
}

export interface ApproveLeaveRequest {
  status: "approved" | "rejected";
  manager_comment: string;
}

// Leave management service
export const leaveService = {
  // Get all leaves (for current user or admin)
  async getLeaves(page = 1, limit = 10): Promise<ApiResponse<LeavesResponse>> {
    const response = await api.get<ApiResponse<LeavesResponse>>(
      `/leaves?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get leave balances for current user
  async getLeaveBalances(): Promise<ApiResponse<LeaveBalancesResponse>> {
    const response = await api.get<ApiResponse<LeaveBalancesResponse>>(
      "/leaves/balance"
    );
    return response.data;
  },

  // Get team leaves (for managers)
  async getTeamLeaves(): Promise<ApiResponse<TeamLeavesResponse>> {
    const response = await api.get<ApiResponse<TeamLeavesResponse>>(
      "/leaves/team"
    );
    return response.data;
  },

  // Get specific leave by ID
  async getLeaveById(id: number): Promise<ApiResponse<{ leave: Leave }>> {
    const response = await api.get<ApiResponse<{ leave: Leave }>>(
      `/leaves/${id}`
    );
    return response.data;
  },

  // Create new leave application
  async createLeave(
    leaveData: CreateLeaveRequest
  ): Promise<ApiResponse<{ leave: Leave }>> {
    const response = await api.post<ApiResponse<{ leave: Leave }>>(
      "/leaves",
      leaveData
    );
    return response.data;
  },

  // Cancel leave (update status to cancelled)
  async cancelLeave(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      `/leaves/${id}`
    );
    return response.data;
  },

  // Approve or reject leave (for managers and admin)
  async approveLeave(
    id: number,
    approvalData: ApproveLeaveRequest
  ): Promise<ApiResponse<{ leave: Leave }>> {
    const response = await api.put<ApiResponse<{ leave: Leave }>>(
      `/leaves/${id}/approve`,
      approvalData
    );
    return response.data;
  },
};
