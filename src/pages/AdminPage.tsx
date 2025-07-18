import { useState } from "react";
import {
  Dashboard,
  People,
  Settings,
  Assessment,
  Security,
} from "@mui/icons-material";
import UserManagement from "../components/admin/UserManagement";
import SystemConfig from "../components/admin/SystemConfig";
import LeaveOversight from "../components/admin/LeaveOversight";
import AuditLogs from "../components/admin/AuditLogs";
import AdminStats from "../components/admin/AdminStats";
import Navbar from "../components/common/Navbar";

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    { label: "Dashboard", icon: <Dashboard />, component: <AdminStats /> },
    { label: "Users", icon: <People />, component: <UserManagement /> },
    { label: "Configuration", icon: <Settings />, component: <SystemConfig /> },
    { label: "Leaves", icon: <Assessment />, component: <LeaveOversight /> },
    { label: "Audit Logs", icon: <Security />, component: <AuditLogs /> },
  ];

  return (
    <Navbar
      title="Smart Leave Management - Admin"
      tabs={tabs}
      onTabChange={handleTabChange}
      currentTab={tabValue}
    />
  );
};

export default AdminPage;
