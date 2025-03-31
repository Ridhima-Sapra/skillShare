import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      fetch("http://127.0.0.1:8000/api/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setMessage(data.message || "Authenticated!"))
        .catch(() => setMessage("Error fetching data"));
    }
  }, [token]);

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (data.access) {
      localStorage.setItem("token", data.access);
      setToken(data.access);
      setMessage("Login successful! Fetching data...");
    } else {
      setMessage("Login failed. Check credentials.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Frontend Connected to Django Backend</h1>
      {token ? (
        <>
          <p>Message from Backend: {message}</p>
          <button onClick={() => {
            localStorage.removeItem("token");
            setToken("");
            setMessage("Logged out");
          }}>Logout</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
          <p>{message}</p>
        </>
      )}
    </div>
  );
}

export default App;
