import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeService } from "../services/employeeService";
import type { EmployeeDashboardResponse } from "../services/employeeService";

// Employee state interface
interface EmployeeState {
  dashboardData: EmployeeDashboardResponse | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EmployeeState = {
  dashboardData: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchEmployeeDashboard = createAsyncThunk(
  "employee/fetchDashboard",
  async () => {
    const response = await employeeService.getDashboardData();
    console.log("response 24", response);
    return response;
  }
);

// Employee slice
const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboardData: (state) => {
      state.dashboardData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employee dashboard
      .addCase(fetchEmployeeDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchEmployeeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch dashboard data";
      });
  },
});

export const { clearError, clearDashboardData } = employeeSlice.actions;
export default employeeSlice.reducer;
