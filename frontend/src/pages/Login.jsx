import React, { useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("token/", { username, password });
      const { access, refresh } = response.data;

      if (access) {
        localStorage.setItem("token", access);
        localStorage.setItem("refresh", refresh);
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } else {
        toast.error("Login failed.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
        toast.error("Login failed: " + (error.response.data.detail || "Unknown error."));
      } else {
        console.error("Network error:", error);
        toast.error("Network error. Please check your server.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://source.unsplash.com/featured/?technology')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white bg-opacity-90 p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-purple-600 hover:underline font-medium">
            Register here
          </a>
        </p>
        <ToastContainer position="top-center" />
      </div>
    </div>
  );
}

export default Login;
