import React, { useState, useMemo } from "react";
import {
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
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Search, FilterList, Visibility } from "@mui/icons-material";
import {
  formatUTCDateOnly,
  calculateDateDifference,
} from "../../utils/dateUtils";
import type { ManagerLeave } from "../../services/leaveService";

interface AdminTeamLeaveTableProps {
  leaves: ManagerLeave[];
  loading: boolean;
  onViewLeave: (leave: ManagerLeave) => void;
}

const AdminTeamLeaveTable: React.FC<AdminTeamLeaveTableProps> = ({
  leaves,
  loading,
  onViewLeave,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesStatus =
        filterStatus === "all" || leave.status === filterStatus;
      const matchesSearch =
        (leave.user?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (leave.user?.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [leaves, searchTerm, filterStatus]);

  const paginatedLeaves = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredLeaves.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLeaves, page, rowsPerPage]);

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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* Filters */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
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
            placeholder="Search by name, email, or leave type..."
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
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Manager</TableCell>
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
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No leave requests found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {leave.user?.name || "Unknown"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {leave.user?.email || "No email"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {leave.type}
                  </TableCell>
                  <TableCell>{formatUTCDateOnly(leave.from_date)}</TableCell>
                  <TableCell>{formatUTCDateOnly(leave.to_date)}</TableCell>
                  <TableCell>
                    {calculateDateDifference(leave.from_date, leave.to_date)}
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
                      onClick={() => onViewLeave(leave)}
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
  );
};

export default AdminTeamLeaveTable;
