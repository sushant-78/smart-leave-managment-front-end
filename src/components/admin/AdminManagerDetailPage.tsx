import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
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
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  ArrowBack,
  Person,
  Search,
  FilterList,
  Visibility,
  Dashboard,
  Event,
  History,
  People,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchAdminManagerLeaves,
  fetchAdminManagers,
} from "../../store/adminSlice";
import { showToast } from "../../utils/toast";
import {
  formatUTCDateOnly,
  calculateDateDifference,
} from "../../utils/dateUtils";
import AdminLeaveDetailPopup from "./AdminLeaveDetailPopup";
import type { ManagerLeave } from "../../services/leaveService";
import type { AssignedUser } from "../../services/userService";
import Layout from "../common/Layout";

const AdminManagerDetailPage: React.FC = () => {
  const { managerId } = useParams<{ managerId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { teamLeaves, assignedManagers, loading, error } = useSelector(
    (state: RootState) => state.admin
  ) as {
    teamLeaves: ManagerLeave[];
    assignedManagers: AssignedUser[];
    loading: boolean;
    error: string | null;
  };

  const [selectedLeave, setSelectedLeave] = useState<ManagerLeave | null>(null);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Get manager from assigned managers
  const manager =
    assignedManagers.find((m) => m.id === parseInt(managerId || "0")) || null;

  const tabs = [
    { label: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { label: "Team", icon: <People />, path: "/admin/team" },
    { label: "Users", icon: <Person />, path: "/admin/users" },
    { label: "Reports", icon: <Event />, path: "/admin/reports" },
    { label: "Config", icon: <History />, path: "/admin/config" },
  ];

  useEffect(() => {
    dispatch(fetchAdminManagerLeaves());
    dispatch(fetchAdminManagers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewLeave = (leave: ManagerLeave) => {
    setSelectedLeave(leave);
    setShowLeavePopup(true);
  };

  const handleCloseLeavePopup = () => {
    setShowLeavePopup(false);
    setSelectedLeave(null);
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

  // Filter leaves for this specific manager
  const managerLeaves = teamLeaves.filter(
    (leave) => leave.user.id === parseInt(managerId || "0")
  );

  const filteredLeaves = managerLeaves.filter((leave) => {
    const matchesStatus =
      filterStatus === "all" || leave.status === filterStatus;
    const matchesSearch =
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedLeaves = filteredLeaves.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setPage(0);
  };

  if (!manager) {
    return (
      <Layout title="Manager Details" tabs={tabs}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Manager Details" tabs={tabs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1">
            Manager Details
          </Typography>
        </Box>

        {/* Manager Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Person sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h5" component="h2">
                {manager.name}
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {manager.email}
            </Typography>
            <Chip
              label={manager.role.toUpperCase()}
              color="primary"
              size="small"
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>

        {/* Leave Balances */}
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Leave Balances
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 3,
            mb: 4,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Casual Leave
              </Typography>
              <Typography variant="h4" component="div">
                {manager.leave_balances.casual?.remaining || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {manager.leave_balances.casual?.used || 0} used of{" "}
                {manager.leave_balances.casual?.total || 0}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Sick Leave
              </Typography>
              <Typography variant="h4" component="div">
                {manager.leave_balances.sick?.remaining || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {manager.leave_balances.sick?.used || 0} used of{" "}
                {manager.leave_balances.sick?.total || 0}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Earned Leave
              </Typography>
              <Typography variant="h4" component="div">
                {manager.leave_balances.earned?.remaining || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {manager.leave_balances.earned?.used || 0} used of{" "}
                {manager.leave_balances.earned?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Leave History */}
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Leave History
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
              placeholder="Search by leave type or reason..."
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
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Table */}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Status</TableCell>
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
                ) : paginatedLeaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No leave requests found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {leave.type}
                      </TableCell>
                      <TableCell>
                        {formatUTCDateOnly(leave.from_date)}
                      </TableCell>
                      <TableCell>{formatUTCDateOnly(leave.to_date)}</TableCell>
                      <TableCell>
                        {calculateDateDifference(
                          leave.from_date,
                          leave.to_date
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={leave.status.toUpperCase()}
                          color={
                            getStatusColor(leave.status) as
                              | "success"
                              | "error"
                              | "warning"
                              | "default"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewLeave(leave)}
                          color="primary"
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

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeaves.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <AdminLeaveDetailPopup
          leave={selectedLeave}
          open={showLeavePopup}
          onClose={handleCloseLeavePopup}
        />
      </Container>
    </Layout>
  );
};

export default AdminManagerDetailPage;
