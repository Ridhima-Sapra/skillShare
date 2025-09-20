

// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";
// import { useParams } from "react-router-dom";

// import GoogleConnectButton from "../components/GoogleConnectButton";

// function MyProfile() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [editData, setEditData] = useState({});
//   const [allSkills, setAllSkills] = useState([]);
//   const [newSkill, setNewSkill] = useState("");
//   const [proficiency, setProficiency] = useState("Beginner");
//   const [newSkillDescription, setNewSkillDescription] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get(`/users/${id}/`);
//         setUser(res.data);
//         setEditData(res.data);
//       } catch (err) {
//         console.error("Failed to load profile:", err);
//       }
//     };
//     fetchUser();
//   }, [id]);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const res = await axios.get("/skills/");
//         setAllSkills(res.data);
//       } catch (err) {
//         console.error("Failed to load skills:", err);
//       }
//     };
//     fetchSkills();
//   }, []);

//   const handleChange = (e) => {
//     if (e.target.name === "photo") {
//       setEditData({ ...editData, photo: e.target.files[0] });
//     } else {
//       setEditData({ ...editData, [e.target.name]: e.target.value });
//     }
//   };

//   // **Updated handleAddSkill to support creating new skills**
//   const handleAddSkill = async () => {
//   if (!newSkill) return alert("Select or type a skill first");

//   try {
//     let skillId;

//     // Check if the newSkill is numeric (existing skill) or string (new skill)
//     if (allSkills.some((s) => s.id.toString() === newSkill.toString())) {
//       // Existing skill selected from dropdown
//       skillId = newSkill;
//     } else {
//       // New skill typed by user → create it first
//       const createRes = await axios.post("/skills/create/", {
//         name: newSkill,
//         description: "",
//       });
//       skillId = createRes.data.id;

//       // Optional: Add the new skill to local allSkills list
//       setAllSkills((prev) => [...prev, createRes.data]);
//     }

//     // Now assign the skill to the user
//     await axios.post("/skills/assign/", {
//       skill: skillId,
//       proficiency: proficiency,
//     });

//     alert("Skill added!");
//     const res = await axios.get(`/users/${id}/`);
//     setUser(res.data);
//     setNewSkill("");
//     setProficiency("Beginner");
//   } catch (err) {
//     console.error("Failed to add skill:", err);
//     alert("Error adding skill.");
//   }
// };


//   const handleUpdateSkill = async (userSkillId, newProf) => {
//     try {
//       await axios.patch(`/skills/assigned/${userSkillId}/`, {
//         proficiency: newProf,
//       });
//       alert("Proficiency updated!");
//       const res = await axios.get(`/users/${id}/`);
//       setUser(res.data);
//     } catch (err) {
//       console.error("Failed to update proficiency:", err);
//       alert("Error updating proficiency.");
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("email", editData.email);
//       formData.append("bio", editData.bio || "");
//       if (editData.photo instanceof File) {
//         formData.append("photo", editData.photo);
//       }

//       await axios.patch(`/users/${id}/`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Profile updated successfully");

//       setUser((prev) => ({
//         ...prev,
//         photo: `${prev.photo}?t=${new Date().getTime()}`,
//       }));

//       setEditMode(false);
//       const res = await axios.get(`/users/${id}/`);
//       setUser(res.data);
//     } catch (err) {
//       console.error("Update failed:", err);
//       alert("Update failed");
//     }
//   };

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="max-w-xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">My Profile</h2>

//       {user.photo && (
//         <img
//           src={`${user.photo}?t=${new Date().getTime()}`}
//           alt="Profile"
//           className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
//         />
//       )}

//       <p>
//         <strong>Username:</strong> {user.username}
//       </p>
//       <p>
//         <strong>Email:</strong> {user.email}
//       </p>
//       <p>
//         <strong>Bio:</strong> {user.bio || "No bio yet."}
//       </p>

//       <div className="mt-4">
//         <h3 className="font-semibold">Skills</h3>
//         <ul className="space-y-2">
//           {(user.skills || []).map((s) => (
//             <li
//               key={s.id}
//               className="flex items-center justify-between border p-2 rounded"
//             >
//               <span>{s.skill.name}</span>

//               {editMode ? (
//                 <select
//                   value={s.proficiency || "Beginner"}
//                   onChange={(e) =>
//                     handleUpdateSkill(s.id, e.target.value)
//                   }
//                   className="border rounded px-2 py-1"
//                 >
//                   <option>Beginner</option>
//                   <option>Intermediate</option>
//                   <option>Expert</option>
//                 </select>
//               ) : (
//                 <span>{s.proficiency || "N/A"}</span>
//               )}
//             </li>
//           ))}
//         </ul>

//         {editMode && (
//           <div className="mt-4 flex flex-col gap-2">
//             {/* Dropdown for existing skills */}
//             <select
//               value={newSkill}
//               onChange={(e) => setNewSkill(e.target.value)}
//               className="border p-2 rounded"
//             >
//               <option value="">Select a skill...</option>
//               {allSkills.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             {/* Input for new skill */}
//             <input
//               type="text"
//               value={newSkill}
//               onChange={(e) => setNewSkill(e.target.value)}
//               placeholder="Or type a new skill..."
//               className="border p-2 rounded"
//             />

//             {/* Proficiency selector */}
//             <select
//               value={proficiency}
//               onChange={(e) => setProficiency(e.target.value)}
//               className="border p-2 rounded"
//             >
//               <option>Beginner</option>
//               <option>Intermediate</option>
//               <option>Expert</option>
//             </select>

//             <button
//               onClick={handleAddSkill}
//               className="bg-green-500 text-white px-4 py-2 rounded"
//             >
//               Add
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="mt-4">
//         <h3 className="font-semibold">Attending Events</h3>
//         <ul>
//           {(user.events_attending || []).map((e) => (
//             <li key={e.id}>
//               {e.title} - {e.date}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="mt-4">
//         <h3 className="font-semibold">Hosted Events</h3>
//         <ul>
//           {(user.events_hosted || []).map((e) => (
//             <li key={e.id}>
//               {e.title} - {e.date}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {editMode ? (
//         <>
//           <h3 className="font-semibold mt-4">Edit Profile</h3>
//           <input
//             name="email"
//             value={editData.email || ""}
//             onChange={handleChange}
//             placeholder="Email"
//             className="border p-2 w-full my-2"
//           />
          
//           <textarea
//             name="bio"
//             value={editData.bio || ""}
//             onChange={handleChange}
//             placeholder="Bio"
//             className="border p-2 w-full my-2"
//             rows={4}
//           />
//           <input
//             type="file"
//             name="photo"
//             onChange={handleChange}
//             className="my-2"
//           />
//           <button
//             onClick={handleUpdateProfile}
//             className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//           >
//             Save
//           </button>
//         </>
//       ) : (
//         <button
//           onClick={() => setEditMode(true)}
//           className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
//         >
//           Edit Profile
//         </button>
//       )}

//       <GoogleConnectButton />
//     </div>
//   );
// }

// export default MyProfile;
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

import GoogleConnectButton from "../components/GoogleConnectButton";

function MyProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [allSkills, setAllSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
  const [proficiency, setProficiency] = useState("Beginner");
  const [incomingRequests, setIncomingRequests] = useState([]);

useEffect(() => {
  const fetchIncomingRequests = async () => {
    try {
      const res = await axios.get("/users/requests/"); // this returns requests for logged-in user
      setIncomingRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch incoming requests:", err);
    }
  };
  fetchIncomingRequests();
}, []);

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

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("/skills/");
        setAllSkills(res.data);
      } catch (err) {
        console.error("Failed to load skills:", err);
      }
    };
    fetchSkills();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setEditData({ ...editData, photo: e.target.files[0] });
    } else {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };

  // **Add or create new skill**
  const handleAddSkill = async () => {
    if (!newSkill) return alert("Select or type a skill first");

    try {
      let skillId;

      // Check if selected existing skill
      if (allSkills.some((s) => s.id.toString() === newSkill.toString())) {
        skillId = newSkill;
      } else {
        // Create new skill
        const createRes = await axios.post("/skills/create/", {
          name: newSkill,
          description: newSkillDescription || "",
        });
        skillId = createRes.data.id;
        setAllSkills((prev) => [...prev, createRes.data]);
      }

      // Assign skill to user
      await axios.post("/skills/assign/", {
        skill: skillId,
        proficiency: proficiency,
      });

      alert("Skill added!");
      const res = await axios.get(`/users/${id}/`);
      setUser(res.data);
      setNewSkill("");
      setNewSkillDescription("");
      setProficiency("Beginner");
    } catch (err) {
      console.error("Failed to add skill:", err);
      alert("Error adding skill.");
    }
  };

  const handleUpdateSkill = async (userSkillId, newProf) => {
    try {
      await axios.patch(`/skills/assigned/${userSkillId}/`, {
        proficiency: newProf,
      });
      alert("Proficiency updated!");
      const res = await axios.get(`/users/${id}/`);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to update proficiency:", err);
      alert("Error updating proficiency.");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("email", editData.email);
      formData.append("bio", editData.bio || "");
      if (editData.photo instanceof File) {
        formData.append("photo", editData.photo);
      }

      await axios.patch(`/users/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully");

      setUser((prev) => ({
        ...prev,
        photo: `${prev.photo}?t=${new Date().getTime()}`,
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
        <ul className="space-y-2">
          {(user.skills || []).map((s) => (
            <li key={s.id} className="flex items-center justify-between border p-2 rounded">
              <span>{s.skill.name}</span>
              {editMode ? (
                <select
                  value={s.proficiency || "Beginner"}
                  onChange={(e) => handleUpdateSkill(s.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              ) : (
                <span>{s.proficiency || "N/A"}</span>
              )}
            </li>
          ))}
        </ul>

        {editMode && (
          <div className="mt-4 flex flex-col gap-2">
            {/* Existing skills dropdown */}
            <select
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select a skill...</option>
              {allSkills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Input for new skill name */}
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Or type a new skill..."
              className="border p-2 rounded"
            />

            {/* Input for new skill description */}
            <textarea
              value={newSkillDescription}
              onChange={(e) => setNewSkillDescription(e.target.value)}
              placeholder="Optional: Add a description..."
              className="border p-2 rounded"
            />

            {/* Proficiency selector */}
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              className="border p-2 rounded"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>

            <button
              onClick={handleAddSkill}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        )}
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
          <div className="mt-6">
  <h3 className="font-semibold">Incoming Connection Requests</h3>
  {incomingRequests.length === 0 ? (
    <p className="text-gray-500">No incoming requests</p>
  ) : (
    <ul className="space-y-2">
      {incomingRequests.map((req) => (
        <li key={req.id} className="border p-2 rounded flex justify-between">
          <span>
  {req.from_user?.username || "Unknown User"} sent you a request
</span>

          <div className="space-x-2">
            <button
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={async () => {
                try {
                await axios.post(`/users/connect/respond/${req.id}/`, { action: "accept" });
                  setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
                } catch (err) {
                  console.error("Accept failed", err);
                }
              }}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={async () => {
                try {
                await axios.post(`/users/connect/respond/${req.id}/`, { action: "reject" });

                  setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
                } catch (err) {
                  console.error("Reject failed", err);
                }
              }}
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  )}
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
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Save
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
        >
          Edit Profile
        </button>
      )}

      <GoogleConnectButton />
    </div>
  );
}

export default MyProfile;
