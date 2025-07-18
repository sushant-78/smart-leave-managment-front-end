import { useState } from "react";
import { Dashboard, People, Event, History, Person } from "@mui/icons-material";
import { Container, Typography, Box, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import Navbar from "../components/common/Navbar";
import ManagerDashboard from "../components/manager/ManagerDashboard";
import LeaveApplicationForm from "../components/leaves/LeaveApplicationForm";
import LeaveHistory from "../components/leaves/LeaveHistory";
import TeamManagement from "../components/manager/TeamManagement";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: { name: string; email: string; role: string; id?: number } | null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
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
  );
};

const ManagerPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      component: <ManagerDashboard />,
    },
    {
      label: "Apply For Leave",
      icon: <Event />,
      component: <LeaveApplicationForm />,
    },
    {
      label: "Leave History",
      icon: <History />,
      component: <LeaveHistory />,
    },
    {
      label: "Profile",
      icon: <Person />,
      component: <Profile />,
    },
    { label: "Team", icon: <People />, component: <TeamManagement /> },
  ];

  return (
    <Navbar
      title="Smart Leave Management"
      tabs={tabs}
      onTabChange={handleTabChange}
      currentTab={tabValue}
    />
  );
};

export default ManagerPage;
