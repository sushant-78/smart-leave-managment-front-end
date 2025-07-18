import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { leaveService } from "../services/leaveService";
import type {
  Leave,
  LeaveBalance,
  CreateLeaveRequest,
  ApproveLeaveRequest,
} from "../services/leaveService";

// Leave state interface
interface LeaveState {
  leaves: Leave[];
  balances: LeaveBalance[];
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
const initialState: LeaveState = {
  leaves: [],
  balances: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// Async thunks
export const fetchLeaves = createAsyncThunk(
  "leaves/fetchLeaves",
  async ({
    page,
    limit,
    year,
  }: { page?: number; limit?: number; year?: number } = {}) => {
    const response = await leaveService.getLeaves(page, limit, year);
    return response.data;
  }
);

export const fetchAllLeaves = createAsyncThunk(
  "leaves/fetchAllLeaves",
  async ({
    page,
    limit,
    year,
  }: { page?: number; limit?: number; year?: number } = {}) => {
    const response = await leaveService.getAllLeaves(page, limit, year);
    return response.data;
  }
);

export const fetchLeaveBalances = createAsyncThunk(
  "leaves/fetchLeaveBalances",
  async () => {
    const response = await leaveService.getLeaveBalances();
    return response.data;
  }
);

export const createLeave = createAsyncThunk(
  "leaves/createLeave",
  async (leaveData: CreateLeaveRequest) => {
    const response = await leaveService.createLeave(leaveData);
    return response.data;
  }
);

export const cancelLeave = createAsyncThunk(
  "leaves/cancelLeave",
  async (leaveId: number) => {
    const response = await leaveService.cancelLeave(leaveId);
    return { leaveId, message: response.message };
  }
);

export const approveLeave = createAsyncThunk(
  "leaves/approveLeave",
  async ({
    leaveId,
    approvalData,
  }: {
    leaveId: number;
    approvalData: ApproveLeaveRequest;
  }) => {
    const response = await leaveService.approveLeave(leaveId, approvalData);
    return response.data;
  }
);

// Leave slice
const leaveSlice = createSlice({
  name: "leaves",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearLeaves: (state) => {
      state.leaves = [];
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leaves
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leaves;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leaves";
      })
      // Fetch all leaves (admin only)
      .addCase(fetchAllLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leaves;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all leaves";
      })
      // Fetch leave balances
      .addCase(fetchLeaveBalances.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaveBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.balances = action.payload.balances;
      })
      .addCase(fetchLeaveBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leave balances";
      })
      // Create leave
      .addCase(createLeave.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves.unshift(action.payload.leave);
      })
      .addCase(createLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create leave";
      })
      // Cancel leave
      .addCase(cancelLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelLeave.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leaves.findIndex(
          (leave) => leave.id === action.payload.leaveId
        );
        if (index !== -1) {
          state.leaves[index].status = "rejected";
        }
      })
      .addCase(cancelLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to cancel leave";
      })
      // Approve leave
      .addCase(approveLeave.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveLeave.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLeave = action.payload.leave;

        // Update in leaves array
        const leaveIndex = state.leaves.findIndex(
          (leave) => leave.id === updatedLeave.id
        );
        if (leaveIndex !== -1) {
          state.leaves[leaveIndex] = updatedLeave;
        }
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to approve leave";
      });
  },
});

export const { clearError, clearLeaves } = leaveSlice.actions;
export default leaveSlice.reducer;
