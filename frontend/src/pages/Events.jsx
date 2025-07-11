
import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events/");  // your endpoint
        // Ensure it's always an array
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load events:", err);
        setEvents([]); // fallback to empty array
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((e) => (
          <li key={e.id}>{e.title} - {e.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default Events;
