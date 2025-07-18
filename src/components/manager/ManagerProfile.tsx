import { Dashboard, Event, History, Person, People } from "@mui/icons-material";
import { Container, Typography, Box, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import Layout from "../common/Layout";

const ManagerProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: { name: string; email: string; role: string; id?: number } | null;
  };

  const tabs = [
    { label: "Dashboard", icon: <Dashboard />, path: "/manager/dashboard" },
    { label: "Apply For Leave", icon: <Event />, path: "/manager/apply-leave" },
    { label: "Leave History", icon: <History />, path: "/manager/history" },
    { label: "Profile", icon: <Person />, path: "/manager/profile" },
    { label: "Team", icon: <People />, path: "/manager/team" },
  ];

  return (
    <Layout title="Smart Leave Management - Manager" tabs={tabs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {user?.name || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user?.email || "N/A"}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> Manager
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default ManagerProfile;
