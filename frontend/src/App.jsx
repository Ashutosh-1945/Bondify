import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { closeLoginModal } from "./store/modalSlice";
import Landing from "./pages/Landing";
import { logoutUser, loginUser } from "./store/userSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import axios from "axios";
import Create from "./pages/Create";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();

  // Load authentication state from localStorage when app starts
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      dispatch(loginUser({ email: localStorage.getItem("email") }));
    }
  }, [dispatch]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3005/check", {
          withCredentials: true,
        });

        const mail = response.data.email;
        if (response.status === 200) {
          dispatch(loginUser({ email: mail }));
          dispatch(closeLoginModal());

          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("email", mail);

        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            const refreshResponse = await axios.get("http://localhost:3005/refresh", {
              withCredentials: true,
            });
            console.log(refreshResponse)

            if (refreshResponse.status === 200) {
              dispatch(loginUser(refreshResponse.data.user));
              localStorage.setItem("isAuthenticated", "true");
              localStorage.setItem("email", refreshResponse.data.user.email);
            }
          } catch (refreshError) {
            dispatch(logoutUser());
            localStorage.removeItem("isAuthenticated");
            localStorage.removeItem("email");
          }
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat/>} />
      </Route>
    </Routes>
  );
}

export default App;
