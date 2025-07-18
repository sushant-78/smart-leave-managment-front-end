import React, { useState, useEffect } from "react";
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
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Search,
  FilterList,
  CheckCircle,
  Warning,
  Cancel,
  Visibility,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchLeaves, cancelLeave } from "../../store/leaveSlice";
import {
  formatUTCDateOnly,
  calculateDateDifference,
} from "../../utils/dateUtils";
import { showToast } from "../../utils/toast";
import type { Leave } from "../../types/leave";

const LeaveHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { leaves, loading, pagination } = useSelector(
    (state: RootState) => state.leaves
  ) as any;

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [leaveToCancel, setLeaveToCancel] = useState<Leave | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [leaveToView, setLeaveToView] = useState<Leave | null>(null);

  useEffect(() => {
    // Fetch leaves on component mount
    dispatch(fetchLeaves({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleSearch = () => {
    // Reset to first page when searching
    setPage(0);
    dispatch(fetchLeaves({ page: 1, limit: rowsPerPage }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPage(0);
    dispatch(fetchLeaves({ page: 1, limit: rowsPerPage }));
  };

  const handleCancelLeave = (leave: Leave) => {
    setLeaveToCancel(leave);
    setCancelDialogOpen(true);
  };

  const confirmCancelLeave = async () => {
    if (!leaveToCancel) return;

    try {
      await dispatch(cancelLeave(leaveToCancel.id)).unwrap();
      showToast.success("Leave request cancelled successfully!");
      // Refresh the leaves list
      dispatch(fetchLeaves({ page: page + 1, limit: rowsPerPage }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to cancel leave request";
      showToast.error(errorMessage);
    } finally {
      setCancelDialogOpen(false);
      setLeaveToCancel(null);
    }
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setLeaveToCancel(null);
  };

  const handleViewLeave = (leave: Leave) => {
    setLeaveToView(leave);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setLeaveToView(null);
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

  const getLeaveTypeDisplayName = (type: string) => {
    switch (type) {
      case "casual":
        return "Casual Leave";
      case "sick":
        return "Sick Leave";
      case "earned":
        return "Earned Leave";
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle />;
      case "rejected":
        return <Warning />;
      case "pending":
        return <Warning />;
      default:
        return <Warning />;
    }
  };

  const filteredLeaves =
    leaves?.filter((leave: Leave) => {
      const matchesSearch =
        searchTerm === "" ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getLeaveTypeDisplayName(leave.type)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || leave.status === statusFilter;
      const matchesType = typeFilter === "all" || leave.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    }) || [];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Leave History
      </Typography>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by reason or leave type..."
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              endAdornment: <Search />,
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="sick">Sick</MenuItem>
              <MenuItem value="earned">Earned</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={handleSearch}
            startIcon={<FilterList />}
          >
            Search
          </Button>

          <Button variant="text" onClick={handleClearFilters}>
            Clear
          </Button>
        </Box>
      </Paper>

      {/* Leave History Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leave Type</TableCell>
                <TableCell>From Date</TableCell>
                <TableCell>To Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied On</TableCell>
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
              ) : filteredLeaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No leave requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeaves.map((leave: Leave) => {
                  const duration = calculateDateDifference(
                    leave.from_date,
                    leave.to_date
                  );

                  return (
                    <TableRow key={leave.id}>
                      <TableCell>
                        {getLeaveTypeDisplayName(leave.type)}
                      </TableCell>
                      <TableCell>
                        {formatUTCDateOnly(leave.from_date)}
                      </TableCell>
                      <TableCell>{formatUTCDateOnly(leave.to_date)}</TableCell>
                      <TableCell>
                        {duration} day{duration !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {leave.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={leave.status}
                          color={
                            getStatusColor(leave.status) as
                              | "success"
                              | "error"
                              | "warning"
                              | "default"
                          }
                          size="small"
                          icon={getStatusIcon(leave.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {formatUTCDateOnly(leave.created_at)}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewLeave(leave)}
                            title="View Leave Details"
                          >
                            <Visibility />
                          </IconButton>
                          {leave.status === "pending" && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleCancelLeave(leave)}
                              title="Cancel Leave Request"
                            >
                              <Cancel />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination?.total || 0}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancel Leave Request</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to cancel this leave request?
          </Typography>
          {leaveToCancel && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Leave Type:</strong>{" "}
                {getLeaveTypeDisplayName(leaveToCancel.type)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Period:</strong>{" "}
                {formatUTCDateOnly(leaveToCancel.from_date)} -{" "}
                {formatUTCDateOnly(leaveToCancel.to_date)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Reason:</strong> {leaveToCancel.reason}
              </Typography>
            </Box>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              This action cannot be undone. The leave request will be cancelled
              and you will need to submit a new request if needed.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Keep Request</Button>
          <Button
            onClick={confirmCancelLeave}
            color="error"
            variant="contained"
          >
            Cancel Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Leave Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Leave Request Details</DialogTitle>
        <DialogContent>
          {leaveToView && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Typography variant="subtitle2">Leave Type:</Typography>
                <Typography>
                  {getLeaveTypeDisplayName(leaveToView.type)}
                </Typography>

                <Typography variant="subtitle2">From Date:</Typography>
                <Typography>
                  {formatUTCDateOnly(leaveToView.from_date)}
                </Typography>

                <Typography variant="subtitle2">To Date:</Typography>
                <Typography>
                  {formatUTCDateOnly(leaveToView.to_date)}
                </Typography>

                <Typography variant="subtitle2">Duration:</Typography>
                <Typography>
                  {calculateDateDifference(
                    leaveToView.from_date,
                    leaveToView.to_date
                  )}{" "}
                  day
                  {calculateDateDifference(
                    leaveToView.from_date,
                    leaveToView.to_date
                  ) !== 1
                    ? "s"
                    : ""}
                </Typography>

                <Typography variant="subtitle2">Status:</Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Chip
                    label={leaveToView.status}
                    color={
                      getStatusColor(leaveToView.status) as
                        | "success"
                        | "error"
                        | "warning"
                        | "default"
                    }
                    size="small"
                    icon={getStatusIcon(leaveToView.status)}
                  />
                </Box>

                <Typography variant="subtitle2">Applied On:</Typography>
                <Typography>
                  {formatUTCDateOnly(leaveToView.created_at)}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Reason:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {leaveToView.reason}
                </Typography>
              </Box>

              {leaveToView.manager_comment && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Manager Comment:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      p: 2,
                      bgcolor: "grey.50",
                      borderRadius: 1,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {leaveToView.manager_comment}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveHistory;
