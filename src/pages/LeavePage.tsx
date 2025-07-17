import { Container, Typography, Box } from "@mui/material";

const LeavePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Leave Management
        </Typography>
        <Typography variant="body1">
          Leave management features will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default LeavePage;
