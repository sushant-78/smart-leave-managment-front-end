import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import type { RootState } from "../../store";

const RoleBasedRedirect = () => {
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth
  ) as {
    isAuthenticated: boolean;
    user: { role: string } | null;
    loading: boolean;
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but no user data, show loading
  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect based on user role
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "manager":
      return <Navigate to="/manager" replace />;
    case "employee":
      return <Navigate to="/dashboard" replace />;
    default:
      // Invalid role - redirect to 404
      return <Navigate to="/404" replace />;
  }
};

export default RoleBasedRedirect;
