import api from "./api";
import type { EmployeeDashboardResponse } from "./employeeService";

export interface ManagerDashboardData {
  workingDays: number;
  teamMembers: number;
  pendingApprovals: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  latestRequest?: {
    id: string;
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    status: string;
    reason: string;
  };
}

export const fetchManagerDashboard =
  async (): Promise<EmployeeDashboardResponse> => {
    try {
      const response = await api.get("/managers/dashboard");
      return response.data.data;
    } catch {
      throw new Error("Failed to fetch manager dashboard data");
    }
  };

export const fetchTeamMembers = async () => {
  try {
    const response = await api.get("/manager/team");
    return response.data;
  } catch {
    throw new Error("Failed to fetch team members");
  }
};

export const approveLeaveRequest = async (
  requestId: string,
  approved: boolean,
  comments?: string
) => {
  try {
    const response = await api.put(`/manager/leave-requests/${requestId}`, {
      approved,
      comments,
    });
    return response.data;
  } catch {
    throw new Error("Failed to approve leave request");
  }
};

export const fetchTeamLeaveRequests = async () => {
  try {
    const response = await api.get("/manager/leave-requests");
    return response.data;
  } catch {
    throw new Error("Failed to fetch team leave requests");
  }
};
