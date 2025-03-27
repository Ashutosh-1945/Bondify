import { createSlice } from "@reduxjs/toolkit";

// Load persisted authentication state from localStorage
const persistedAuth = localStorage.getItem("isAuthenticated") === "true";

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isAuthenticated: persistedAuth, // ✅ Set from localStorage
  errors: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateForm: (state, action) => {
      state[action.payload.field] = action.payload.value;
    },
    clearErrors: (state, action) => {
      state.errors = action.payload;
    },
    registerUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.password = ""; // Clear password for security
      state.confirmPassword = "";
      state.errors = {}; // Clear errors after successful registration
    },
    loginUser: (state, action) => {

      state.email = action.payload.email;
      state.password = "";
      state.isAuthenticated = true; // ✅ Authenticated user
 // ✅ Persist authentication

      state.errors = {}; // Clear errors after successful login
    },
    logoutUser: (state) => {
      state.name = "";
      state.email = "";
      state.isAuthenticated = false;
      localStorage.removeItem("isAuthenticated"); // ✅ Remove authentication state on logout
    },
  },
});

export const { updateForm, clearErrors, registerUser, logoutUser, loginUser } = userSlice.actions;
export default userSlice.reducer;
