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
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Person,
  SupervisorAccount,
  Search,
  FilterList,
} from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchUsers,
  fetchManagers,
  createUser,
  updateUser,
  deleteUser,
} from "../../store/userSlice";
import type { User } from "../../services/authService";
import { showToast } from "../../utils/toast";

interface UserFormData {
  name: string;
  email: string;
  role: "employee" | "manager";
  manager_id?: number;
}

interface DeleteConfirmDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({
  open,
  user,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete user <strong>{user?.name}</strong>?
      </Typography>
      <Alert severity="warning" sx={{ mt: 2 }}>
        This action will permanently delete the user and all associated data
        including leaves, applications, and role assignments.
      </Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

const UserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, managers, loading, error } = useSelector(
    (state: RootState) => state.users
  ) as {
    users: User[];
    managers: User[];
    loading: boolean;
    error: string | null;
  };

  // Form and dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [userStatusFilter, setUserStatusFilter] = useState<string>("all");

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "employee",
  });

  useEffect(() => {
    dispatch(fetchUsers({ page: 1, limit: 50 }));
    dispatch(fetchManagers());
  }, [dispatch]);

  // Handle error state with toast
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role === "admin" ? "employee" : user.role,
        manager_id: user.manager_id || undefined,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "employee",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update user - only role and manager can be updated
        const updatePayload = {
          id: editingUser.id,
          userData: {
            name: formData.name,
            role: formData.role,
            manager_id:
              formData.role === "employee" ? formData.manager_id : undefined,
          },
        };
        console.log("Update user payload:", updatePayload);
        await dispatch(updateUser(updatePayload)).unwrap();
        showToast.success("User updated successfully!");
      } else {
        // Create user - email will be the password
        await dispatch(
          createUser({
            name: formData.name,
            email: formData.email,
            password: formData.email, // Email is the password
            role: formData.role,
            manager_id:
              formData.role === "employee" ? formData.manager_id : undefined,
          })
        ).unwrap();
        showToast.success(
          "User created successfully! Email is set as the password."
        );
      }
      handleCloseDialog();
    } catch (error) {
      console.error("User operation failed:", error);
      showToast.error(
        editingUser ? "Failed to update user" : "Failed to create user"
      );
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await dispatch(deleteUser(userToDelete.id)).unwrap();
      showToast.success("User deleted successfully!");
      setDeleteDialog(false);
      setUserToDelete(null);
    } catch {
      showToast.error("Failed to delete user");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
    setUserToDelete(null);
  };

  const getRoleIcon = (role: string) => {
    return role === "manager" ? <SupervisorAccount /> : <Person />;
  };

  const getRoleColor = (role: string): "primary" | "default" => {
    return role === "manager" ? "primary" : "default";
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    const matchesUserStatus =
      userStatusFilter === "all" ||
      (userStatusFilter === "assigned" &&
        user.role === "employee" &&
        user.manager_id) ||
      (userStatusFilter === "unassigned" &&
        user.role === "employee" &&
        !user.manager_id);

    return matchesSearch && matchesRole && matchesUserStatus;
  });

  const getManagerName = (managerId?: number | null) => {
    if (!managerId) return "No Manager";
    const manager = managers.find((m: User) => m.id === managerId);
    return manager ? manager.name : `Manager ${managerId}`;
  };

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

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            size="small"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Role"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>User Status</InputLabel>
            <Select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              label="User Status"
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setUserStatusFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

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
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
                    <TableCell>{getManagerName(user.manager_id)}</TableCell>
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
                        onClick={() => handleDeleteClick(user)}
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
            {!editingUser && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Note:</strong> The email address will be set as the
                initial password for the new user.
              </Alert>
            )}

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
                disabled={!!editingUser}
                helperText={editingUser ? "Email cannot be changed" : ""}
              />

              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as "employee" | "manager",
                      manager_id:
                        e.target.value === "manager"
                          ? undefined
                          : formData.manager_id,
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
                        manager_id: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    label="Manager"
                  >
                    <MenuItem value="">No Manager (Unassigned)</MenuItem>
                    {managers.map((manager: User) => (
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog}
        user={userToDelete}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default UserManagement;
