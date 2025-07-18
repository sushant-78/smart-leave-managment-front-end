import { useState } from "react";
import { Dashboard, Event, Person, History } from "@mui/icons-material";
import { Container, Typography, Box, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import Navbar from "../components/common/Navbar";
import EmployeeDashboard from "../components/employee/EmployeeDashboard";
import LeaveApplicationForm from "../components/leaves/LeaveApplicationForm";
import LeaveHistory from "../components/leaves/LeaveHistory";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: { name: string; email: string; role: string; id?: number } | null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>

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
  );
};

const EmployeePage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      component: <EmployeeDashboard />,
    },
    {
      label: "Apply For Leave",
      icon: <Event />,
      component: <LeaveApplicationForm />,
    },
    { label: "Leave History", icon: <History />, component: <LeaveHistory /> },
    { label: "Profile", icon: <Person />, component: <Profile /> },
  ];

  return (
    <Navbar
      title="Smart Leave Management - Employee"
      tabs={tabs}
      onTabChange={handleTabChange}
      currentTab={tabValue}
    />
  );
};

export default EmployeePage;
