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
  Alert,
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
} from "@mui/material";
import { Visibility, FilterList, Search, Download } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";

interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  resource: string;
  resource_id: number;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

const AuditLogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.admin) as {
    loading: boolean;
    error: string | null;
  };

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterResource, setFilterResource] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // TODO: Load audit logs from API
    console.log("Loading audit logs...");
    // Mock data for now
    setLogs([
      {
        id: 1,
        user_id: 1,
        user_name: "John Doe",
        action: "LOGIN",
        resource: "auth",
        resource_id: 0,
        details: "User logged in successfully",
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0...",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: 2,
        user_name: "Jane Smith",
        action: "CREATE",
        resource: "leave",
        resource_id: 123,
        details: "Created new leave request",
        ip_address: "192.168.1.101",
        user_agent: "Mozilla/5.0...",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 3,
        user_id: 3,
        user_name: "Admin User",
        action: "UPDATE",
        resource: "user",
        resource_id: 5,
        details: "Updated user profile",
        ip_address: "192.168.1.102",
        user_agent: "Mozilla/5.0...",
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ]);
  }, []);

  const handleViewLog = (log: AuditLog) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
  };

  const handleExportLogs = () => {
    // TODO: Implement export functionality
    console.log("Exporting logs...");
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "warning";
      case "DELETE":
        return "error";
      case "LOGIN":
        return "info";
      default:
        return "default";
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesResource =
      filterResource === "all" || log.resource === filterResource;
    const matchesSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesResource && matchesSearch;
  });

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
          Audit Logs
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExportLogs}
        >
          Export Logs
        </Button>
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
              <MenuItem value="CREATE">Create</MenuItem>
              <MenuItem value="UPDATE">Update</MenuItem>
              <MenuItem value="DELETE">Delete</MenuItem>
              <MenuItem value="LOGIN">Login</MenuItem>
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
                <TableCell>IP Address</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {log.details}
                      </Typography>
                    </TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                    <TableCell>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
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
                <Typography>{selectedLog.user_name}</Typography>

                <Typography variant="subtitle2">Action:</Typography>
                <Chip
                  label={selectedLog.action}
                  color={getActionColor(selectedLog.action) as any}
                  size="small"
                />

                <Typography variant="subtitle2">Resource:</Typography>
                <Typography>{selectedLog.resource}</Typography>

                <Typography variant="subtitle2">Resource ID:</Typography>
                <Typography>{selectedLog.resource_id}</Typography>

                <Typography variant="subtitle2">IP Address:</Typography>
                <Typography>{selectedLog.ip_address}</Typography>

                <Typography variant="subtitle2">Timestamp:</Typography>
                <Typography>
                  {new Date(selectedLog.created_at).toLocaleString()}
                </Typography>
              </Box>

              <Typography variant="subtitle2">Details:</Typography>
              <Typography
                variant="body2"
                sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}
              >
                {selectedLog.details}
              </Typography>

              <Typography variant="subtitle2">User Agent:</Typography>
              <Typography
                variant="body2"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  wordBreak: "break-all",
                }}
              >
                {selectedLog.user_agent}
              </Typography>
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
