import api from "./api";
import type { ApiResponse, Pagination } from "./api";
import type { User } from "./authService";

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
  employee: User;
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

export interface ManagerLeave extends Omit<Leave, "user"> {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface ManagerLeavesResponse {
  leaves: ManagerLeave[];
}

export const leaveService = {
  async getLeaves(
    page?: number,
    limit?: number,
    year?: number
  ): Promise<ApiResponse<LeavesResponse>> {
    let url = "/leaves";
    const params = new URLSearchParams();

    if (page && limit) {
      params.append("page", page.toString());
      params.append("limit", limit.toString());
    }

    if (year) {
      params.append("year", year.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get<ApiResponse<LeavesResponse>>(url);
    return response.data;
  },

  async getLeaveBalances(): Promise<ApiResponse<LeaveBalancesResponse>> {
    const response = await api.get<ApiResponse<LeaveBalancesResponse>>(
      "/leaves/balance"
    );
    return response.data;
  },

  async getLeaveById(id: number): Promise<ApiResponse<{ leave: Leave }>> {
    const response = await api.get<ApiResponse<{ leave: Leave }>>(
      `/leaves/${id}`
    );
    return response.data;
  },

  async createLeave(
    leaveData: CreateLeaveRequest
  ): Promise<ApiResponse<{ leave: Leave }>> {
    const response = await api.post<ApiResponse<{ leave: Leave }>>(
      "/leaves",
      leaveData
    );
    return response.data;
  },

  async cancelLeave(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await api.put<ApiResponse<{ message: string }>>(
      `/leaves/${id}`
    );
    return response.data;
  },

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

  async getManagerLeaves(): Promise<ApiResponse<ManagerLeavesResponse>> {
    const response = await api.get<ApiResponse<ManagerLeavesResponse>>(
      "/managers/leaves"
    );
    return response.data;
  },

  async getAllLeaves(
    page?: number,
    limit?: number,
    year?: number
  ): Promise<ApiResponse<LeavesResponse>> {
    let url = "/leaves/all";
    const params = new URLSearchParams();

    if (page && limit) {
      params.append("page", page.toString());
      params.append("limit", limit.toString());
    }

    if (year) {
      params.append("year", year.toString());
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get<ApiResponse<LeavesResponse>>(url);
    return response.data;
  },
};
