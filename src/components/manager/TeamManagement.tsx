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
  fetchManagerUsers,
  fetchManagerLeaves,
} from "../../store/managerSlice";
import { showToast } from "../../utils/toast";
import TeamUserCard from "./TeamUserCard";
import TeamLeaveTable from "./TeamLeaveTable";
import TeamLeaveCalendar from "./TeamLeaveCalendar";
import LeaveDetailPopup from "./LeaveDetailPopup";
import type { ManagerLeave } from "../../services/leaveService";

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
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const TeamManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assignedUsers, teamLeaves, loading, error } = useSelector(
    (state: RootState) => state.manager
  );

  const [tabValue, setTabValue] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState<ManagerLeave | null>(null);
  const [showLeavePopup, setShowLeavePopup] = useState(false);

  useEffect(() => {
    dispatch(fetchManagerUsers());
    dispatch(fetchManagerLeaves());
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
        Team Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your team members and their leave requests
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<People />} label="Team Members" iconPosition="start" />
          <Tab
            icon={<TableChart />}
            label="Leave Requests"
            iconPosition="start"
          />
          <Tab icon={<Event />} label="Team Calendar" iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Assigned Team Members
        </Typography>
        {assignedUsers.length === 0 ? (
          <Alert severity="info">No team members assigned to you yet.</Alert>
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
            {assignedUsers.map((user) => (
              <TeamUserCard key={user.id} user={user} />
            ))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Leave Requests
        </Typography>
        <TeamLeaveTable
          leaves={teamLeaves}
          loading={loading}
          onViewLeave={handleViewLeave}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TeamLeaveCalendar leaves={teamLeaves} />
      </TabPanel>

      <LeaveDetailPopup
        leave={selectedLeave}
        open={showLeavePopup}
        onClose={handleCloseLeavePopup}
      />
    </Box>
  );
};

export default TeamManagement;
