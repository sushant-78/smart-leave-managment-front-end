import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { People, Event, Pending, Warning } from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import { fetchDashboardStats } from "../../store/adminSlice";
import { showToast } from "../../utils/toast";

const StatCard = ({
  title,
  value,
  icon,
  color,
  loading = false,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
            {loading ? <CircularProgress size={24} /> : value}
          </Typography>
        </Box>
        <Box sx={{ color, display: "flex", alignItems: "center" }}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminStats = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardStats, loading, error } = useSelector(
    (state: RootState) => state.admin
  ) as {
    dashboardStats: {
      users: {
        total: number;
        employees: number;
        managers: number;
        unassigned: number;
      };
      leaves: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
      };
      system: {
        currentYear: number;
        configSet: boolean;
      };
      recentActivities: Array<{
        id: number;
        action_by: number;
        action_type: string;
        action_target: string;
        timestamp: string;
        user: {
          name: string;
          email: string;
          role: string;
        };
      }>;
      leaveTypeStats: Array<{
        type: string;
        count: number;
      }>;
    } | null;
    loading: boolean;
    error: string | null;
  };

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Handle error with toast
  useEffect(() => {
    if (error) {
      showToast.error("Failed to fetch dashboard stats. Please try again.");
    }
  }, [error]);

  if (error) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>

        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Something went wrong while fetching data
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Unable to load dashboard statistics at this time.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={dashboardStats?.users.total || 0}
            icon={<People />}
            color="primary.main"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Leaves"
            value={dashboardStats?.leaves.total || 0}
            icon={<Event />}
            color="success.main"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value={dashboardStats?.leaves.pending || 0}
            icon={<Pending />}
            color="warning.main"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unassigned Users"
            value={dashboardStats?.users.unassigned || 0}
            icon={<Warning />}
            color="error.main"
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStats;
