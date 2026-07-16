import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api.js';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
      navigate('/all');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="KD" style={{ height: 60, borderRadius: 8, marginBottom: 12 }} />
        <h1 className="login-title">Verify</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="login-input">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div className="login-input">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
