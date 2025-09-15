import React from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user_id;
    } catch (err) {
      console.error("Invalid token");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-100 p-4 shadow-sm border-b">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-4 text-purple-700 font-medium items-center">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/skills" className="hover:underline">Skills</Link>
          <Link to="/events" className="hover:underline">Events</Link>
          <Link to="/chat/lobby" className="hover:underline">Chatroom</Link>
              <Link to="/skill-match" className="hover:underline">Skill Match</Link>

          {token ? (
            <>
              <Link to={`/profile/${userId}`} className="hover:underline">My Profile</Link>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
              <Link to="/skill-match" className="hover:underline">Skill Match</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
