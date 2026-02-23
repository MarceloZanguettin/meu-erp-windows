import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock } from 'lucide-react';
import './LoginScreen.css';

const API_URL = 'http://localhost:8050';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      onLoginSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao conectar ao servidor');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Meu ERP</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group-login">
            <label>Usuário</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
          </div>
          <div className="form-group-login" style={{ marginBottom: '25px' }}>
            <label>Senha</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn-login">Entrar</button>
        </form>
        <p className="login-hint">Use <strong>admin</strong> / <strong>admin</strong> para o primeiro acesso.</p>
      </div>
    </div>
  );
}