import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../services/userService";
import { leaveService } from "../services/leaveService";
import type { AssignedUser } from "../services/userService";
import type { ManagerLeave } from "../services/leaveService";

// Import approveLeave from leaveSlice to handle it in managerSlice
import { approveLeave } from "./leaveSlice";

// Manager state interface
interface ManagerState {
  assignedUsers: AssignedUser[];
  teamLeaves: ManagerLeave[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ManagerState = {
  assignedUsers: [],
  teamLeaves: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchManagerUsers = createAsyncThunk(
  "manager/fetchManagerUsers",
  async () => {
    const response = await userService.getManagerUsers();
    return response.data;
  }
);

export const fetchManagerLeaves = createAsyncThunk(
  "manager/fetchManagerLeaves",
  async () => {
    const response = await leaveService.getManagerLeaves();
    return response.data;
  }
);

// Manager slice
const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearManagerData: (state) => {
      state.assignedUsers = [];
      state.teamLeaves = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch manager users
      .addCase(fetchManagerUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedUsers = action.payload.users;
      })
      .addCase(fetchManagerUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch assigned users";
      })
      // Fetch manager leaves
      .addCase(fetchManagerLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.teamLeaves = action.payload.leaves;
      })
      .addCase(fetchManagerLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch team leaves";
      })
      // Handle approveLeave action to refetch data
      .addCase(approveLeave.fulfilled, () => {
        // Refetch both users and leaves to get updated data
        // The actual refetch will be triggered by the component
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to approve leave";
      });
  },
});

export const { clearError, clearManagerData } = managerSlice.actions;
export default managerSlice.reducer;
