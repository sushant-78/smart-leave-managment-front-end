import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Chip,
} from "@mui/material";
import { Event, CheckCircle, Cancel, Info } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { createLeave, fetchLeaves, clearError } from "../../store/leaveSlice";
import { showToast } from "../../utils/toast";
import { isDateInRange, parseDateOnly } from "../../utils/dateUtils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface LeaveApplicationFormProps {
  onSuccess?: () => void;
}

const LeaveApplicationForm: React.FC<LeaveApplicationFormProps> = ({
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, leaves, error } = useSelector(
    (state: RootState) => state.leaves
  ) as any;
  const { user, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  ) as any;
  // Get dashboard data based on user role
  const employeeState = useSelector(
    (state: RootState) => state.employee
  ) as any;
  const [managerDashboardData, setManagerDashboardData] = useState<any>(null);
  const [managerLoading, setManagerLoading] = useState(false);

  // Use employee dashboard data for employees, manager dashboard data for managers
  const dashboardData =
    user?.role === "manager"
      ? managerDashboardData
      : employeeState.dashboardData;
  console.log("user: ", user);
  console.log("dashboardData: ", dashboardData);

  // Fetch manager dashboard data if user is a manager
  useEffect(() => {
    if (user?.role === "manager" && !managerDashboardData && !managerLoading) {
      const fetchManagerData = async () => {
        try {
          setManagerLoading(true);
          const { fetchManagerDashboard } = await import(
            "../../services/managerService"
          );
          const data = await fetchManagerDashboard();
          setManagerDashboardData(data);
        } catch (error) {
          console.error("Error fetching manager dashboard:", error);
        } finally {
          setManagerLoading(false);
        }
      };
      fetchManagerData();
    }
  }, [user?.role, managerDashboardData, managerLoading]);

  // Form state
  const [formData, setFormData] = useState({
    type: "casual" as "casual" | "sick" | "earned",
    from_date: null as Dayjs | null,
    to_date: null as Dayjs | null,
    reason: "",
  });

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [leavesLoaded, setLeavesLoaded] = useState(false);

  // Check if user has manager assigned using manager_id from login response
  const hasManager =
    user?.role === "manager" ||
    (user &&
      user.manager_id &&
      user.manager_id !== null &&
      user.manager_id !== undefined);

  console.log("hasManager: ", hasManager);
  useEffect(() => {
    // Only fetch leaves when user starts interacting with date fields
    if (!leavesLoaded && (formData.from_date || formData.to_date)) {
      const currentYear = new Date().getFullYear();
      dispatch(fetchLeaves({ year: currentYear }));
      setLeavesLoaded(true);
    }
  }, [dispatch, formData.from_date, formData.to_date, leavesLoaded]);

  useEffect(() => {
    // Calculate days when dates change
    if (formData.from_date && formData.to_date) {
      const days = calculateWorkingDays(
        formData.from_date.format("YYYY-MM-DD"),
        formData.to_date.format("YYYY-MM-DD")
      );
      setCalculatedDays(days);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.from_date, formData.to_date]);

  // Handle Redux errors
  useEffect(() => {
    if (error && !submitting) {
      showToast.error(error);
      // Clear the error after showing the toast
      dispatch(clearError());
    }
  }, [error, submitting, dispatch]);

  // Clear errors when form data becomes valid
  useEffect(() => {
    setErrors((prevErrors) => {
      const newErrors: Record<string, string> = { ...prevErrors };

      // Clear from_date error if date is selected
      if (
        formData.from_date &&
        prevErrors.from_date === "From date is required"
      ) {
        delete newErrors.from_date;
      }

      // Clear to_date error if date is selected
      if (formData.to_date && prevErrors.to_date === "To date is required") {
        delete newErrors.to_date;
      }

      // Clear reason error if reason is provided
      if (
        formData.reason.trim() &&
        prevErrors.reason === "Reason is required"
      ) {
        delete newErrors.reason;
      }

      // Clear date validation errors if dates are valid
      if (formData.from_date && formData.to_date) {
        if (formData.from_date.isAfter(formData.to_date)) {
          newErrors.to_date = "To date must be after from date";
        } else {
          delete newErrors.to_date;
          delete newErrors.from_date;
        }
      }

      return newErrors;
    });
  }, [formData.from_date, formData.to_date, formData.reason]);

  const getWorkingDaysPerWeek = () => {
    return dashboardData?.systemConfig?.working_days_per_week || 5;
  };

  const getHolidays = () => {
    return dashboardData?.systemConfig?.holidays || {};
  };

  const isWeekend = (date: Date): boolean => {
    const workingDaysPerWeek = getWorkingDaysPerWeek();
    const dayOfWeek = date.getDay();

    if (workingDaysPerWeek === 5) {
      // Monday to Friday - exclude Saturday (6) and Sunday (0)
      return dayOfWeek === 0 || dayOfWeek === 6;
    } else if (workingDaysPerWeek === 6) {
      // Monday to Saturday - exclude only Sunday (0)
      return dayOfWeek === 0;
    } else if (workingDaysPerWeek === 4) {
      // Monday to Thursday - exclude Friday (5), Saturday (6), Sunday (0)
      return dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    }

    return false;
  };

  const isHoliday = (dateStr: string): boolean => {
    const holidays = getHolidays();
    return Object.prototype.hasOwnProperty.call(holidays, dateStr);
  };

  const shouldDisableDate = (date: Dayjs): boolean => {
    const dateStr = date.format("YYYY-MM-DD");
    const today = dayjs().startOf("day");

    // Disable past dates
    if (date.isBefore(today)) return true;

    // Disable weekends
    if (isWeekend(date.toDate())) return true;

    // Disable holidays
    if (isHoliday(dateStr)) return true;

    // Disable existing leave dates
    if (isExistingLeave(dateStr)) return true;

    return false;
  };

  const isExistingLeave = (dateStr: string): boolean => {
    if (!leaves || !Array.isArray(leaves)) return false;

    return leaves.some((leave: any) => {
      if (leave.status === "rejected") return false; // Ignore rejected leaves

      return isDateInRange(dateStr, leave.from_date, leave.to_date);
    });
  };

  const calculateWorkingDays = (
    fromDateStr: string,
    toDateStr: string
  ): number => {
    const fromDate = parseDateOnly(fromDateStr);
    const toDate = parseDateOnly(toDateStr);
    let days = 0;
    const current = new Date(fromDate);

    while (current <= toDate) {
      const dateStr = current.toISOString().split("T")[0];

      // Check if it's a working day (not weekend, not holiday, not existing leave)
      if (
        !isWeekend(current) &&
        !isHoliday(dateStr) &&
        !isExistingLeave(dateStr)
      ) {
        days++;
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = "Leave type is required";
    }

    if (!formData.from_date) {
      newErrors.from_date = "From date is required";
    }

    if (!formData.to_date) {
      newErrors.to_date = "To date is required";
    }

    if (
      formData.from_date &&
      formData.to_date &&
      formData.from_date.isAfter(formData.to_date)
    ) {
      newErrors.to_date = "To date must be after from date";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    // Check leave balance
    if (formData.type && calculatedDays > 0) {
      const balance = dashboardData?.leaveBalances?.find(
        (b: any) => b.type === formData.type
      );
      if (balance && calculatedDays > balance.remaining) {
        newErrors.type = `Insufficient ${formData.type} leave balance. You have ${balance.remaining} days remaining.`;
      }
    }

    // Check for overlapping dates
    if (formData.from_date && formData.to_date) {
      const fromDateStr = formData.from_date.format("YYYY-MM-DD");
      const toDateStr = formData.to_date.format("YYYY-MM-DD");

      if (leaves && Array.isArray(leaves)) {
        const hasOverlap = leaves.some((leave: any) => {
          if (leave.status === "rejected") return false;

          // Check if date ranges overlap
          return !(toDateStr < leave.from_date || fromDateStr > leave.to_date);
        });

        if (hasOverlap) {
          newErrors.from_date =
            "Selected dates overlap with existing leave requests";
          newErrors.to_date =
            "Selected dates overlap with existing leave requests";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formData.from_date || !formData.to_date) return;

    setSubmitting(true);
    try {
      const leaveData = {
        type: formData.type,
        from_date: formData.from_date.format("YYYY-MM-DD"),
        to_date: formData.to_date.format("YYYY-MM-DD"),
        reason: formData.reason.trim(),
      };

      await dispatch(createLeave(leaveData)).unwrap();

      showToast.success("Leave application submitted successfully!");

      // Reset form
      setFormData({
        type: "casual",
        from_date: null,
        to_date: null,
        reason: "",
      });
      setCalculatedDays(0);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to submit leave application";

      // Handle different types of errors
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      // Show error toast and also log for debugging
      console.error("Leave application submission error:", error);
      showToast.error(errorMessage);
    } finally {
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const getLeaveTypeDisplayName = (type: string) => {
    switch (type) {
      case "casual":
        return "Casual Leave";
      case "sick":
        return "Sick Leave";
      case "earned":
        return "Earned Leave";
      default:
        return type;
    }
  };

  const getLeaveBalance = (type: string) => {
    const balance = dashboardData?.leaveBalances?.find(
      (b: any) => b.type === type
    );
    return balance ? balance.remaining : 0;
  };

  const shouldDisableLeaveType = (type: string) => {
    return getLeaveBalance(type) <= 0;
  };

  const shouldDisableForm = () => {
    if (
      !dashboardData?.leaveBalances ||
      !Array.isArray(dashboardData.leaveBalances)
    )
      return true;
    return dashboardData.leaveBalances.every(
      (balance: any) => balance.remaining <= 0
    );
  };

  // Show loading state while user data is being fetched
  if (authLoading || !user || (user?.role === "manager" && managerLoading)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasManager) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Info color="info" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Manager Assignment Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You need to be assigned to a manager before you can apply for leave.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please get in touch with HR to get assigned to a manager.
        </Typography>
      </Paper>
    );
  }

  if (shouldDisableForm()) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Info color="info" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Leave Balance Available
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You have no remaining leave balance for any leave type.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please contact HR for assistance.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Apply for Leave
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Leave Type Selection */}
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
              label="Leave Type"
            >
              <MenuItem
                value="casual"
                disabled={shouldDisableLeaveType("casual")}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>Casual Leave</span>
                  <Chip
                    label={`${getLeaveBalance("casual")} days left`}
                    size="small"
                    color={getLeaveBalance("casual") > 0 ? "success" : "error"}
                  />
                </Box>
              </MenuItem>
              <MenuItem value="sick" disabled={shouldDisableLeaveType("sick")}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>Sick Leave</span>
                  <Chip
                    label={`${getLeaveBalance("sick")} days left`}
                    size="small"
                    color={getLeaveBalance("sick") > 0 ? "success" : "error"}
                  />
                </Box>
              </MenuItem>
              <MenuItem
                value="earned"
                disabled={shouldDisableLeaveType("earned")}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <span>Earned Leave</span>
                  <Chip
                    label={`${getLeaveBalance("earned")} days left`}
                    size="small"
                    color={getLeaveBalance("earned") > 0 ? "success" : "error"}
                  />
                </Box>
              </MenuItem>
            </Select>
            {errors.type && (
              <Typography variant="caption" color="error">
                {errors.type}
              </Typography>
            )}
          </FormControl>

          {/* Date Selection */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="From Date"
                value={formData.from_date}
                onChange={(date) =>
                  setFormData({ ...formData, from_date: date })
                }
                shouldDisableDate={shouldDisableDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.from_date,
                    helperText: errors.from_date,
                    onFocus: () => {
                      if (!leavesLoaded) {
                        const currentYear = new Date().getFullYear();
                        dispatch(fetchLeaves({ year: currentYear }));
                        setLeavesLoaded(true);
                      }
                    },
                  },
                }}
              />
              <DatePicker
                label="To Date"
                value={formData.to_date}
                onChange={(date) => setFormData({ ...formData, to_date: date })}
                shouldDisableDate={shouldDisableDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.to_date,
                    helperText: errors.to_date,
                    onFocus: () => {
                      if (!leavesLoaded) {
                        const currentYear = new Date().getFullYear();
                        dispatch(fetchLeaves({ year: currentYear }));
                        setLeavesLoaded(true);
                      }
                    },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          {/* Calculated Days Display */}
          {calculatedDays > 0 && (
            <Alert severity="info" icon={<Event />}>
              <Typography variant="body2">
                Leave Duration: <strong>{calculatedDays} working days</strong>
                {formData.from_date && formData.to_date && (
                  <span>
                    {" "}
                    ({formData.from_date.format("YYYY-MM-DD")} -{" "}
                    {formData.to_date.format("YYYY-MM-DD")})
                  </span>
                )}
              </Typography>
            </Alert>
          )}

          {/* Reason */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Leave"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            error={!!errors.reason}
            helperText={errors.reason}
            placeholder="Please provide a detailed reason for your leave request..."
          />

          {/* Submit Button */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFormData({
                  type: "casual",
                  from_date: null,
                  to_date: null,
                  reason: "",
                });
                setErrors({});
                setCalculatedDays(0);
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || submitting}
              startIcon={
                submitting ? <CircularProgress size={20} /> : <CheckCircle />
              }
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      >
        <DialogTitle>Confirm Leave Application</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to submit this leave application?
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" gutterBottom>
              <strong>Leave Type:</strong>{" "}
              {getLeaveTypeDisplayName(formData.type)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Duration:</strong> {calculatedDays} working days
            </Typography>
            {formData.from_date && formData.to_date && (
              <Typography variant="body2" gutterBottom>
                <strong>Period:</strong>{" "}
                {formData.from_date.format("YYYY-MM-DD")} -{" "}
                {formData.to_date.format("YYYY-MM-DD")}
              </Typography>
            )}
            <Typography variant="body2" gutterBottom>
              <strong>Reason:</strong> {formData.reason}
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Once submitted, you cannot modify this request, but you can cancel
              it while it's pending. Please review carefully.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmation(false)}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            startIcon={<CheckCircle />}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Confirm & Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveApplicationForm;
