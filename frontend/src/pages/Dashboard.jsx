import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('dashboard/')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        alert("Failed to load dashboard data.");
      });
  }, []);

  return (
    <div>
      <h2>Welcome to your Dashboard!</h2>
      {data ? (
        <div>
          <p>Total Users: {data.total_users}</p>
          <p>Total Events: {data.total_events}</p>
          <h4>Top Skills:</h4>
          <ul>
            {data.top_skills.map((skill, i) => (
              <li key={i}>{skill.name} ({skill.count})</li>
            ))}
          </ul>

          <h4>Most Active Users:</h4>
          <ul>
            {data.most_active_users.map((user, i) => (
              <li key={i}>
                {user.username} - Skills: {user.skills}, Events: {user.events}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </div>
  );
}

export default Dashboard;
