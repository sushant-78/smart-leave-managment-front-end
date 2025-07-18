import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Pagination,
} from "@mui/material";
import { Visibility, FilterList, Search } from "@mui/icons-material";
import { fetchAuditLogsWithFilters } from "../../store/adminSlice";
import type { RootState, AppDispatch } from "../../store";
import type { AuditLog } from "../../services/adminService";
import { showToast } from "../../utils/toast";
import { formatUTCDate } from "../../utils/dateUtils";

const AuditLogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { auditLogs, loading, error, pagination } = useSelector(
    (state: RootState) => state.admin
  ) as {
    auditLogs: AuditLog[];
    loading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };

  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterResource, setFilterResource] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const filters: {
      page: number;
      limit: number;
      action_type?: string;
    } = { page: currentPage, limit: 20 };

    if (filterAction !== "all") filters.action_type = filterAction;

    dispatch(fetchAuditLogsWithFilters(filters));
  }, [dispatch, currentPage, filterAction]);

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const getActionColor = (
    action: string
  ): "success" | "warning" | "error" | "default" => {
    switch (action.toUpperCase()) {
      case "CREATE":
      case "LOGIN":
        return "success";
      case "UPDATE":
      case "CONFIG_UPDATED":
        return "warning";
      case "DELETE":
        return "error";
      default:
        return "default";
    }
  };

  const getActionDisplayName = (action: string) => {
    switch (action.toLowerCase()) {
      case "config_updated":
        return "Config Updated";
      case "login":
        return "Login";
      case "logout":
        return "Logout";
      case "create":
        return "Create";
      case "update":
        return "Update";
      case "delete":
        return "Delete";
      default:
        return action;
    }
  };

  const getResourceDisplayName = (resource: string) => {
    switch (resource.toLowerCase()) {
      case "auth":
        return "Authentication";
      case "user":
        return "User";
      case "leave":
        return "Leave";
      case "admin":
        return "Admin";
      default:
        return resource;
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesResource =
      filterResource === "all" || log.resource === filterResource;
    const matchesSearch =
      (log.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesResource && matchesSearch;
  });

  // Handle error with toast and show fallback UI
  useEffect(() => {
    if (error) {
      showToast.error("Failed to fetch audit logs. Please try again.");
    }
  }, [error]);

  if (error) {
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
            Audit Logs
          </Typography>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          Track all system activities and user actions
        </Typography>

        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Something went wrong while fetching data
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Unable to load audit logs at this time.
          </Typography>
        </Paper>
      </Box>
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
          Audit Logs
        </Typography>
      </Box>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Track all system activities and user actions
      </Typography>

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
            placeholder="Search by user or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              label="Action"
            >
              <MenuItem value="all">All Actions</MenuItem>
              <MenuItem value="config_updated">Config Updated</MenuItem>
              <MenuItem value="login">Login</MenuItem>
              <MenuItem value="logout">Logout</MenuItem>
              <MenuItem value="create">Create</MenuItem>
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="delete">Delete</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Resource</InputLabel>
            <Select
              value={filterResource}
              onChange={(e) => setFilterResource(e.target.value)}
              label="Resource"
            >
              <MenuItem value="all">All Resources</MenuItem>
              <MenuItem value="auth">Authentication</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="leave">Leave</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="config">Config</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              setSearchTerm("");
              setFilterAction("all");
              setFilterResource("all");
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Audit Logs Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No audit logs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {log.user?.name || `User ID: ${log.created_by}`}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getActionDisplayName(log.action)}
                        color={getActionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {getResourceDisplayName(log.resource)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {log.resource_id}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatUTCDate(log.created_at)}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewLog(log)}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.pages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Log Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Audit Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography variant="subtitle2">User:</Typography>
                <Typography>
                  {selectedLog.user?.name ||
                    `User ID: ${selectedLog.created_by}`}
                </Typography>

                <Typography variant="subtitle2">Action:</Typography>
                <Typography>
                  {getActionDisplayName(selectedLog.action)}
                </Typography>

                <Typography variant="subtitle2">Resource:</Typography>
                <Typography>
                  {getResourceDisplayName(selectedLog.resource)}
                </Typography>

                <Typography variant="subtitle2">Resource ID:</Typography>
                <Typography>{selectedLog.resource_id}</Typography>

                <Typography variant="subtitle2">Created:</Typography>
                <Typography>{formatUTCDate(selectedLog.created_at)}</Typography>

                <Typography variant="subtitle2">Updated:</Typography>
                <Typography>{formatUTCDate(selectedLog.updated_at)}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuditLogs;
