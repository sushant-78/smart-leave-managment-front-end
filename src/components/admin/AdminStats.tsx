import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import {
  People,
  Event,
  Pending,
  Warning,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import type { RootState, AppDispatch } from "../../store";
import { fetchDashboardStats } from "../../store/adminSlice";

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
  const { stats, loading, error } = useSelector(
    (state: RootState) => state.admin
  ) as {
    stats: {
      totalUsers: number;
      totalLeaves: number;
      pendingLeaves: number;
      unassignedUsers: number;
      leaveTypes: string[];
    } | null;
    loading: boolean;
    error: string | null;
  };

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Overview of system statistics and recent activities
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<People />}
            color="primary.main"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Leaves"
            value={stats?.totalLeaves || 0}
            icon={<Event />}
            color="success.main"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value={stats?.pendingLeaves || 0}
            icon={<Pending />}
            color="warning.main"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unassigned Users"
            value={stats?.unassignedUsers || 0}
            icon={<Warning />}
            color="error.main"
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="body2" color="textSecondary">
                • Create new user
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Configure system settings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • View audit logs
              </Typography>
              <Typography variant="body2" color="textSecondary">
                • Manage leave requests
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingUp color="success" />
                <Typography variant="body2">System running normally</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TrendingDown color="warning" />
                <Typography variant="body2">
                  Pending approvals: {stats?.pendingLeaves || 0}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Warning color="error" />
                <Typography variant="body2">
                  Unassigned users: {stats?.unassignedUsers || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStats;
