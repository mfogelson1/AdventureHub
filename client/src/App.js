// ===== 📁 client/src/App.js =====
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io();

function App() {
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const handleJoin = () => {
    if (name.trim()) {
      setJoined(true);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      const message = { name, text: input };
      socket.emit('chat message', message);
      setMessages((prev) => [...prev, message]);
      setInput('');
    }
  };

  if (!joined) {
    return (
      <div className="join-screen">
        <input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="chat-screen">
        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div key={idx}><strong>{msg.name}:</strong> {msg.text}</div>
          ))}
        </div>
        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
      <div className="sidebar">
        <div className="sidebar-section">
          <h3>Marching Order</h3>
          <p>Balthazog - 27 HP</p>
          <p>Hene - 34 HP</p>
        </div>
        <div className="sidebar-section">
          <h3>Status</h3>
          <p>Balthazog: Holding staff</p>
          <p>Hene: Bow drawn</p>
        </div>
        <div className="sidebar-section">
          <h3>Loot</h3>
          <p>47 GP</p>
          <p>Unclaimed: Silver ring</p>
        </div>
      </div>
    </div>
  );
}

export default App;
