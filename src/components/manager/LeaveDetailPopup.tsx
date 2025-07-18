import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  Divider,
} from "@mui/material";
import { Close, Check, Cancel, Warning } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { approveLeave } from "../../store/leaveSlice";
import {
  fetchManagerUsers,
  fetchManagerLeaves,
} from "../../store/managerSlice";
import { showToast } from "../../utils/toast";
import { formatUTCDateOnly } from "../../utils/dateUtils";
import type { ManagerLeave } from "../../services/leaveService";

interface LeaveDetailPopupProps {
  leave: ManagerLeave | null;
  open: boolean;
  onClose: () => void;
}

const LeaveDetailPopup: React.FC<LeaveDetailPopupProps> = ({
  leave,
  open,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );

  const handleAction = (type: "approve" | "reject") => {
    if (!comment.trim()) {
      showToast.error("Comment is required for approval/rejection");
      return;
    }
    setActionType(type);
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (!leave || !actionType) return;

    setLoading(true);
    try {
      await dispatch(
        approveLeave({
          leaveId: leave.id,
          approvalData: {
            status: actionType === "approve" ? "approved" : "rejected",
            manager_comment: comment,
          },
        })
      ).unwrap();

      showToast.success(
        `Leave ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully!`
      );

      await dispatch(fetchManagerUsers());
      await dispatch(fetchManagerLeaves());

      onClose();
    } catch {
      showToast.error(`Failed to ${actionType} leave. Please try again.`);
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setActionType(null);
      setComment("");
    }
  };

  const handleClose = () => {
    setComment("");
    setShowConfirm(false);
    setActionType(null);
    onClose();
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

  if (!leave) return null;

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Leave Request Details</Typography>
            <Button onClick={handleClose} size="small">
              <Close />
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {leave.user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {leave.user.email}
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
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Leave Type
              </Typography>
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {leave.type}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Duration
              </Typography>
              <Typography variant="body1">
                {formatUTCDateOnly(leave.from_date)} -{" "}
                {formatUTCDateOnly(leave.to_date)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Reason
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {leave.reason}
            </Typography>
          </Box>

          {leave.manager_comment && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Manager Comment
              </Typography>
              <Typography variant="body1">{leave.manager_comment}</Typography>
            </Box>
          )}

          {leave.status === "pending" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add Comment (Required)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment for approval/rejection..."
                variant="outlined"
                size="small"
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          {leave.status === "pending" && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<Check />}
                onClick={() => handleAction("approve")}
                disabled={loading || !comment.trim()}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => handleAction("reject")}
                disabled={loading || !comment.trim()}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Warning color="warning" />
            <Typography variant="h6">Confirm Action</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType} this leave request? This
            action is irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={actionType === "approve" ? "success" : "error"}
            onClick={handleConfirmAction}
            disabled={loading}
          >
            {actionType === "approve" ? "Approve" : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeaveDetailPopup;
