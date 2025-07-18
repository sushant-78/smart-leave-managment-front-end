import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { Person, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { AssignedUser } from "../../services/userService";

interface AdminManagerCardProps {
  manager: AssignedUser;
}

const AdminManagerCard: React.FC<AdminManagerCardProps> = ({ manager }) => {
  const navigate = useNavigate();
  const { leave_balances } = manager;

  // Helper function to safely get leave balance
  const getLeaveBalance = (type: "casual" | "sick" | "earned") => {
    const balance = leave_balances[type];
    if (!balance) {
      return { total: 0, used: 0, remaining: 0 };
    }
    return balance;
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Person sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h3">
            {manager.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {manager.email}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Leave Balances
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">Casual:</Typography>
            <Chip
              label={`${getLeaveBalance("casual").used}/${
                getLeaveBalance("casual").total
              }`}
              size="small"
              color={
                getLeaveBalance("casual").remaining > 0 ? "success" : "error"
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">Sick:</Typography>
            <Chip
              label={`${getLeaveBalance("sick").used}/${
                getLeaveBalance("sick").total
              }`}
              size="small"
              color={
                getLeaveBalance("sick").remaining > 0 ? "success" : "error"
              }
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2">Earned:</Typography>
            <Chip
              label={`${getLeaveBalance("earned").used}/${
                getLeaveBalance("earned").total
              }`}
              size="small"
              color={
                getLeaveBalance("earned").remaining > 0 ? "success" : "error"
              }
            />
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Visibility />}
          fullWidth
          onClick={() => navigate(`/admin/managers/${manager.id}`)}
          size="small"
        >
          View Manager
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminManagerCard;
