export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const LEAVE_TYPES = ["casual", "sick", "earned"] as const;

export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const USER_ROLES = {
  EMPLOYEE: "employee",
  MANAGER: "manager",
  ADMIN: "admin",
} as const;

export const WORKING_DAYS_OPTIONS = [4, 5, 6] as const;

export const ACTION_TYPES = {
  LEAVE_APPLIED: "leave_applied",
  LEAVE_APPROVED: "leave_approved",
  LEAVE_REJECTED: "leave_rejected",
  LEAVE_CANCELLED: "leave_cancelled",
  USER_CREATED: "user_created",
  USER_UPDATED: "user_updated",
  USER_DELETED: "user_deleted",
  ROLE_CHANGED: "role_changed",
  MANAGER_ASSIGNED: "manager_assigned",
  BALANCE_RESET: "balance_reset",
  CONFIG_UPDATED: "config_updated",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "smart_leave_token",
  USER_ID: "smart_leave_user_id",
} as const;

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  LEAVES: "/leaves",
  ADMIN: "/admin",
  MANAGER: "/manager",
} as const;

export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  API: "YYYY-MM-DD",
  CALENDAR: "YYYY-MM-DD",
} as const;
