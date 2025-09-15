// frontend/components/GoogleConnectButton.jsx
import React, { useState } from "react";
import axios from "../api/axios";

function GoogleConnectButton() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/events/google-oauth-start/");
      if (res.data?.auth_url) {
        window.location.href = res.data.auth_url;
      } else {
        alert("Failed to start Google connection.");
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Google OAuth failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Connecting..." : "Connect Google Calendar"}
    </button>
  );
}

export default GoogleConnectButton;
