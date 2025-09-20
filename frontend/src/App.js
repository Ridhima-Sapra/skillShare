import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Events from "./pages/Events";
import MyProfile from "./pages/MyProfile";
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skills";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SkillMatch from "./pages/SkillMatch";
import './index.css'; 
import Home from "./pages/Home";
import Notifications from './components/Notifications';
import ChatRoom from './pages/ChatRoom';
import GoogleCallback from "./pages/GoogleCallback";
import { ConnectionsProvider } from "./context/ConnectionsContext";

function App() {
  return (
    <Router>
      <ConnectionsProvider>
      <div>
        <Navbar />
         <Notifications />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/profile/:id" element={<MyProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/skill-match" element={<SkillMatch />} />
          <Route path="/chat/:roomName" element={<ChatRoom />} />
         <Route path="/google/callback" element={<GoogleCallback />} />
        </Routes>

      </div>
         </ConnectionsProvider>
    </Router>
  );
}

export default App;
