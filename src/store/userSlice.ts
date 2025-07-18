import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../services/userService";
import type {
  CreateUserRequest,
  UpdateUserRequest,
} from "../services/userService";
import type { User } from "../services/authService";

// User state interface
interface UserState {
  users: User[];
  unassignedUsers: User[];
  managers: User[];
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
const initialState: UserState = {
  users: [],
  unassignedUsers: [],
  managers: [],
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
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await userService.getUsers(page, limit);
    return response.data;
  }
);

export const fetchUnassignedUsers = createAsyncThunk(
  "users/fetchUnassignedUsers",
  async () => {
    const response = await userService.getUnassignedUsers();
    return response.data;
  }
);

export const fetchManagers = createAsyncThunk(
  "users/fetchManagers",
  async () => {
    const response = await userService.getManagers();
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response.data;
    } catch (error) {
      // Extract server error message from response
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const serverMessage = axiosError.response?.data?.message;
      return rejectWithValue({
        message: serverMessage || (error as Error).message,
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, userData }: { id: number; userData: UpdateUserRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.updateUser(id, userData);
      return response.data;
    } catch (error) {
      // Extract server error message from response
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const serverMessage = axiosError.response?.data?.message;
      return rejectWithValue({
        message: serverMessage || (error as Error).message,
      });
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number) => {
    const response = await userService.deleteUser(id);
    return { id, message: response.data.message };
  }
);

// User slice
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
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
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      // Fetch unassigned users
      .addCase(fetchUnassignedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnassignedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.unassignedUsers = action.payload.users;
      })
      .addCase(fetchUnassignedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch unassigned users";
      })
      // Fetch managers
      .addCase(fetchManagers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload.managers;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch managers";
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload.user);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        // Extract server error message from the response
        const errorMessage =
          (action.payload as { message?: string })?.message ||
          action.error.message ||
          "Failed to create user";
        state.error = errorMessage;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user;
        const index = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        const errorMessage =
          (action.payload as { message?: string })?.message ||
          action.error.message ||
          "Failed to update user";
        state.error = errorMessage;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export const { clearError, clearUsers } = userSlice.actions;
export default userSlice.reducer;
