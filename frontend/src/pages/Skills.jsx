// import React, { useEffect, useState } from "react";
// import axios from "../api/axios";

// function Skills() {
//   const [skills, setSkills] = useState([]);

//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await axios.get("skills/");
//         setSkills(response.data);
//       } catch (error) {
//         console.error(error);
//         alert("Failed to fetch skills.");
//       }
//     };

//     fetchSkills();
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-10">
//       <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Explore Skills</h2>

//       {skills.length > 0 ? (
//         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {skills.map((skill) => (
//             <li
//               key={skill.id}
//               className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
//             >
//               <p className="text-center text-lg font-semibold text-gray-700">{skill.name}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-center text-gray-500">No skills available.</p>
//       )}
//     </div>
//   );
// }

// export default Skills;
import React, { useEffect, useState } from "react";
import axios from "../api/axios";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [activeSkill, setActiveSkill] = useState(null);
  const [formData, setFormData] = useState({ title: "", url: "", description: "" });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("skills/");
        setSkills(response.data);
      } catch (error) {
        console.error("Fetch skills error:", error.response?.data || error.message);
        alert("Failed to fetch skills.");
      }
    };

    fetchSkills();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddResource = async (skillId) => {
    try {
      await axios.post(`skills/${skillId}/resources/`, formData);
      alert("Resource added!");
      setFormData({ title: "", url: "", description: "" });
      setActiveSkill(null);

      // refresh skills list
      const response = await axios.get("skills/");
      setSkills(response.data);
    } catch (error) {
      console.error("Add resource error:", error.response?.data || error.message);

      // Show backend validation errors clearly
      if (error.response?.data) {
        alert("Failed to add resource: " + JSON.stringify(error.response.data));
      } else {
        alert("Failed to add resource: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Explore Skills
      </h2>

      {skills.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p
                className="text-center text-lg font-semibold text-gray-700 cursor-pointer"
                onClick={() =>
                  setActiveSkill(activeSkill === skill.id ? null : skill.id)
                }
              >
                {skill.name}
              </p>

              {/* Show resources */}
              {skill.resources?.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  {skill.resources.map((res) => (
                    <li key={res.id} className="border-t pt-1">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {res.title}
                      </a>{" "}
                      <span className="text-xs text-gray-400">
                        by {res.user}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add resource form */}
              {activeSkill === skill.id && (
                <div className="mt-3 border-t pt-2">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Resource title"
                    className="w-full border rounded p-1 mb-2"
                  />
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="Resource URL"
                    className="w-full border rounded p-1 mb-2"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description (optional)"
                    className="w-full border rounded p-1 mb-2"
                  />
                  <button
                    onClick={() => handleAddResource(skill.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Add Resource
                  </button>
                </div>
              )}
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
