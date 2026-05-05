import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../redux/slice/authSlice.js";
import api from "../api/axios.js";
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("auth/logout");
      dispatch(clearUser());
      navigate("/");
    } catch (err) {
      console.log("Logout failed");
    }
  };
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          ResumeAI
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-sm text-gray-600 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/analyze"
            className="text-sm text-gray-600 hover:text-blue-600 transition"
          >
            Analyze
          </Link>
          <Link
            to="/history"
            className="text-sm text-gray-600 hover:text-blue-600 transition"
          >
            History
          </Link>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">👋 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
