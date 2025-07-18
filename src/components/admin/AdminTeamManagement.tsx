import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";
import { People, TableChart, Event } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import {
  fetchAdminManagers,
  fetchAdminManagerLeaves,
} from "../../store/adminSlice";
import { showToast } from "../../utils/toast";
import AdminManagerCard from "./AdminManagerCard";
import AdminTeamLeaveTable from "./AdminTeamLeaveTable";
import AdminTeamLeaveCalendar from "./AdminTeamLeaveCalendar";
import AdminLeaveDetailPopup from "./AdminLeaveDetailPopup";
import type { ManagerLeave } from "../../services/leaveService";
import type { AssignedUser } from "../../services/userService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-team-tabpanel-${index}`}
      aria-labelledby={`admin-team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminTeamManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignedManagers, teamLeaves, loading, error } = useSelector(
    (state: RootState) => state.admin
  ) as {
    assignedManagers: AssignedUser[];
    teamLeaves: ManagerLeave[];
    loading: boolean;
    error: string | null;
  };

  const [tabValue, setTabValue] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState<ManagerLeave | null>(null);
  const [showLeavePopup, setShowLeavePopup] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminManagers());
    dispatch(fetchAdminManagerLeaves());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewLeave = (leave: ManagerLeave) => {
    setSelectedLeave(leave);
    setShowLeavePopup(true);
  };

  const handleCloseLeavePopup = () => {
    setShowLeavePopup(false);
    setSelectedLeave(null);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Manager Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your assigned managers and their leave requests
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<People />} label="Managers" iconPosition="start" />
          <Tab
            icon={<TableChart />}
            label="Leave Requests"
            iconPosition="start"
          />
          <Tab icon={<Event />} label="Manager Calendar" iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Assigned Managers
        </Typography>
        {assignedManagers.length === 0 ? (
          <Alert severity="info">No managers assigned to you yet.</Alert>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {assignedManagers.map((manager) => (
              <AdminManagerCard key={manager.id} manager={manager} />
            ))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Manager Leave Requests
        </Typography>
        <AdminTeamLeaveTable
          leaves={teamLeaves}
          loading={loading}
          onViewLeave={handleViewLeave}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <AdminTeamLeaveCalendar leaves={teamLeaves} />
      </TabPanel>

      <AdminLeaveDetailPopup
        leave={selectedLeave}
        open={showLeavePopup}
        onClose={handleCloseLeavePopup}
      />
    </Box>
  );
};

export default AdminTeamManagement;
