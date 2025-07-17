import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../services/adminService";
import type {
  DashboardStats,
  SystemConfig,
  AuditLog,
  CreateConfigRequest,
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

export const setSystemConfig = createAsyncThunk(
  "admin/setSystemConfig",
  async (configData: CreateConfigRequest) => {
    const response = await adminService.setConfig(configData);
    return response.data;
  }
);

export const lockSystemConfig = createAsyncThunk(
  "admin/lockSystemConfig",
  async (year: number) => {
    const response = await adminService.lockConfig(year);
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

export const fetchMyAuditLogs = createAsyncThunk(
  "admin/fetchMyAuditLogs",
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number }) => {
    const response = await adminService.getMyAuditLogs(page, limit);
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
      // Set system config
      .addCase(setSystemConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setSystemConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.systemConfig = action.payload.config;
      })
      .addCase(setSystemConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to set system config";
      })
      // Lock system config
      .addCase(lockSystemConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(lockSystemConfig.fulfilled, (state, action) => {
        state.loading = false;
        if (state.systemConfig) {
          state.systemConfig.is_locked = action.payload.config.is_locked;
        }
      })
      .addCase(lockSystemConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to lock system config";
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
      // Fetch my audit logs
      .addCase(fetchMyAuditLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch my audit logs";
      });
  },
});

export const { clearError, clearAuditLogs } = adminSlice.actions;
export default adminSlice.reducer;
