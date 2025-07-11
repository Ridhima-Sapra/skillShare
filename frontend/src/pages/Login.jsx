import React, { useState } from "react";
import axios from "../api/axios";

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
        localStorage.setItem("refresh", refresh); // optional
        alert("Login successful!");
        window.location.href = "/dashboard";
      } else {
        alert("Login failed.");
      }
    } catch (error) {
  if (error.response) {
    console.error("Backend error:", error.response.data);
    alert("Login failed: " + (error.response.data.detail || "Unknown error."));
  } else {
    console.error("Network error:", error);
    alert("Network error. Please check your server.");
  }
}
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username</label><br />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <label>Password</label><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
