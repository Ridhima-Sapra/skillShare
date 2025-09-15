import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("skills/");
        setSkills(response.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch skills.");
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Explore Skills</h2>

      {skills.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-center text-lg font-semibold text-gray-700">{skill.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No skills available.</p>
      )}
    </div>
  );
}

export default Skills;
