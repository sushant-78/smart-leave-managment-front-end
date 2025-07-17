import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Save, Refresh, Settings, Email, Security } from "@mui/icons-material";
import type { RootState } from "../../store";

interface SystemSettings {
  companyName: string;
  defaultLeaveDays: number;
  maxLeaveDays: number;
  leaveYearStart: string;
  emailNotifications: boolean;
  autoApproval: boolean;
  requireManagerApproval: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
}

const SystemConfig = () => {
  const { loading, error } = useSelector((state: RootState) => state.admin) as {
    loading: boolean;
    error: string | null;
  };

  const [settings, setSettings] = useState<SystemSettings>({
    companyName: "Smart Leave Management",
    defaultLeaveDays: 20,
    maxLeaveDays: 30,
    leaveYearStart: "01-01",
    emailNotifications: true,
    autoApproval: false,
    requireManagerApproval: true,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // TODO: Load settings from API
    console.log("Loading system settings...");
  }, []);

  const handleSettingChange = (
    key: keyof SystemSettings,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handlePasswordPolicyChange = (
    key: keyof SystemSettings["passwordPolicy"],
    value: number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      passwordPolicy: { ...prev.passwordPolicy, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Save settings to API
    console.log("Saving settings:", settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    // TODO: Reset to default settings
    console.log("Resetting settings...");
    setHasChanges(false);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          System Configuration
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!hasChanges || loading}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="General Settings" avatar={<Settings />} />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={settings.companyName}
                  onChange={(e) =>
                    handleSettingChange("companyName", e.target.value)
                  }
                />

                <TextField
                  fullWidth
                  label="Default Leave Days"
                  type="number"
                  value={settings.defaultLeaveDays}
                  onChange={(e) =>
                    handleSettingChange(
                      "defaultLeaveDays",
                      parseInt(e.target.value)
                    )
                  }
                  inputProps={{ min: 0, max: 365 }}
                />

                <TextField
                  fullWidth
                  label="Maximum Leave Days"
                  type="number"
                  value={settings.maxLeaveDays}
                  onChange={(e) =>
                    handleSettingChange(
                      "maxLeaveDays",
                      parseInt(e.target.value)
                    )
                  }
                  inputProps={{ min: 0, max: 365 }}
                />

                <TextField
                  fullWidth
                  label="Leave Year Start (MM-DD)"
                  value={settings.leaveYearStart}
                  onChange={(e) =>
                    handleSettingChange("leaveYearStart", e.target.value)
                  }
                  placeholder="01-01"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Email & Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Email & Notifications" avatar={<Email />} />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        handleSettingChange(
                          "emailNotifications",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Enable Email Notifications"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoApproval}
                      onChange={(e) =>
                        handleSettingChange("autoApproval", e.target.checked)
                      }
                    />
                  }
                  label="Auto-approve Leave Requests"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.requireManagerApproval}
                      onChange={(e) =>
                        handleSettingChange(
                          "requireManagerApproval",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Require Manager Approval"
                />

                <TextField
                  fullWidth
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleSettingChange(
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  inputProps={{ min: 5, max: 480 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Security Settings" avatar={<Security />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Password Policy
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <TextField
                      fullWidth
                      label="Minimum Password Length"
                      type="number"
                      value={settings.passwordPolicy.minLength}
                      onChange={(e) =>
                        handlePasswordPolicyChange(
                          "minLength",
                          parseInt(e.target.value)
                        )
                      }
                      inputProps={{ min: 6, max: 20 }}
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.passwordPolicy.requireUppercase}
                          onChange={(e) =>
                            handlePasswordPolicyChange(
                              "requireUppercase",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Require Uppercase Letters"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.passwordPolicy.requireNumbers}
                          onChange={(e) =>
                            handlePasswordPolicyChange(
                              "requireNumbers",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Require Numbers"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.passwordPolicy.requireSpecialChars}
                          onChange={(e) =>
                            handlePasswordPolicyChange(
                              "requireSpecialChars",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Require Special Characters"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    System Information
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Version: 1.0.0
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Database: Connected
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email Service: Active
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemConfig;
