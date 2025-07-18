import { useState } from "react";
import { Dashboard, People, Assessment, Event } from "@mui/icons-material";
import { Container, Typography, Box } from "@mui/material";
import Navbar from "../components/common/Navbar";

// Placeholder components for manager features
const ManagerDashboard = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manager Dashboard
      </Typography>
      <Typography variant="body1">
        Manager dashboard with team overview and quick actions.
      </Typography>
    </Box>
  </Container>
);

const TeamManagement = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Team Management
      </Typography>
      <Typography variant="body1">
        Manage your team members and their leave requests.
      </Typography>
    </Box>
  </Container>
);

const Approvals = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Leave Approvals
      </Typography>
      <Typography variant="body1">
        Review and approve/reject leave requests from your team.
      </Typography>
    </Box>
  </Container>
);

const Reports = () => (
  <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports
      </Typography>
      <Typography variant="body1">
        View team leave reports and analytics.
      </Typography>
    </Box>
  </Container>
);

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
    { label: "Team", icon: <People />, component: <TeamManagement /> },
    { label: "Approvals", icon: <Assessment />, component: <Approvals /> },
    { label: "Reports", icon: <Event />, component: <Reports /> },
  ];

  return (
    <Navbar
      title="Smart Leave Management - Manager"
      tabs={tabs}
      onTabChange={handleTabChange}
      currentTab={tabValue}
    />
  );
};

export default ManagerPage;
