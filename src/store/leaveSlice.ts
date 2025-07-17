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
  teamLeaves: Leave[];
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
  teamLeaves: [],
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
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await leaveService.getLeaves(page, limit);
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

export const fetchTeamLeaves = createAsyncThunk(
  "leaves/fetchTeamLeaves",
  async () => {
    const response = await leaveService.getTeamLeaves();
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
    return { leaveId, message: response.data.message };
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
      // Fetch team leaves
      .addCase(fetchTeamLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.teamLeaves = action.payload.leaves;
      })
      .addCase(fetchTeamLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch team leaves";
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

        // Update in team leaves array
        const teamLeaveIndex = state.teamLeaves.findIndex(
          (leave) => leave.id === updatedLeave.id
        );
        if (teamLeaveIndex !== -1) {
          state.teamLeaves[teamLeaveIndex] = updatedLeave;
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
