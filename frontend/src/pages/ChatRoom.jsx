import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

export default function ChatRoom() {
  const { roomName } = useParams();
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    ws.current = new WebSocket(`${protocol}://${window.location.hostname}:8000/ws/chat/${roomName}/`);

    ws.current.onopen = () => console.log('WebSocket connected');
    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.message) {
          setChatLog((prev) => [...prev, data.message]);
        }
      } catch (error) {
        console.error('Invalid message:', e.data);
      }
    };
    ws.current.onclose = () => console.log('WebSocket closed');
    ws.current.onerror = (err) => console.error('WebSocket error:', err);

    return () => ws.current.close();
  }, [roomName]);

  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN && message.trim()) {
      ws.current.send(JSON.stringify({ message: message.trim() }));
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Chat Room: {roomName}</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-white shadow">
        {chatLog.map((msg, index) => (
          <div key={index} className="mb-1">{msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border p-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
