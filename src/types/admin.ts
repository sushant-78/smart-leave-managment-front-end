export interface SystemConfig {
  id: number;
  year: number;
  working_days_per_week: 4 | 5 | 6;
  holidays: string[];
  leave_types: string[];
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  action_by: number;
  action_type: string;
  action_target: string;
  details?: Record<string, unknown>;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalLeaves: number;
  pendingLeaves: number;
  unassignedUsers: number;
  leaveTypes: string[];
}

export interface AdminState {
  systemConfig: SystemConfig | null;
  auditLogs: AuditLog[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}
