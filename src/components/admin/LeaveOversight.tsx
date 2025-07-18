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
  IconButton,
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
} from "@mui/material";
import {
  Visibility,
  CheckCircle,
  Cancel,
  FilterList,
  Search,
} from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import { fetchLeaves, approveLeave } from "../../store/leaveSlice";
import type { Leave } from "../../services/leaveService";
import { showToast } from "../../utils/toast";
import { formatUTCDateOnly } from "../../utils/dateUtils";

const LeaveOversight = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { leaves, loading, error } = useSelector(
    (state: RootState) => state.leaves
  ) as {
    leaves: Leave[];
    loading: boolean;
    error: string | null;
  };

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaves({ page: 1, limit: 50 }));
  }, [dispatch]);

  // Handle error state with toast
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleViewLeave = (leave: Leave) => {
    setSelectedLeave(leave);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLeave(null);
  };

  const handleApproveLeave = async (leaveId: number) => {
    try {
      await dispatch(
        approveLeave({
          leaveId,
          approvalData: {
            status: "approved",
            manager_comment: "Approved by admin",
          },
        })
      ).unwrap();
      showToast.success("Leave approved successfully!");
    } catch {
      showToast.error("Failed to approve leave. Please try again.");
    }
  };

  const handleRejectLeave = async (leaveId: number) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    try {
      await dispatch(
        approveLeave({
          leaveId,
          approvalData: {
            status: "rejected",
            manager_comment: reason || "Rejected by admin",
          },
        })
      ).unwrap();
      showToast.success("Leave rejected successfully!");
    } catch {
      showToast.error("Failed to reject leave. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus =
      filterStatus === "all" || leave.status === filterStatus;
    const matchesSearch =
      (leave.user?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      leave.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Leave Oversight
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Monitor and manage all leave requests across the organization
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
            placeholder="Search by name or leave type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ minWidth: 250 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Leave Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.user?.name || "Unknown"}</TableCell>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{formatUTCDateOnly(leave.from_date)}</TableCell>
                    <TableCell>{formatUTCDateOnly(leave.to_date)}</TableCell>
                    <TableCell>
                      {Math.ceil(
                        (new Date(leave.to_date).getTime() -
                          new Date(leave.from_date).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={leave.status}
                        color={getStatusColor(leave.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{leave.manager_comment || "N/A"}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewLeave(leave)}
                      >
                        <Visibility />
                      </IconButton>
                      {leave.status === "pending" && (
                        <>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApproveLeave(leave.id)}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRejectLeave(leave.id)}
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Leave Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Leave Request Details</DialogTitle>
        <DialogContent>
          {selectedLeave && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography variant="subtitle2">Employee:</Typography>
                <Typography>{selectedLeave.user?.name || "Unknown"}</Typography>

                <Typography variant="subtitle2">Leave Type:</Typography>
                <Typography>{selectedLeave.type}</Typography>

                <Typography variant="subtitle2">Start Date:</Typography>
                <Typography>
                  {new Date(selectedLeave.from_date).toLocaleDateString()}
                </Typography>

                <Typography variant="subtitle2">End Date:</Typography>
                <Typography>
                  {new Date(selectedLeave.to_date).toLocaleDateString()}
                </Typography>

                <Typography variant="subtitle2">Days:</Typography>
                <Typography>
                  {Math.ceil(
                    (new Date(selectedLeave.to_date).getTime() -
                      new Date(selectedLeave.from_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </Typography>

                <Typography variant="subtitle2">Status:</Typography>
                <Chip
                  label={selectedLeave.status}
                  color={getStatusColor(selectedLeave.status)}
                  size="small"
                />

                <Typography variant="subtitle2">Manager Comment:</Typography>
                <Typography>
                  {selectedLeave.manager_comment || "N/A"}
                </Typography>

                <Typography variant="subtitle2">Applied On:</Typography>
                <Typography>
                  {new Date(selectedLeave.created_at).toLocaleDateString()}
                </Typography>
              </Box>

              {selectedLeave.reason && (
                <>
                  <Typography variant="subtitle2">Reason:</Typography>
                  <Typography
                    variant="body2"
                    sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    {selectedLeave.reason}
                  </Typography>
                </>
              )}

              {selectedLeave.manager_comment && (
                <>
                  <Typography variant="subtitle2">Manager Comments:</Typography>
                  <Typography
                    variant="body2"
                    sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    {selectedLeave.manager_comment}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedLeave?.status === "pending" && (
            <>
              <Button
                color="success"
                variant="contained"
                onClick={() => {
                  handleApproveLeave(selectedLeave.id);
                  handleCloseDialog();
                }}
              >
                Approve
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  handleRejectLeave(selectedLeave.id);
                  handleCloseDialog();
                }}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveOversight;
