import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../services/adminService";
import type {
  DashboardStats,
  SystemConfig,
  AuditLog,
  UpdateHolidaysRequest,
  UpdateWorkingDaysRequest,
  UpdateLeaveTypesRequest,
} from "../services/adminService";

// Admin state interface
interface AdminState {
  dashboardStats: DashboardStats | null;
  systemConfig: SystemConfig | null;
  auditLogs: AuditLog[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Initial state
const initialState: AdminState = {
  dashboardStats: null,
  systemConfig: null,
  auditLogs: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async () => {
    const response = await adminService.getDashboardStats();
    return response.data;
  }
);

export const fetchCurrentConfig = createAsyncThunk(
  "admin/fetchCurrentConfig",
  async () => {
    const response = await adminService.getCurrentConfig();
    return response.data;
  }
);

export const fetchConfigByYear = createAsyncThunk(
  "admin/fetchConfigByYear",
  async (year: number) => {
    const response = await adminService.getConfigByYear(year);
    return response.data;
  }
);

export const updateHolidays = createAsyncThunk(
  "admin/updateHolidays",
  async (holidaysData: UpdateHolidaysRequest) => {
    const response = await adminService.updateHolidays(holidaysData);
    return response.data;
  }
);

export const updateWorkingDays = createAsyncThunk(
  "admin/updateWorkingDays",
  async (workingDaysData: UpdateWorkingDaysRequest) => {
    const response = await adminService.updateWorkingDays(workingDaysData);
    return response.data;
  }
);

export const updateLeaveTypes = createAsyncThunk(
  "admin/updateLeaveTypes",
  async (leaveTypesData: UpdateLeaveTypesRequest) => {
    const response = await adminService.updateLeaveTypes(leaveTypesData);
    return response.data;
  }
);

export const resetLeaveBalances = createAsyncThunk(
  "admin/resetLeaveBalances",
  async (year: number) => {
    const response = await adminService.resetBalances(year);
    return response.data;
  }
);

export const fetchAuditLogs = createAsyncThunk(
  "admin/fetchAuditLogs",
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => {
    const response = await adminService.getAuditLogs(page, limit);
    return response.data;
  }
);

export const fetchAuditLogsWithFilters = createAsyncThunk(
  "admin/fetchAuditLogsWithFilters",
  async (params: {
    page?: number;
    limit?: number;
    user_id?: number;
    action_type?: string;
  }) => {
    const response = await adminService.getAuditLogsWithFilters(params);
    return response.data;
  }
);

// Admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuditLogs: (state) => {
      state.auditLogs = [];
      state.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      };
    },
    clearSystemConfig: (state) => {
      state.systemConfig = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dashboard stats";
      })
      // Fetch current config
      .addCase(fetchCurrentConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.systemConfig = action.payload.config;
      })
      .addCase(fetchCurrentConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch system config";
      })
      // Fetch config by year
      .addCase(fetchConfigByYear.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConfigByYear.fulfilled, (state, action) => {
        state.loading = false;
        state.systemConfig = action.payload.config;
      })
      .addCase(fetchConfigByYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch system config";
      })
      // Update holidays
      .addCase(updateHolidays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHolidays.fulfilled, (state, action) => {
        state.loading = false;
        state.systemConfig = action.payload.config;
      })
      .addCase(updateHolidays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update holidays";
      })
      // Update working days
      .addCase(updateWorkingDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkingDays.fulfilled, (state, action) => {
        state.loading = false;
        state.systemConfig = action.payload.config;
      })
      .addCase(updateWorkingDays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update working days";
      })
      // Update leave types
      .addCase(updateLeaveTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.systemConfig = action.payload.config;
      })
      .addCase(updateLeaveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update leave types";
      })
      // Reset leave balances
      .addCase(resetLeaveBalances.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetLeaveBalances.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetLeaveBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to reset leave balances";
      })
      // Fetch audit logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch audit logs";
      })
      // Fetch audit logs with filters
      .addCase(fetchAuditLogsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogsWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAuditLogsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch audit logs";
      });
  },
});

export const { clearError, clearAuditLogs, clearSystemConfig } =
  adminSlice.actions;
export default adminSlice.reducer;
