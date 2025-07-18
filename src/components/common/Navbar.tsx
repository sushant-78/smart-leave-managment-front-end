import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Logout,
  Person,
  SupervisorAccount,
  AdminPanelSettings,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { showToast } from "../../utils/toast";
import type { RootState, AppDispatch } from "../../store";
import { logout } from "../../store/authSlice";

interface NavbarProps {
  title: string;
  tabs: Array<{
    label: string;
    icon: React.ReactNode;
    component: React.ReactNode;
  }>;
  onTabChange: (index: number) => void;
  currentTab: number;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  tabs,
  onTabChange,
  currentTab,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { user } = useSelector((state: RootState) => state.auth) as {
    user: { name: string; email: string; role: string } | null;
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    showToast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <AdminPanelSettings />;
      case "manager":
        return <SupervisorAccount />;
      case "employee":
        return <Person />;
      default:
        return <Person />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "manager":
        return "Manager";
      case "employee":
        return "Employee";
      default:
        return role;
    }
  };

  const drawer = (
    <Box>
      <Tabs
        orientation="vertical"
        value={currentTab}
        onChange={(_, newValue) => {
          onTabChange(newValue);
          if (isMobile) {
            setMobileOpen(false);
          }
        }}
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
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {getRoleIcon(user?.role || "")}
              <Box>
                <Typography variant="body2" color="inherit">
                  Welcome, {user?.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="inherit"
                  sx={{ opacity: 0.8 }}
                >
                  {getRoleDisplayName(user?.role || "")}
                </Typography>
              </Box>
            </Box>

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
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Paper
            sx={{
              width: 240,
              borderRadius: 0,
              order: { xs: 2, md: 1 },
            }}
          >
            {drawer}
          </Paper>
        )}

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              top: "64px", // Position below fixed header
              height: "calc(100vh - 64px)", // Full height minus header
              border: "none", // Remove default border
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)", // Add shadow for better visibility
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            width: "100%",
            order: { xs: 1, md: 2 },
          }}
        >
          {tabs.map((tab, index) => (
            <div
              key={index}
              role="tabpanel"
              hidden={currentTab !== index}
              id={`tabpanel-${index}`}
              aria-labelledby={`tab-${index}`}
            >
              {currentTab === index && (
                <Box sx={{ p: 3, width: "100%" }}>{tab.component}</Box>
              )}
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
