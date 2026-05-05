import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "./api/axios.js";
import { setUser, setLoading, clearUser } from "./redux/slice/authSlice.js";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("auth/profile");
        dispatch(setUser(response.data.user));
      } catch (err) {
        console.log("No user logged in");
        dispatch(clearUser());
      }finally {
        dispatch(setLoading(false));
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
