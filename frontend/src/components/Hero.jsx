import { AppBar, Toolbar, Typography, Button, Box, Stack, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { openSignupModal, openLoginModal } from "../store/modalSlice";
import LoginForm from "./Login"; 
import SignupForm from "./Signup"; 

function Hero() {
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        position: "relative",
        height: "90vh",
        width: "100%",
        backgroundImage: "url('/Images/Hero1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}
    >
      <AppBar position="absolute" sx={{ background: "transparent", boxShadow: "none", p: 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Bondify</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{ borderRadius: "12px", backgroundColor: "#ff5722", color: "white" }}
              onClick={() => dispatch(openLoginModal())}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={{ borderRadius: "12px", borderColor: "#ff5722", color: "#ff5722" }}
              onClick={() => dispatch(openSignupModal())}
            >
              Sign Up
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom>Welcome to Bondify</Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>Why wait? Start meeting new people today.</Typography>
          <Button sx={{ borderRadius: "12px", backgroundColor: "#ff5722", color: "white", py: 1 }} variant="contained">
            Join now
          </Button>
        </Container>
      </Box>

      {/* ✅ Modals */}
      <LoginForm />
      <SignupForm />
    </Box>
  );
}

export default Hero;
