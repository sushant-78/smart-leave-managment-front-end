// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
// Leave Types
export const LEAVE_TYPES = ["casual", "sick", "earned"] as const;

// Leave Status
export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

// User Roles
export const USER_ROLES = {
  EMPLOYEE: "employee",
  MANAGER: "manager",
  ADMIN: "admin",
} as const;

// Working Days Options
export const WORKING_DAYS_OPTIONS = [4, 5, 6] as const;

// Action Types for Audit Logs
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

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "smart_leave_token",
  USER_ID: "smart_leave_user_id",
} as const;

// Routes
export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  LEAVES: "/leaves",
  ADMIN: "/admin",
  MANAGER: "/manager",
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  API: "YYYY-MM-DD",
  CALENDAR: "YYYY-MM-DD",
} as const;
