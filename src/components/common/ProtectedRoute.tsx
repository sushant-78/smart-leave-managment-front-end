import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import type { RootState, AppDispatch } from "../../store";
import { getCurrentUser } from "../../store/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "manager" | "employee";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth
  ) as {
    isAuthenticated: boolean;
    user: { role: string } | null;
    loading: boolean;
  };

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  // Show loading spinner while checking authentication or fetching user data
  if (loading || (isAuthenticated && !user)) {
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, check role-based access
  if (user) {
    // If no role is required, allow access
    if (!requiredRole) {
      return <>{children}</>;
    }

    // Strict role checking - user must have the exact required role
    const hasRequiredRole = user.role === requiredRole;

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's role
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
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
