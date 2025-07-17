import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import {
  Dashboard,
  People,
  Settings,
  Assessment,
  Security,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import UserManagement from "../components/admin/UserManagement";
import SystemConfig from "../components/admin/SystemConfig";
import LeaveOversight from "../components/admin/LeaveOversight";
import AuditLogs from "../components/admin/AuditLogs";
import AdminStats from "../components/admin/AdminStats";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: { name: string; email: string; role: string } | null;
  };

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const tabs = [
    { label: "Dashboard", icon: <Dashboard />, component: <AdminStats /> },
    { label: "Users", icon: <People />, component: <UserManagement /> },
    { label: "Configuration", icon: <Settings />, component: <SystemConfig /> },
    { label: "Leaves", icon: <Assessment />, component: <LeaveOversight /> },
    { label: "Audit Logs", icon: <Security />, component: <AuditLogs /> },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart Leave Management - Admin
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="inherit">
              Welcome, {user?.name}
            </Typography>

            <Button
              onClick={handleLogout}
              color="inherit"
              startIcon={<Logout />}
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        {/* Sidebar */}
        <Paper sx={{ width: 240, borderRadius: 0 }}>
          <Tabs
            orientation="vertical"
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderRight: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                alignItems: "flex-start",
                textAlign: "left",
                minHeight: 64,
                padding: "12px 24px",
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {tab.icon}
                    {tab.label}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Paper>

        {/* Content Area */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
