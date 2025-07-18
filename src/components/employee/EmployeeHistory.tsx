import { Container, Box } from "@mui/material";
import Layout from "../common/Layout";
import LeaveHistory from "../leaves/LeaveHistory";
import { Dashboard, Event, History, Person } from "@mui/icons-material";

const EmployeeHistory = () => {
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
    <Layout title="Leave History" tabs={tabs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <LeaveHistory />
        </Box>
      </Container>
    </Layout>
  );
};

export default EmployeeHistory;
