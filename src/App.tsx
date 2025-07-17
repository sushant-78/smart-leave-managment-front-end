import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { store } from "./store";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LeavePage from "./pages/LeavePage";
import AdminPage from "./pages/AdminPage";
import ManagerPage from "./pages/ManagerPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleBasedRedirect from "./components/common/RoleBasedRedirect";

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
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/404" element={<NotFoundPage />} />

            {/* Employee routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="employee">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaves"
              element={
                <ProtectedRoute requiredRole="employee">
                  <LeavePage />
                </ProtectedRoute>
              }
            />

            {/* Manager routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute requiredRole="manager">
                  <ManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/team"
              element={
                <ProtectedRoute requiredRole="manager">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/approvals"
              element={
                <ProtectedRoute requiredRole="manager">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/reports"
              element={
                <ProtectedRoute requiredRole="manager">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/settings"
              element={
                <ProtectedRoute requiredRole="manager">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/config"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect - role-based */}
            <Route path="/" element={<RoleBasedRedirect />} />

            {/* Catch all - 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
