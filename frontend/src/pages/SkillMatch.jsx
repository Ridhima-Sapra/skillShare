import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function SkillMatchPage() {
  const [skill, setSkill] = useState("");
  const [users, setUsers] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    // Load skills for dropdown
    const fetchSkills = async () => {
      const res = await axios.get('/custom-skills/'); // Adjust endpoint if needed
      setSkills(res.data);
    };
    fetchSkills();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/users/skill-match/?skill=${skill}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">🔍 Skill Match</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a skill...</option>
          {skills.map((s) => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {users.length === 0 && <p className="text-center text-gray-500">No users found.</p>}
        {users.map((u) => (
          <div key={u.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h3 className="text-xl font-medium mb-2">{u.username}</h3>
            <p className="text-gray-600">{u.email}</p>
            <p className="text-sm text-gray-500 mt-2">Bio: {u.bio || 'No bio'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillMatchPage;
