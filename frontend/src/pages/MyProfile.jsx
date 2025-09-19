import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

import GoogleConnectButton from "../components/GoogleConnectButton";
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
    if (e.target.name === 'photo') {
      setEditData({ ...editData, photo: e.target.files[0] });
    } else {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('email', editData.email);
      formData.append('bio', editData.bio || '');
      if (editData.photo instanceof File) {
        formData.append('photo', editData.photo);
      }

      await axios.patch(`/users/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("Profile updated successfully");
      // force photo refresh by busting cache
setUser((prev) => ({
  ...prev,
  photo: `${prev.photo}?t=${new Date().getTime()}`
}));
      setEditMode(false);
      const res = await axios.get(`/users/${id}/`);
      setUser(res.data);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>



   {user.photo && (
  <img
    src={`${user.photo}?t=${new Date().getTime()}`}
    alt="Profile"
    className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
  />
)}





      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio || "No bio yet."}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Skills</h3>
        <ul>
          {(user.skills || []).map((s) => (
            <li key={s.id}>{s.skill.name} - {s.proficiency}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Attending Events</h3>
        <ul>
          {(user.events_attending || []).map((e) => (
            <li key={e.id}>{e.title} - {e.date}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Hosted Events</h3>
        <ul>
          {(user.events_hosted || []).map((e) => (
            <li key={e.id}>{e.title} - {e.date}</li>
          ))}
        </ul>
      </div>

      {editMode ? (
        <>
          <h3 className="font-semibold mt-4">Edit Profile</h3>
          <input
            name="email"
            value={editData.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full my-2"
          />
          <textarea
            name="bio"
            value={editData.bio || ""}
            onChange={handleChange}
            placeholder="Bio"
            className="border p-2 w-full my-2"
            rows={4}
          />
          <input
            type="file"
            name="photo"
            onChange={handleChange}
            className="my-2"
          />
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Save</button>
        </>
      ) : (
        <button onClick={() => setEditMode(true)} className="bg-gray-500 text-white px-4 py-2 rounded mt-2">Edit Profile</button>
      )}
      <GoogleConnectButton />
    </div>
  );
}

export default MyProfile;
