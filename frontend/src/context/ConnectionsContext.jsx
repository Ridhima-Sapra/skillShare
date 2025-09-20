// src/context/ConnectionsContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "../api/axios";

const ConnectionsContext = createContext();

export const useConnections = () => useContext(ConnectionsContext);

export const ConnectionsProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  const fetchUsers = useCallback(async (skill, proficiency) => {
    try {
      const params = new URLSearchParams();
      if (skill) params.append("skill", skill);
      if (proficiency) params.append("proficiency", proficiency);

      const res = await axios.get(`/users/skill-match/?${params.toString()}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  }, []);

  const fetchIncomingRequests = useCallback(async () => {
    try {
      const res = await axios.get("/users/requests/");
      setIncomingRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch incoming requests", err);
    }
  }, []);

  // fetch incoming requests on mount and poll every 30s (easy real-time)
  useEffect(() => {
    fetchIncomingRequests();
    const interval = setInterval(fetchIncomingRequests, 30000);
    return () => clearInterval(interval);
  }, [fetchIncomingRequests]);

  // Send connection request
  const sendRequest = async (userId) => {
    try {
      const res = await axios.post("/users/connect/", { to_user: userId });
      // If backend returned existing connection, it will include id.
      const newId = res.data.id;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, connection_status: "pending_sent", connection_id: newId || u.connection_id } : u
        )
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Respond to a request (accept/reject)
  const respondRequest = async (connectionId, action) => {
    try {
      const res = await axios.post(`/users/connect/respond/${connectionId}/`, { action });
     

      // remove from incoming requests
      setIncomingRequests((prev) => prev.filter((r) => r.id !== connectionId));

      // update users (if the currently-loaded skillmatch list contains the user reference)
      setUsers((prev) =>
        prev.map((u) => {
          // compare loosely; u.connection_id can be number or string
          if (u.connection_id === connectionId || String(u.connection_id) === String(connectionId)) {
            if (action === "accept") return { ...u, connection_status: "connected" };
            return { ...u, connection_status: "none", connection_id: null };
          }
          return u;
        })
      );

      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <ConnectionsContext.Provider
      value={{
        users,
        incomingRequests,
        fetchUsers,
        fetchIncomingRequests,
        sendRequest,
        respondRequest,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};
