import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/users/dashboard/')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        alert("Failed to load dashboard data.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-10">
          Welcome to your Dashboard!
        </h2>

        {!data ? (
          <p className="text-center text-gray-600">Loading dashboard data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">{data.total_users}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500">Total Events</p>
                <p className="text-3xl font-bold text-purple-600">{data.total_events}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 text-center">
                <p className="text-gray-500">Top Skill</p>
                <p className="text-2xl font-semibold text-purple-600">
                  {data.top_skills.length > 0 ? data.top_skills[0].name : "N/A"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">Top Skills</h4>
              <ul className="space-y-3">
                {data.top_skills.map((skill, i) => (
                  <li key={i} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <span className="text-gray-700 font-medium">{skill.name}</span>
                    <span className="text-purple-600 font-semibold">{skill.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-4">Most Active Users</h4>
              <ul className="space-y-3">
                {data.most_active_users.map((user, i) => (
                  <li key={i} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-700 font-medium">{user.username}</span>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      Skills: {user.skills} | Events: {user.events}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
