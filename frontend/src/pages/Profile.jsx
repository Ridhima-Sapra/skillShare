import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ bio: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`user/${id}/profile/`);
        setProfile(response.data);
        setEditData({ bio: response.data.bio || "" });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [id]);

let isCurrentUser = false;
try {
  if (token && profile) {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    isCurrentUser = decoded.user_id === profile.id;
  }
} catch (err) {
  console.error("Failed to decode token:", err);
}

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`user/${id}/profile/`, editData);
      setProfile((prev) => ({ ...prev, bio: editData.bio }));
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update bio", error);
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>{profile.username}'s Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Skills:</p>
      <ul>
        {profile.skills.map((s) => (
          <li key={s.id}>
            {s.skill.name} (Proficiency: {s.proficiency})
          </li>
        ))}
      </ul>
      <p>Events Attending:</p>
      <ul>
        {profile.events_attending.map((e) => (
          <li key={e.id}>
            {e.title} on {new Date(e.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <p>Events Hosted:</p>
      <ul>
        {profile.events_hosted.map((e) => (
          <li key={e.id}>
            {e.title} on {new Date(e.date).toLocaleDateString()}
          </li>
        ))}
      </ul>

      {isCurrentUser && (
        <>
          {editMode ? (
            <div>
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleChange}
              />
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>Bio: {profile.bio || "No bio added"}</p>
              <button onClick={() => setEditMode(true)}>Edit Bio</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;
