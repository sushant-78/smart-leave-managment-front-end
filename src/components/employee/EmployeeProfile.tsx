import { Container, Typography, Box, Paper } from "@mui/material";
import Layout from "../common/Layout";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Dashboard, Event, History, Person } from "@mui/icons-material";

const EmployeeProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: { name: string; email: string; role: string; id?: number } | null;
  };

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

  return (
    <Layout title="My Profile" tabs={tabs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.name || "Not available"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.email || "Not available"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : "Employee"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};

export default EmployeeProfile;
