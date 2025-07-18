import {
  Dashboard,
  People,
  Settings,
  Assessment,
  Security,
  Group,
} from "@mui/icons-material";
import Layout from "../common/Layout";
import AdminStats from "./AdminStats";

const AdminDashboard = () => {
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
      <AdminStats />
    </Layout>
  );
};

export default AdminDashboard;
