import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Person,
  SupervisorAccount,
} from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../store/userSlice";
import type { User } from "../../services/authService";

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: "employee" | "manager";
  manager_id?: number;
}

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.users) as
    | {
        users: User[];
        loading: boolean;
        error: string | null;
      }
    | undefined;

  // Ensure users is always an array and handle undefined state
  const users =
    userState && Array.isArray(userState.users) ? userState.users : [];
  const loading = userState?.loading || false;
  const error = userState?.error || null;

  // Debug logging
  console.log("UserManagement - userState:", userState);
  console.log("UserManagement - users:", users);
  console.log("UserManagement - loading:", loading);
  console.log("UserManagement - error:", error);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  useEffect(() => {
    console.log("UserManagement - Fetching users...");
    dispatch(fetchUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role === "admin" ? "employee" : user.role,
        manager_id: user.manager_id || undefined,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "employee",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      dispatch(updateUser({ id: editingUser.id, userData: formData }));
    } else {
      dispatch(createUser(formData));
    }
    handleCloseDialog();
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const getRoleIcon = (role: string) => {
    return role === "manager" ? <SupervisorAccount /> : <Person />;
  };

  const getRoleColor = (role: string): "primary" | "default" => {
    return role === "manager" ? "primary" : "default";
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      {/* User Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.manager_id
                        ? `Manager ${user.manager_id}`
                        : "No Manager"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!editingUser}
                helperText={
                  editingUser ? "Leave blank to keep current password" : ""
                }
              />

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "employee" | "manager",
                    })
                  }
                  label="Role"
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                </Select>
              </FormControl>

              {formData.role === "employee" && (
                <FormControl fullWidth>
                  <InputLabel>Manager</InputLabel>
                  <Select
                    value={formData.manager_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        manager_id: e.target.value as number,
                      })
                    }
                    label="Manager"
                  >
                    <MenuItem value="">No Manager</MenuItem>
                    {Array.isArray(users) &&
                      users
                        .filter((user: User) => user.role === "manager")
                        .map((manager: User) => (
                          <MenuItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </MenuItem>
                        ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingUser ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
