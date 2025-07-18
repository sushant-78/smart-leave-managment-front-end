import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CheckCircle, Visibility } from "@mui/icons-material";
import Layout from "../common/Layout";
import { Dashboard, Event, History, Person } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import { fetchEmployeeDashboard } from "../../store/employeeSlice";
import { showToast } from "../../utils/toast";
import { formatUTCDateOnly } from "../../utils/dateUtils";
import LeaveBalance from "../leaves/LeaveBalance";

const EmployeeDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedRef = useRef(false);
  const employeeState = useSelector((state: RootState) => state.employee);
  const { dashboardData, loading, error } = employeeState;

  const tabs = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      path: "/employee/dashboard",
    },
    {
      label: "Apply For Leave",
      icon: <Event />,
      path: "/employee/apply-leave",
    },
    {
      label: "Leave History",
      icon: <History />,
      path: "/employee/history",
    },
    {
      label: "Profile",
      icon: <Person />,
      path: "/employee/profile",
    },
  ];

  useEffect(() => {
    // Only fetch if we haven't fetched before and we don't have data
    if (!hasFetchedRef.current && !dashboardData && !loading) {
      hasFetchedRef.current = true;
      dispatch(fetchEmployeeDashboard());
    }
  }, [dispatch, dashboardData, loading]);

  // Handle error with toast
  useEffect(() => {
    if (error) {
      showToast.error("Failed to load dashboard data. Please try again.");
    }
  }, [error]);

  const handleViewMore = () => {
    // Navigate to History tab
    window.location.href = "/employee/history";
  };

  if (loading && !dashboardData) {
    return (
      <Layout title="Employee Dashboard" tabs={tabs}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error && !dashboardData) {
    return (
      <Layout title="Employee Dashboard" tabs={tabs}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box>
            <Alert severity="error">
              Failed to load dashboard data. Please try again.
            </Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout title="Employee Dashboard" tabs={tabs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          {dashboardData && (
            <>
              {/* Working Days Info */}
              {dashboardData.systemConfig &&
                Object.keys(dashboardData.systemConfig).length > 0 && (
                  <Box
                    sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
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

              {/* Leave Balance Component */}
              <Box sx={{ mb: 4 }}>
                <LeaveBalance />
              </Box>

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
                          {dashboardData.latestPendingRequest.type
                            .charAt(0)
                            .toUpperCase() +
                            dashboardData.latestPendingRequest.type.slice(
                              1
                            )}{" "}
                          Leave
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
      </Container>
    </Layout>
  );
};

export default EmployeeDashboard;
