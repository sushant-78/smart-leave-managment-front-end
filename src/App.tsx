import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { store } from "./store";
import LoginPage from "./pages/LoginPage";

import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import EmployeeApplyLeave from "./components/employee/EmployeeApplyLeave";
import EmployeeHistory from "./components/employee/EmployeeHistory";
import EmployeeProfile from "./components/employee/EmployeeProfile";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserDetailPage from "./components/manager/UserDetailPage";
import AdminManagerDetailPage from "./components/admin/AdminManagerDetailPage";
import { useAuthError } from "./hooks/useAuthError";
import RoleBasedRedirect from "./components/common/RoleBasedRedirect";

// Admin route components
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminTeam from "./components/admin/AdminTeam";
import AdminConfig from "./components/admin/AdminConfig";
import AdminLeaves from "./components/admin/AdminLeaves";
import AdminAudit from "./components/admin/AdminAudit";
import AdminReports from "./components/admin/AdminReports";

// Manager route components
import ManagerDashboard from "./components/manager/ManagerDashboard";
import ManagerApplyLeave from "./components/manager/ManagerApplyLeave";
import ManagerHistory from "./components/manager/ManagerHistory";
import ManagerProfile from "./components/manager/ManagerProfile";
import ManagerTeam from "./components/manager/ManagerTeam";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontSize: "2rem",
      "@media (max-width:600px)": {
        fontSize: "1.75rem",
      },
    },
    h3: {
      fontSize: "1.75rem",
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h4: {
      fontSize: "1.5rem",
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    h5: {
      fontSize: "1.25rem",
      "@media (max-width:600px)": {
        fontSize: "1.125rem",
      },
    },
    h6: {
      fontSize: "1.125rem",
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            paddingLeft: 16,
            paddingRight: 16,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            borderRadius: 1,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            fontSize: "0.875rem",
            padding: "8px 16px",
          },
        },
      },
    },
  },
});

// AppRoutes component to use hooks
const AppRoutes = () => {
  // Handle 401 errors globally
  useAuthError();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/404" element={<NotFoundPage />} />

      {/* Employee routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/apply-leave"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeApplyLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/history"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute requiredRole="employee">
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />

      {/* Manager routes */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/apply-leave"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerApplyLeave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/history"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/profile"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/team"
        element={
          <ProtectedRoute requiredRole="manager">
            <ManagerTeam />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager/users/:userId"
        element={
          <ProtectedRoute requiredRole="manager">
            <UserDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/team"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminTeam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/config"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminConfig />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leaves"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLeaves />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminAudit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/manager/:managerId"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminManagerDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/managers/:managerId"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminManagerDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect - role-based */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#4caf50",
                secondary: "#fff",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#f44336",
                secondary: "#fff",
              },
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
