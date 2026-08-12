import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupAdmin } from '../services/api.js';
import './Login.css';

const SetupAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await setupAdmin(username, password);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Could not complete setup.');
      } else {
        setError('Could not reach the server. Check the shop PC is on and you\'re on the same network.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="KD" style={{ height: 60, borderRadius: 8, marginBottom: 12 }} />
        <h1 className="login-title">Welcome — set up your login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="login-input">
          <label htmlFor="username">Choose a username:</label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="login-input">
          <label htmlFor="password">Choose a password:</label>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <div className="login-input">
          <label htmlFor="confirmPassword">Confirm password:</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </div>
        <button type="submit" className="login-button">Create login</button>
      </form>
    </div>
  );
};

export default SetupAdmin;
