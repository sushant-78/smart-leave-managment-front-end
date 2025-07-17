import { Container, Typography, Box } from "@mui/material";

const ManagerPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Manager Dashboard
        </Typography>
        <Typography variant="body1">
          Manager features will be implemented here.
        </Typography>
      </Box>
    </Container>
  );
};

export default ManagerPage;
