import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { formatUTCDateOnly } from "../utils/dateUtils";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  Logout,
  Person,
  Event,
  People,
  Assessment,
  Settings,
  AdminPanelSettings,
  SupervisorAccount,
} from "@mui/icons-material";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import type { User } from "../services/authService";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: User | null;
  };

  const handleLogout = () => {
    dispatch(logout());
    showToast.success("Logged out successfully");
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const getRoleSpecificActions = () => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return [
          { label: "User Management", path: "/admin/users", icon: <People /> },
          { label: "System Config", path: "/admin/config", icon: <Settings /> },
          { label: "Audit Logs", path: "/admin/audit", icon: <Assessment /> },
          { label: "Reports", path: "/admin/reports", icon: <Assessment /> },
        ];
      case "manager":
        return [
          { label: "Team Management", path: "/manager/team", icon: <People /> },
          {
            label: "Approvals",
            path: "/manager/approvals",
            icon: <Assessment />,
          },
          { label: "Reports", path: "/manager/reports", icon: <Assessment /> },
          { label: "Settings", path: "/manager/settings", icon: <Settings /> },
        ];
      case "employee":
        return [
          { label: "Apply Leave", path: "/leaves", icon: <Event /> },
          { label: "View Profile", path: "/dashboard", icon: <Person /> },
        ];
      default:
        return [];
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "manager":
        return "Manager";
      case "employee":
        return "Employee";
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <AdminPanelSettings />;
      case "manager":
        return <SupervisorAccount />;
      case "employee":
        return <Person />;
      default:
        return <Person />;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 } }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.name}!
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getRoleIcon(user?.role || "")}
            <Typography variant="body1" color="text.secondary">
              {getRoleDisplayName(user?.role || "")}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                {getRoleSpecificActions().map((action, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    startIcon={action.icon}
                    onClick={() => handleNavigate(action.path)}
                    sx={{ mb: 1 }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Role:</strong> {getRoleDisplayName(user?.role || "")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Email:</strong> {user?.email}
              </Typography>
              {user?.manager_id && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Manager ID:</strong> {user.manager_id}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Member since:</strong>{" "}
                {formatUTCDateOnly(user?.created_at || "")}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
