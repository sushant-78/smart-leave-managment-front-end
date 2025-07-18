import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  CalendarToday as CalendarIcon,
  Work as WorkIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { Dayjs } from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { showToast } from "../../utils/toast";
import { formatUTCDateOnly } from "../../utils/dateUtils";
import {
  fetchCurrentConfig,
  fetchConfigByYear,
  updateHolidays,
  updateWorkingDays,
  updateLeaveTypes,
  clearSystemConfig,
} from "../../store/adminSlice";
import type { SystemConfig as SystemConfigType } from "../../services/adminService";

interface Holiday {
  date: string;
  title: string;
}

interface LeaveType {
  type: string;
  balance: number;
}

// Predefined leave types from the ENUM
const LEAVE_TYPES = ["casual", "sick", "earned"] as const;
type LeaveTypeOption = (typeof LEAVE_TYPES)[number];

const SystemConfig = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { systemConfig, loading, error } = useSelector(
    (state: RootState) => state.admin
  ) as {
    systemConfig: SystemConfigType | null;
    loading: boolean;
    error: string | null;
  };

  // State for configuration
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [workingDaysPerWeek, setWorkingDaysPerWeek] = useState<4 | 5 | 6>(5);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  // State for UI
  const [newHolidayDate, setNewHolidayDate] = useState<Dayjs | null>(null);
  const [newHolidayTitle, setNewHolidayTitle] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState<
    LeaveTypeOption | ""
  >("");
  const [newLeaveBalance, setNewLeaveBalance] = useState<number>(0);
  const [showHolidayDialog, setShowHolidayDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "holidays" | "workingDays" | "leaveTypes" | null
  >(null);

  // Available years (current year + next 2 years)
  const availableYears = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];

  // Check which sections are configured
  const hasHolidays = !!(
    systemConfig && Object.keys(systemConfig.holidays).length > 0
  );
  const hasWorkingDays = !!(
    systemConfig && systemConfig.working_days_per_week > 0
  );
  // Simple check: if there's data, disable; if no data, enable
  const hasLeaveTypes = !!(
    systemConfig?.leave_types &&
    Object.keys(systemConfig.leave_types).length > 0
  );

  // Get available leave types (not already selected)
  const availableLeaveTypes = LEAVE_TYPES.filter(
    (type) => !leaveTypes.some((lt) => lt.type === type)
  );

  // Fetch current year config on mount
  useEffect(() => {
    dispatch(fetchCurrentConfig());
  }, [dispatch]);

  // Fetch config when year changes
  useEffect(() => {
    if (selectedYear) {
      dispatch(fetchConfigByYear(selectedYear));
    }
  }, [selectedYear, dispatch]);

  // Update local state when config changes
  useEffect(() => {
    if (systemConfig) {
      setSelectedYear(systemConfig.year);
      setWorkingDaysPerWeek(systemConfig.working_days_per_week as 4 | 5 | 6);

      // Convert holidays from Record to Holiday objects
      const holidayObjects: Holiday[] = Object.entries(
        systemConfig.holidays
      ).map(([date, title]) => ({
        date,
        title,
      }));
      setHolidays(holidayObjects);

      // Convert leave types from Record to LeaveType array
      const leaveTypeObjects: LeaveType[] = Object.entries(
        systemConfig.leave_types
      ).map(([type, balance]) => ({
        type,
        balance: balance as number,
      }));
      setLeaveTypes(leaveTypeObjects);
    } else {
      // Reset form when no config exists
      setHolidays([]);
      setWorkingDaysPerWeek(5);
      setLeaveTypes([]);
    }
  }, [systemConfig]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    dispatch(clearSystemConfig()); // Clear current config before fetching new one
  };

  const handleAddHoliday = () => {
    if (newHolidayDate && newHolidayTitle.trim()) {
      const holiday: Holiday = {
        date: newHolidayDate.format("YYYY-MM-DD"),
        title: newHolidayTitle.trim(),
      };
      setHolidays([...holidays, holiday]);
      setNewHolidayDate(null);
      setNewHolidayTitle("");
      setShowHolidayDialog(false);
    }
  };

  const handleRemoveHoliday = (date: string) => {
    setHolidays(holidays.filter((h) => h.date !== date));
  };

  const handleAddLeaveType = () => {
    if (selectedLeaveType && newLeaveBalance > 0) {
      const leaveType: LeaveType = {
        type: selectedLeaveType,
        balance: newLeaveBalance,
      };
      setLeaveTypes([...leaveTypes, leaveType]);
      setSelectedLeaveType("");
      setNewLeaveBalance(0);
    }
  };

  const handleRemoveLeaveType = (type: string) => {
    setLeaveTypes(leaveTypes.filter((lt) => lt.type !== type));
  };

  const handleSaveHolidays = () => {
    setConfirmAction("holidays");
    setShowConfirmDialog(true);
  };

  const handleSaveWorkingDays = () => {
    setConfirmAction("workingDays");
    setShowConfirmDialog(true);
  };

  const handleSaveLeaveTypes = () => {
    setConfirmAction("leaveTypes");
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = async () => {
    if (!confirmAction) return;

    try {
      switch (confirmAction) {
        case "holidays": {
          // Convert holidays array to Record<string, string>
          const holidaysRecord = holidays.reduce(
            (acc, holiday) => ({
              ...acc,
              [holiday.date]: holiday.title,
            }),
            {} as Record<string, string>
          );

          await dispatch(
            updateHolidays({
              year: selectedYear,
              holidays: holidaysRecord,
            })
          ).unwrap();
          break;
        }

        case "workingDays":
          await dispatch(
            updateWorkingDays({
              year: selectedYear,
              working_days_per_week: workingDaysPerWeek,
            })
          ).unwrap();
          break;

        case "leaveTypes":
          await dispatch(
            updateLeaveTypes({
              year: selectedYear,
              leave_types: leaveTypes.reduce(
                (acc, lt) => ({ ...acc, [lt.type]: lt.balance }),
                {} as Record<string, number>
              ),
            })
          ).unwrap();
          break;
      }

      setShowConfirmDialog(false);
      setConfirmAction(null);

      // Show success toast
      switch (confirmAction) {
        case "holidays":
          showToast.success("Holidays saved successfully!");
          break;
        case "workingDays":
          showToast.success("Working days saved successfully!");
          break;
        case "leaveTypes":
          showToast.success("Leave types saved successfully!");
          break;
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
      showToast.error("Failed to save configuration. Please try again.");
    }
  };

  // Date disabling logic
  const shouldDisableDate = (date: Dayjs) => {
    // Always disable Sundays
    if (date.day() === 0) return true;

    // Disable days based on working days selection
    const dayOfWeek = date.day(); // 0=Sunday, 1=Monday, ..., 6=Saturday

    if (workingDaysPerWeek === 4) {
      // Only Monday-Thursday (1-4) are allowed
      if (dayOfWeek === 5 || dayOfWeek === 6) return true; // Friday, Saturday
    } else if (workingDaysPerWeek === 5) {
      // Only Monday-Friday (1-5) are allowed
      if (dayOfWeek === 6) return true; // Saturday
    }
    // For 6 days, only Sunday is disabled (already handled above)

    // Disable already selected dates
    const dateString = date.format("YYYY-MM-DD");
    if (holidays.some((holiday) => holiday.date === dateString)) return true;

    return false;
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Yearly Leave Configuration
          </Typography>

          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Configure yearly settings for holidays, working days, and leave
            types
          </Typography>

          {/* Year Selection */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Year Selection
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Select Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value as number)}
                label="Select Year"
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {systemConfig && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Configuration for {selectedYear} exists. Individual sections can
                be updated.
              </Alert>
            )}
          </Paper>

          {/* Working Days - Must be configured first */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Working Days per Week
            </Typography>

            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Select the number of working days per week. This will determine
              which days are available for holidays.
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Working Days</InputLabel>
              <Select
                value={workingDaysPerWeek}
                onChange={(e) =>
                  setWorkingDaysPerWeek(e.target.value as 4 | 5 | 6)
                }
                label="Working Days"
                disabled={hasWorkingDays}
              >
                <MenuItem value={4}>4 Days (Monday-Thursday)</MenuItem>
                <MenuItem value={5}>5 Days (Monday-Friday)</MenuItem>
                <MenuItem value={6}>6 Days (Monday-Saturday)</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveWorkingDays}
              disabled={hasWorkingDays}
            >
              Save Working Days
            </Button>
          </Paper>

          {/* Holiday Calendar - Only available after working days are set */}
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              mb={2}
              gap={{ xs: 2, sm: 0 }}
            >
              <Typography variant="h6">
                <CalendarIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Holiday Calendar
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowHolidayDialog(true)}
                disabled={hasHolidays || !hasWorkingDays}
              >
                Add Holiday
              </Button>
            </Box>

            {!hasWorkingDays && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please configure working days first to add holidays.
              </Alert>
            )}

            <List>
              {holidays.map((holiday) => (
                <ListItem key={holiday.date}>
                  <ListItemText
                    primary={holiday.title}
                    secondary={formatUTCDateOnly(holiday.date)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveHoliday(holiday.date)}
                      color="error"
                      disabled={hasHolidays}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {holidays.length === 0 && (
                <ListItem>
                  <ListItemText primary="No holidays configured" />
                </ListItem>
              )}
            </List>

            <Box mt={2}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveHolidays}
                disabled={holidays.length === 0 || hasHolidays}
              >
                Save Holidays
              </Button>
            </Box>
          </Paper>

          {/* Leave Types */}
          <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" gutterBottom>
              <CategoryIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Leave Types & Balances
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
                flexWrap: "wrap",
                alignItems: { xs: "stretch", sm: "flex-end" },
              }}
            >
              <FormControl
                sx={{ minWidth: { xs: "100%", sm: 200 } }}
                disabled={hasLeaveTypes}
              >
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={selectedLeaveType}
                  onChange={(e) =>
                    setSelectedLeaveType(e.target.value as LeaveTypeOption | "")
                  }
                  label="Leave Type"
                >
                  {availableLeaveTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                sx={{ width: { xs: "100%", sm: 120 } }}
                type="number"
                label="Balance"
                value={newLeaveBalance}
                onChange={(e) => setNewLeaveBalance(Number(e.target.value))}
                inputProps={{ min: 1 }}
                disabled={hasLeaveTypes}
              />

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddLeaveType}
                disabled={
                  !selectedLeaveType || newLeaveBalance <= 0 || hasLeaveTypes
                }
              >
                Add Leave Type
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              {leaveTypes.map((leaveType) => (
                <Chip
                  key={leaveType.type}
                  label={`${
                    leaveType.type.charAt(0).toUpperCase() +
                    leaveType.type.slice(1)
                  }: ${leaveType.balance} days`}
                  onDelete={
                    hasLeaveTypes
                      ? undefined
                      : () => handleRemoveLeaveType(leaveType.type)
                  }
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
              {leaveTypes.length === 0 && (
                <Typography variant="body2" color="textSecondary">
                  No leave types configured
                </Typography>
              )}
              {leaveTypes.length === LEAVE_TYPES.length && (
                <Typography variant="body2" color="success.main">
                  All leave types configured
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveLeaveTypes}
              disabled={hasLeaveTypes}
            >
              Save Leave Types
            </Button>
          </Paper>

          {/* Add Holiday Dialog */}
          <Dialog
            open={showHolidayDialog}
            onClose={() => setShowHolidayDialog(false)}
          >
            <DialogTitle>Add Holiday</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 1 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  Select a date for the holiday. Only working days are available
                  based on your working days configuration.
                </Typography>
                <DatePicker
                  label="Holiday Date"
                  value={newHolidayDate}
                  onChange={(date) => setNewHolidayDate(date)}
                  shouldDisableDate={shouldDisableDate}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 2 },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Holiday Title"
                  value={newHolidayTitle}
                  onChange={(e) => setNewHolidayTitle(e.target.value)}
                  placeholder="e.g., New Year's Day, Independence Day"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowHolidayDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddHoliday}
                variant="contained"
                disabled={!newHolidayDate || !newHolidayTitle.trim()}
              >
                Add Holiday
              </Button>
            </DialogActions>
          </Dialog>

          {/* Confirmation Dialog */}
          <Dialog
            open={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
          >
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogContent>
              <Typography>
                This action will save the {confirmAction} configuration for{" "}
                {selectedYear}. This action is not reversible once saved. Are
                you sure you want to continue?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSave}
                variant="contained"
                color="primary"
              >
                Save Configuration
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default SystemConfig;
