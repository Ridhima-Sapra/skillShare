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
    <nav style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
      <Link to="/">Home</Link> | 
      <Link to="/skills">Skills</Link> | 
      <Link to="/events">Events</Link> | 
      {token ? (
        <>
          <Link to={`/profile/${userId}`}>My Profile</Link> | 
          <Link to="/dashboard">Dashboard</Link> | 
          <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | 
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
