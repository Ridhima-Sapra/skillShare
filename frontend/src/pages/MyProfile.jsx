import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

function MyProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/${id}/`);
        setUser(res.data);
        setEditData(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`/users/${id}/`, editData);
      alert("Profile updated successfully");
      setEditMode(false);
      // Refresh data
      const res = await axios.get(`/users/${id}/`);
      setUser(res.data);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio || "No bio yet."}</p>

      <div>
        <h3>Skills</h3>
        <ul>
          {(user.skills || []).map((s) => (
            <li key={s.id}>{s.skill.name} - {s.proficiency}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Attending Events</h3>
        <ul>
          {(user.events_attending || []).map((e) => (
            <li key={e.id}>{e.title} - {e.date}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Hosted Events</h3>
        <ul>
          {(user.events_hosted || []).map((e) => (
            <li key={e.id}>{e.title} - {e.date}</li>
          ))}
        </ul>
      </div>

      {editMode ? (
        <>
          <h3>Edit Profile</h3>
          <input
            name="email"
            value={editData.email || ""}
            onChange={handleChange}
            placeholder="Email"
          /><br/>
          <label>Bio:</label><br/>
          <textarea
            name="bio"
            value={editData.bio || ""}
            onChange={handleChange}
            placeholder="Write something about yourself..."
            rows={4}
            cols={50}
          /><br/>
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit Profile</button>
      )}
    </div>
  );
}

export default MyProfile;
