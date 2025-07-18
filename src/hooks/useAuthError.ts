import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store";
import { logoutSync } from "../store/authSlice";

export const useAuthError = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for 401 errors from API calls
    const handleUnauthorized = () => {
      dispatch(logoutSync());
      navigate("/login", { replace: true });
    };

    // Add event listener for custom unauthorized event
    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [dispatch, navigate]);

  return {
    triggerLogout: () => {
      dispatch(logoutSync());
      navigate("/login", { replace: true });
    },
  };
};
