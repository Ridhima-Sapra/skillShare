// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";

// function SkillMatchPage() {
//   const [skill, setSkill] = useState("");
//   const [proficiency, setProficiency] = useState("");
//   const [users, setUsers] = useState([]);
//   const [skills, setSkills] = useState([]);
    
//   // Fetch all skills for dropdown
//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const res = await axios.get("/skills/");
//         setSkills(res.data);
//       } catch (err) {
//         console.error("Error fetching skills:", err);
//       }
//     };
//     fetchSkills();
//   }, []);

//   // Search users by skill and proficiency
//   const handleSearch = async () => {
//     try {
//       const queryParams = new URLSearchParams();
//       if (skill) queryParams.append("skill", skill);
//       if (proficiency) queryParams.append("proficiency", proficiency);

//       const res = await axios.get(`/users/skill-match/?${queryParams.toString()}`);
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error fetching matched users:", err);
//       alert("Failed to fetch users.");
//     }
//   };

//   // Handle sending connection request
//   const handleConnect = async (userId) => {
//     try {
//       await axios.post("/users/connect/", { to_user: userId });
//       // Update local state to show pending
//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === userId ? { ...u, connection_status: "pending" } : u
//         )
//       );
//     } catch (err) {
//       console.error("Failed to send connection request:", err);
//       alert("Could not send request");
//     }
//   };
//   const handleRespond = async (connectionId, action) => {
//     try {
//       await axios.post(`/users/connect/respond/${connectionId}/`, { action });
//       setUsers((prev) =>
//         prev.map((u) => {
//           if (u.connection_id === connectionId) {
//             if (action === "accept") return { ...u, connection_status: "connected" };
//             return { ...u, connection_status: "none", connection_id: null };
//           }
//           return u;
//         })
//       );
//     } catch (err) {
//       console.error("Failed to respond to request:", err);
//       alert("Action failed");
//     }
//   };
//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-3xl font-semibold mb-6 text-center"> Skill Match</h2>

//       <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
//         <select
//           value={skill}
//           onChange={(e) => setSkill(e.target.value)}
//           className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Select a skill...</option>
//           {skills.map((s) => (
//             <option key={s.id} value={s.name}>{s.name}</option>
//           ))}
//         </select>

//         <select
//           value={proficiency}
//           onChange={(e) => setProficiency(e.target.value)}
//           className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Any proficiency</option>
//           <option>Beginner</option>
//           <option>Intermediate</option>
//           <option>Expert</option>
//         </select>

//         <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
//           Search
//         </button>
//       </div>

//       <div className="grid md:grid-cols-2 gap-4">
//         {users.length === 0 && <p className="text-center text-gray-500">No users found.</p>}

//         {users.map((u) => (
//           <div key={u.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
//             <h3 className="text-xl font-medium mb-2">{u.username}</h3>
//             <p className="text-gray-600">{u.email}</p>
//             <p className="text-sm text-gray-500 mt-2">Bio: {u.bio || "No bio"}</p>

//             {u.skills && u.skills.length > 0 && (
//               <div className="mt-2">
//                 <p className="font-semibold">Skills:</p>
//                 <ul className="text-sm text-gray-700">
//                   {u.skills.map((s) => (
//                     <li key={s.id}>
//                       {s.skill.name} - {s.proficiency || "N/A"}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Connection UI */}
//             <div className="mt-4 flex gap-2">
//               {u.connection_status === "connected" && (
//                 <button className="bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed">Connected</button>
//               )}

//               {u.connection_status === "pending_sent" && (
//                 <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">Pending</button>
//               )}

//               {u.connection_status === "pending_received" && (
//                 <>
//                   <button
//                     onClick={() => handleRespond(u.connection_id, "accept")}
//                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                   >
//                     Accept
//                   </button>
//                   <button
//                     onClick={() => handleRespond(u.connection_id, "reject")}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                   >
//                     Reject
//                   </button>
//                 </>
//               )}

//               {u.connection_status === "none" && (
//                 <button
//                   onClick={() => handleConnect(u.id)}
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//                 >
//                   Connect
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SkillMatchPage;
import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useConnections } from "../context/ConnectionsContext";

function SkillMatchPage() {
  const [skill, setSkill] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [skills, setSkills] = useState([]);

  const { users, fetchUsers, sendRequest, respondRequest } = useConnections();

  // Fetch all skills for dropdown
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("/skills/");
        setSkills(res.data);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };
    fetchSkills();
  }, []);

  const handleSearch = () => {
    fetchUsers(skill, proficiency);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Skill Match</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <select value={skill} onChange={(e) => setSkill(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select a skill...</option>
          {skills.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>

        <select value={proficiency} onChange={(e) => setProficiency(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Any proficiency</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Expert</option>
        </select>

        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Search
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {users.length === 0 && <p className="text-center text-gray-500">No users found.</p>}

        {users.map((u) => (
          <div key={u.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-2">{u.username}</h3>
            <p className="text-gray-600">{u.email}</p>
            <p className="text-sm text-gray-500 mt-2">Bio: {u.bio || "No bio"}</p>

            {u.skills && u.skills.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Skills:</p>
                <ul className="text-sm text-gray-700">
                  {u.skills.map((s) => (
                    <li key={s.id}>
                      {s.skill.name} - {s.proficiency || "N/A"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              {u.connection_status === "connected" && (
                <button className="bg-green-500 text-white px-4 py-2 rounded cursor-not-allowed">Connected</button>
              )}

              {u.connection_status === "pending_sent" && (
                <button className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">Pending</button>
              )}

              {u.connection_status === "pending_received" && (
                <>
                  <button onClick={() => respondRequest(u.connection_id, "accept")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Accept</button>
                  <button onClick={() => respondRequest(u.connection_id, "reject")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reject</button>
                </>
              )}

              {u.connection_status === "none" && (
                <button onClick={() => sendRequest(u.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Connect</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillMatchPage;
