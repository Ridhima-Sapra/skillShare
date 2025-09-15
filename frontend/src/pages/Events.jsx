import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import EventForm from "../components/EventForm";
import { useLocation } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  // ✅ check for google_linked=1 in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("google_linked") === "1") {
      alert("✅ Google account linked successfully!");
    }
  }, [location]);


  // fetch events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/events/");
      setEvents(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load events:", err);
      setError("Could not load events. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // handle join
  const handleJoin = async (id) => {
    try {
      await axios.patch(`/events/${id}/join/`);
      fetchEvents();
    } catch (err) {
      console.error("Failed to join event:", err);
      alert("Failed to join event.");
    }
  };

  // handle leave
  const handleLeave = async (id) => {
    try {
      await axios.patch(`/events/${id}/leave/`);
      fetchEvents();
    } catch (err) {
      console.error("Failed to leave event:", err);
      alert("Failed to leave event.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">Upcoming Events</h2>

        {/* Event creation form */}
        <EventForm onEventCreated={fetchEvents} />

        {loading ? (
          <p className="text-center text-gray-500">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">No events available at the moment.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">{event.title}</h3>

                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">Start:</span>{" "}
                  {event.start_time ? new Date(event.start_time).toLocaleString() : "N/A"}
                </p>

                <p className="text-gray-600 text-sm mb-1">
                  <span className="font-medium">End:</span>{" "}
                  {event.end_time ? new Date(event.end_time).toLocaleString() : "N/A"}
                </p>

                {event.description && (
                  <p className="text-gray-500 text-sm mt-2">{event.description}</p>
                )}

                {event.meet_link && (
                  <a
                    href={event.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 text-sm mt-3 hover:underline"
                  >
                    Join Google Meet
                  </a>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleJoin(event.id)}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Join
                  </button>
                  <button
                    onClick={() => handleLeave(event.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// frontend/pages/Events.js
