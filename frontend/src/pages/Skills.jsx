import React, { useEffect, useState } from 'react';
import axios from '../api/axios'; // Import your axios instance

function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("skills/");  // GET request to backend API
        setSkills(response.data);  // Set skills data from the API response
      } catch (error) {
        console.error(error);
        alert("Failed to fetch skills.");
      }
    };

    fetchSkills();
  }, []);

  return (
    <div>
      <h2>Skills</h2>
      <ul>
        {skills.map((skill) => (
          <li key={skill.id}>{skill.name}</li>  //{/* Render skill name */}
        ))}
      </ul>
    </div>
  );
}

export default Skills;
