import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home as HomeIcon } from "@mui/icons-material";
import type { RootState } from "../store";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth) as {
    user: { role: string } | null;
  };

  const handleGoHome = () => {
    if (user) {
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "employee":
          navigate("/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ fontSize: "6rem", fontWeight: "bold", color: "text.secondary" }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Page Not Found
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: "400px" }}
        >
          The page you're looking for doesn't exist or you don't have permission
          to access it.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
          sx={{ borderRadius: 2, px: 4, py: 1.5 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
