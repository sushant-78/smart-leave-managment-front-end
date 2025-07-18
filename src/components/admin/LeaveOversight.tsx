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
  Container,
} from "@mui/material";
import { FilterList, Search } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import { fetchAllLeaves } from "../../store/leaveSlice";
import type { Leave } from "../../services/leaveService";
import { showToast } from "../../utils/toast";
import {
  formatUTCDateOnly,
  calculateDateDifference,
} from "../../utils/dateUtils";

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
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    dispatch(fetchAllLeaves({ page: 1, limit: 50, year: selectedYear }));
  }, [dispatch, selectedYear]);

  // Handle error state with toast
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

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
      (leave.employee?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      leave.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as number)}
                label="Year"
              >
                <MenuItem value={new Date().getFullYear()}>
                  {new Date().getFullYear()}
                </MenuItem>
                <MenuItem value={new Date().getFullYear() - 1}>
                  {new Date().getFullYear() - 1}
                </MenuItem>
                <MenuItem value={new Date().getFullYear() - 2}>
                  {new Date().getFullYear() - 2}
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setSelectedYear(new Date().getFullYear());
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
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>{leave.employee?.name || "Unknown"}</TableCell>
                      <TableCell>{leave.type}</TableCell>
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
                          label={leave.status}
                          color={getStatusColor(leave.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default LeaveOversight;
