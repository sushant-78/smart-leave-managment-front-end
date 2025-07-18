import React, { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import { Event, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { formatUTCDateOnly } from "../../utils/dateUtils";
import type { ManagerLeave } from "../../services/leaveService";

interface AdminTeamLeaveCalendarProps {
  leaves: ManagerLeave[];
}

const AdminTeamLeaveCalendar: React.FC<AdminTeamLeaveCalendarProps> = ({
  leaves,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group leaves by date
  const leavesByDate = useMemo(() => {
    const grouped: Record<string, ManagerLeave[]> = {};
    leaves.forEach((leave) => {
      const startDate = new Date(leave.from_date);
      const endDate = new Date(leave.to_date);

      // Add all dates in the leave range
      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dateKey = date.toISOString().split("T")[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(leave);
      }
    });
    return grouped;
  }, [leaves]);

  // Get current month dates
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= lastDay || dates.length < 42) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const monthDates = getMonthDates(currentMonth);

  const handleDateClick = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];
    if (leavesByDate[dateKey]) {
      setSelectedDate(date);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() - 1);
      return newMonth;
    });
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + 1);
      return newMonth;
    });
    setSelectedDate(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const selectedDateLeaves = selectedDate
    ? leavesByDate[selectedDate.toISOString().split("T")[0]] || []
    : [];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Event sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6">Manager Leave Calendar</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handlePreviousMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
        <Box>
          <Chip label="Has Leave" color="primary" size="small" sx={{ mr: 1 }} />
          <Typography variant="caption" color="text.secondary">
            Click on marked dates to view leave details
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 3 }}>
        {/* Calendar Grid */}
        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Box key={day} sx={{ p: 1, textAlign: "center" }}>
                <Typography variant="caption" fontWeight="medium">
                  {day}
                </Typography>
              </Box>
            ))}

            {monthDates.map((date, index) => {
              const dateKey = date.toISOString().split("T")[0];
              const hasLeave = leavesByDate[dateKey];
              const isCurrentMonth =
                date.getMonth() === currentMonth.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <Box
                  key={index}
                  sx={{
                    p: 1,
                    textAlign: "center",
                    cursor: hasLeave ? "pointer" : "default",
                    backgroundColor: isToday ? "primary.light" : "transparent",
                    borderRadius: 1,
                    opacity: isCurrentMonth ? 1 : 0.3,
                    "&:hover": hasLeave
                      ? {
                          backgroundColor: "action.hover",
                          borderRadius: 1,
                        }
                      : {},
                  }}
                  onClick={() => handleDateClick(date)}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday ? "bold" : "normal",
                      color: isToday ? "primary.contrastText" : "inherit",
                    }}
                  >
                    {date.getDate()}
                  </Typography>
                  {hasLeave && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        mx: "auto",
                        mt: 0.5,
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Selected Date Info */}
        {selectedDate && selectedDateLeaves.length > 0 && (
          <Card sx={{ minWidth: 300 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {formatUTCDateOnly(selectedDate.toISOString())}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedDateLeaves.length} leave request
                {selectedDateLeaves.length > 1 ? "s" : ""}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <List dense>
                {selectedDateLeaves.map((leave) => (
                  <ListItem key={leave.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {leave.user.name}
                          </Typography>
                          <Chip
                            label={leave.status.toUpperCase()}
                            color={
                              getStatusColor(leave.status) as
                                | "success"
                                | "error"
                                | "warning"
                                | "default"
                            }
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {leave.type.charAt(0).toUpperCase() +
                              leave.type.slice(1)}{" "}
                            Leave
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatUTCDateOnly(leave.from_date)} -{" "}
                            {formatUTCDateOnly(leave.to_date)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>
    </Paper>
  );
};

export default AdminTeamLeaveCalendar;
