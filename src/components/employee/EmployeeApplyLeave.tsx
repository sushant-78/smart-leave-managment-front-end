import { Container, Box } from "@mui/material";
import Layout from "../common/Layout";
import LeaveApplicationForm from "../leaves/LeaveApplicationForm";
import { Dashboard, Event, History, Person } from "@mui/icons-material";

const EmployeeApplyLeave = () => {
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
    <Layout title="Apply For Leave" tabs={tabs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box>
          <LeaveApplicationForm />
        </Box>
      </Container>
    </Layout>
  );
};

export default EmployeeApplyLeave;
