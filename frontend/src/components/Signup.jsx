import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateForm, registerUser, clearErrors } from "../store/userSlice";
import { closeSignupModal, openLoginModal } from "../store/modalSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

function SignupForm() {
  const dispatch = useDispatch();
  const isSignupModalOpen = useSelector((state) => state.modal.isSignupModalOpen);
  const { name, email, password, confirmPassword, errors } = useSelector((state) => state.user);

  const handleChange = (e) => {
    dispatch(updateForm({ field: e.target.name, value: e.target.value }));
  };


  const handleSubmit = async () => {
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      dispatch(clearErrors(newErrors)); 
      return;
    }


    dispatch(registerUser({ name, email, password }));
    try{
        const response = await axios.post('http://localhost:3005/register', {
            name,
            email,
            password,
          });

        console.log(response)
        if (response.status === 201) {
            alert('Successful Registration');
            dispatch(registerUser({ name, email })); // Clears password and updates state
            dispatch(closeSignupModal());
            dispatch(openLoginModal())
        }

        if(response.status === 400) {
            alert("User already exist Login instead");
        }

    }catch(errors){
        console.log("Failed to Register user", errors);
        alert("Failed Registration");
    }
  };

  return (
    <Dialog open={isSignupModalOpen} onClose={() => dispatch(closeSignupModal())} disableAutoFocus disableEnforceFocus maxWidth="md" fullWidth>
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
        <Box
          sx={{
            flex: 1,
            height: { xs: "200px", md: "100%" },
            backgroundImage: "url('/Images/signup.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Box flex={1} sx={{ p: 4 }}>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Sign Up</DialogTitle>
          <DialogContent>
            <TextField
              name="name"
              value={name}
              onChange={handleChange}
              fullWidth
              label="Name"
              margin="normal"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              name="email"
              value={email}
              onChange={handleChange}
              fullWidth
              label="Email"
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              name="password"
              value={password}
              onChange={handleChange}
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </DialogContent>
          <DialogActions sx={{ display: "flex", flexDirection: "column", gap: 2, px: 3, pb: 3 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#ff5722", "&:hover": { backgroundColor: "#e64a19" } }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Button onClick={() => dispatch(closeSignupModal())} fullWidth variant="text" sx={{ color: "#ff5722" }}>
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

export default SignupForm;
