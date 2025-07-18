import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Event, Warning, CheckCircle } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { EmployeeDashboardResponse } from "../../services/employeeService";

interface LeaveBalanceProps {
  dashboardData?: EmployeeDashboardResponse | null;
  loading?: boolean;
  error?: string | null;
}

const LeaveBalance: React.FC<LeaveBalanceProps> = ({
  dashboardData: propDashboardData,
  loading: propLoading,
  error: propError,
}) => {
  // Use props if provided, otherwise fall back to Redux state
  const reduxState = useSelector((state: RootState) => state.employee);
  const dashboardData = propDashboardData || reduxState.dashboardData;
  const loading = propLoading !== undefined ? propLoading : reduxState.loading;
  const error = propError !== undefined ? propError : reduxState.error;

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case "casual":
        return <Event />;
      case "sick":
        return <Warning />;
      case "earned":
        return <CheckCircle />;
      default:
        return <Event />;
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load leave balances. Please try again.
      </Alert>
    );
  }

  if (
    !dashboardData?.leaveBalances ||
    dashboardData.leaveBalances.length === 0
  ) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Leave Balances
        </Typography>
        <Alert severity="info">
          No leave balance data available. Please contact HR for assistance.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Leave Balances
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {dashboardData.leaveBalances.map(
          (balance: {
            type: string;
            total: number;
            used: number;
            remaining: number;
          }) => (
            <Card key={balance.type}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {getLeaveTypeIcon(balance.type)}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {getLeaveTypeDisplayName(balance.type)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Total:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {balance.total} days
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Used:
                  </Typography>
                  <Typography variant="body2" color="error">
                    {balance.used} days
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Remaining:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    {balance.remaining} days
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "grey.200",
                    borderRadius: 1,
                    p: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: `${(balance.remaining / balance.total) * 100}%`,
                      height: 8,
                      bgcolor: "success.main",
                      borderRadius: 1,
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <Chip
                    label={`${balance.remaining}/${balance.total} days`}
                    color={balance.remaining > 0 ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          )
        )}
      </Box>
    </Box>
  );
};

export default LeaveBalance;
