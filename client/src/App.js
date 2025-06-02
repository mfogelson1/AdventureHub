import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => socket.off('chat_message');
  }, []);

  const sendMessage = () => {
    if (name && message.trim()) {
      socket.emit('user_message', { sender: name, text: message });
      setMessage('');
    }
  };

  return (
    <div className="App">
      {!name ? (
        <div className="join-screen">
          <h2>Enter your name</h2>
          <input onChange={(e) => setName(e.target.value)} placeholder="e.g., Mark" />
        </div>
      ) : (
        <div className="chat-screen">
          <div className="chat-window">
            {chat.map((msg, i) => (
              <div key={i}><strong>{msg.sender}:</strong> {msg.text}</div>
            ))}
          </div>
          <div className="input-row">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
