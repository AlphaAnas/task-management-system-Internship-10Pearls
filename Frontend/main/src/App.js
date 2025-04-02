import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  // Fetch initial message from backend
  useEffect(() => {
    fetch('https://localhost:7206/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  // Send name to backend
  const handleSubmit = () => {
    fetch('https://localhost:7206/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(name),
    })
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error sending name:', error));
  };

  return (
    <div className="App">
      <h1>React Frontend</h1>
      <p>{message}</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}

export default App;