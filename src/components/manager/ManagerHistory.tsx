import { Dashboard, Event, History, Person, People } from "@mui/icons-material";
import { Container, Box } from "@mui/material";
import Layout from "../common/Layout";
import LeaveHistory from "../leaves/LeaveHistory";

const ManagerHistory = () => {
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
          <LeaveHistory />
        </Box>
      </Container>
    </Layout>
  );
};

export default ManagerHistory;
