import React, { useEffect, useRef, useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    const connectWS =()=>{
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname;
  const port =  "8000"; // not good for prod
  ws.current = new WebSocket(`${protocol}://${host}:${port}/ws/notifications/`);

    ws.current.onopen = () => {
        console.log("Notifications WebSocket connected");
      };
    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.message) {
          setNotifications(prev => [data.message, ...prev.slice(0, 4)]);  // keep only latest 5
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error,e.data);
        
      }
    };
    ws.current.onclose = (e) => {console.log('Notification WebSocket closed'); setTimeout(connectWS, 3000);}
    ws.current.onerror = (err) =>{ console.error('Notification WebSocket error:', err); ws.current.close();}
   };
    connectWS();
    return () => ws.current.close();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '20px',
      width: '250px',
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      padding: '10px'
    }}>
      <h4 style={{ margin: '0 0 8px', color: '#7B1FA2' }}>Notifications</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
        {notifications.length === 0 && <li>No notifications</li>}
        {notifications.map((msg, idx) => (
          <li key={idx} style={{
            marginBottom: '6px',
            background: '#F3E5F5',
            padding: '6px',
            borderRadius: '4px'
          }}>
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
