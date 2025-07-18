import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Event,
  Schedule,
  CheckCircle,
  Warning,
  Visibility,
} from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import { fetchEmployeeDashboard } from "../../store/employeeSlice";
import { showToast } from "../../utils/toast";
import { formatUTCDateOnly } from "../../utils/dateUtils";

const EmployeeDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedRef = useRef(false);
  const employeeState = useSelector((state: RootState) => state.employee);
  const { dashboardData, loading, error } = employeeState;

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case "casual":
        return <Event />;
      case "sick":
        return <Warning />;
      case "earned":
        return <CheckCircle />;
      default:
        return <Schedule />;
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

  const handleViewMore = () => {
    // Navigate to History tab
    console.log("Navigate to history");
  };

  useEffect(() => {
    // Only fetch if we haven't fetched before and we don't have data
    if (!hasFetchedRef.current && !dashboardData && !loading) {
      hasFetchedRef.current = true;
      console.log("Fetching employee dashboard data...");
      dispatch(fetchEmployeeDashboard());
    }
  }, [dispatch, dashboardData, loading]);

  // Debug: Log dashboard data when it changes
  useEffect(() => {
    if (dashboardData) {
      console.log("Dashboard data received:", dashboardData);
    }
  }, [dashboardData]);

  // Handle error with toast
  useEffect(() => {
    if (error) {
      showToast.error("Failed to load dashboard data. Please try again.");
    }
  }, [error]);

  if (loading && !dashboardData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !dashboardData) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Employee Dashboard
        </Typography>
        <Alert severity="error">
          Failed to load dashboard data. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Employee Dashboard
      </Typography>

      {loading && !dashboardData && (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !dashboardData && (
        <Box>
          <Alert severity="error">
            Failed to load dashboard data. Please try again.
          </Alert>
        </Box>
      )}

      {dashboardData && (
        <>
          {/* Working Days Info */}
          {dashboardData.systemConfig &&
            Object.keys(dashboardData.systemConfig).length > 0 && (
              <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Working Week:{" "}
                  {dashboardData.systemConfig.working_days_per_week === 5
                    ? "Monday - Friday"
                    : dashboardData.systemConfig.working_days_per_week === 6
                    ? "Monday - Saturday"
                    : "Monday - Thursday"}{" "}
                  ({dashboardData.systemConfig.working_days_per_week} days)
                </Typography>
              </Box>
            )}

          {/* Leave Balance Cards */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Leave Balances ({dashboardData.currentYear})
          </Typography>

          {dashboardData.leaveBalances &&
          dashboardData.leaveBalances.length > 0 ? (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {dashboardData.leaveBalances.map((balance) => (
                <Grid item xs={12} sm={6} md={4} key={balance.type}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
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
                            width: `${
                              (balance.remaining / balance.total) * 100
                            }%`,
                            height: 8,
                            bgcolor: "success.main",
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Warning color="warning" />
                  <Typography variant="body1">
                    No leave balance data available
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Leave balances will be calculated once system configuration is
                  set up.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Latest Pending Request */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
            Latest Pending Request
          </Typography>

          {dashboardData.latestPendingRequest &&
          Object.keys(dashboardData.latestPendingRequest).length > 0 ? (
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {getLeaveTypeDisplayName(
                        dashboardData.latestPendingRequest.type
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {formatUTCDateOnly(
                        dashboardData.latestPendingRequest.from_date
                      )}{" "}
                      -{" "}
                      {formatUTCDateOnly(
                        dashboardData.latestPendingRequest.to_date
                      )}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {dashboardData.latestPendingRequest.reason}
                    </Typography>
                  </Box>
                  <Chip
                    label={dashboardData.latestPendingRequest.status}
                    color="warning"
                    size="small"
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Submitted on{" "}
                    {formatUTCDateOnly(
                      dashboardData.latestPendingRequest.created_at
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={handleViewMore}
                  >
                    View More
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body1">
                    No pending leave requests
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Visibility />}
                  onClick={handleViewMore}
                  sx={{ mt: 2 }}
                >
                  View All Requests
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!dashboardData && !loading && !error && (
        <Typography>No dashboard data available</Typography>
      )}
    </Box>
  );
};

export default EmployeeDashboard;
