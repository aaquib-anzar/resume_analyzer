import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/slice/authSlice.js";
import api from "../api/axios.js";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/auth/login", formData);
      dispatch(setUser(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-6">Login to your account</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                required
                className="mt-1  w-full px-4 py-2  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="mt-1  w-full px-4 py-2  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
