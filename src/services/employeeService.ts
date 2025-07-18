import api from "./api";
import type { ApiResponse } from "./api";
import type { Leave } from "./leaveService";
import type { SystemConfig } from "./adminService";

// Employee dashboard types
export interface EmployeeLeaveBalance {
  type: "casual" | "sick" | "earned";
  total: number;
  used: number;
  remaining: number;
}

export interface EmployeeDashboardData {
  currentYear: number;
  systemConfig: SystemConfig | null;
  leaveBalances: EmployeeLeaveBalance[];
  latestPendingRequest: Leave | null;
}

export interface EmployeeDashboardResponse {
  currentYear: number;
  systemConfig: {
    id: number;
    year: number;
    holidays: Record<string, string>;
    working_days_per_week: number;
    leave_types: Record<string, number>;
    created_by: number | null;
    createdAt: string;
    updatedAt: string;
    creator?: {
      id: number;
      name: string;
      email: string;
    };
  } | null;
  leaveBalances: Array<{
    type: "casual" | "sick" | "earned";
    total: number;
    used: number;
    remaining: number;
  }>;
  latestPendingRequest: {
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
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      manager_id?: number | null;
      created_at: string;
      updated_at: string;
      manager?: {
        id: number;
        name: string;
        email: string;
        role: string;
      } | null;
      reportees?: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
      }>;
    };
    manager?: {
      id: number;
      name: string;
      email: string;
      role: string;
    } | null;
  } | null;
}

// Employee service
export const employeeService = {
  // Get employee dashboard data
  async getDashboardData(): Promise<EmployeeDashboardResponse> {
    const response = await api.get<ApiResponse<EmployeeDashboardResponse>>(
      "/users/dashboard"
    );
    return response.data.data;
  },
};
