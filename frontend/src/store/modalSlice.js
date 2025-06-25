import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSignupModalOpen: false,
  isLoginModalOpen: false, // Add login modal state
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openSignupModal: (state) => {
      state.isSignupModalOpen = true;
    },
    closeSignupModal: (state) => {
      state.isSignupModalOpen = false;
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
  },
});

export const { openSignupModal, closeSignupModal, openLoginModal, closeLoginModal } = modalSlice.actions;
export default modalSlice.reducer;
