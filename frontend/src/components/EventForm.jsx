// frontend/components/EventForm.jsx
import React, { useState } from "react";
import axios from "../api/axios";

export default function EventForm({ onEventCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (new Date(endTime) <= new Date(startTime)) {
      setError("End time must be after start time.");
      return;
    }

    try {
      await axios.post("/events/create-with-meet/", {
        title,
        description,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
      });

      setTitle(""); setDescription(""); setStartTime(""); setEndTime("");
      if (onEventCreated) onEventCreated();
    } catch (err) {
const msg = err.response?.data?.error
            || err.response?.data?.detail
            || err.response?.data?.message
            || err.message
            || "Failed to create event.";
  setError(msg);    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white shadow p-4 rounded">
      {error && <p className="text-red-600">{error}</p>}

      <input className="border p-2 w-full" placeholder="Title"
        value={title} onChange={(e) => setTitle(e.target.value)} required />

      <textarea className="border p-2 w-full" placeholder="Description"
        value={description} onChange={(e) => setDescription(e.target.value)} />

      <label className="block">
        Start Time:
        <input type="datetime-local" className="border p-2 w-full"
          value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
      </label>

      <label className="block">
        End Time:
        <input type="datetime-local" className="border p-2 w-full"
          value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
      </label>

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Create Event with Google Meet
      </button>
    </form>
  );
}
