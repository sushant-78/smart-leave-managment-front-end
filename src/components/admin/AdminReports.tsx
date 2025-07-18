import {
  Dashboard,
  People,
  Settings,
  Assessment,
  Security,
  Group,
} from "@mui/icons-material";
import { Typography, Paper } from "@mui/material";
import Layout from "../common/Layout";

const AdminReports = () => {
  const tabs = [
    { label: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { label: "Users", icon: <People />, path: "/admin/users" },
    { label: "Team", icon: <Group />, path: "/admin/team" },
    { label: "Configuration", icon: <Settings />, path: "/admin/config" },
    { label: "Leaves", icon: <Assessment />, path: "/admin/leaves" },
    { label: "Audit Logs", icon: <Security />, path: "/admin/audit" },
  ];

  return (
    <Layout title="Smart Leave Management - Admin" tabs={tabs}>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">
          Reports interface will be implemented here.
        </Typography>
      </Paper>
    </Layout>
  );
};

export default AdminReports;
