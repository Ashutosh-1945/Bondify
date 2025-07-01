import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateForm, loginUser, clearErrors } from "../store/userSlice";
import { closeLoginModal } from "../store/modalSlice";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const { email, password, errors } = useSelector((state) => state.user);

  const handleChange = (e) => {
    dispatch(updateForm({ field: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async () => {
    let newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      dispatch(clearErrors(newErrors)); 
      return;
    }

   try{
        const response = await axios.post('http://localhost:3005/login', {
            email,
            password,
          }, {withCredentials: true});


        if (response.status === 201) {
            alert('Successful Login');
            dispatch(loginUser({ email })); // Clears password and updates state
            dispatch(closeLoginModal());
            console.log("from login ", isAuthenticated)
            navigate('/home');
        }

    }catch(errors){
        console.log("Failed to Register user", errors);
        alert("Failed Registration");
    }
  };

  return (
    <Dialog open={isLoginModalOpen} onClose={() => dispatch(closeLoginModal())} maxWidth="md" fullWidth>
      <Box display="flex" sx={{ minHeight: 450 }}>

        <Box
          sx={{
            flex: 1,
            backgroundImage: "url('/Images/login.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <Box sx={{ width: "80%", maxWidth: 350 }}>
            <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>Login</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField 
                name="email"
                value={email || ""}
                onChange={handleChange}
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField 
                name="password"
                value={password || ""}
                onChange={handleChange}
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password}
              />
            </DialogContent>
            <DialogActions sx={{ display: "flex", flexDirection: "column", gap: 2, px: 3, pb: 3 }}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#ff5722", "&:hover": { backgroundColor: "#e64a19" } }}
              >
                Login
              </Button>
              <Button onClick={() => dispatch(closeLoginModal())} fullWidth variant="text" sx={{ color: "#ff5722" }}>
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

export default LoginForm;
