import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock } from 'lucide-react';
import './LoginScreen.css';

const API_URL = 'http://localhost:8050';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- TRUQUE PARA BLOQUEAR REDIMENSIONAMENTO NO EEL ---
  useEffect(() => {
    // 1. Força a janela para o tamanho exato assim que a tela abre
    window.resizeTo(400, 550);

    // 2. Cria a função que empurra a janela de volta pro tamanho original se o usuário tentar alterar
    const bloquearRedimensionamento = () => {
      window.resizeTo(400, 550);
    };

    // 3. Fica "escutando" as tentativas de redimensionar
    window.addEventListener('resize', bloquearRedimensionamento);

    // 4. LIMPEZA: Quando o login der certo e essa tela sumir, nós removemos 
    // esse bloqueio para que o ERP possa preencher a tela inteira.
    return () => {
      window.removeEventListener('resize', bloquearRedimensionamento);
    };
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      // Move a janela para a ponta superior esquerda do monitor (X:0, Y:0)
      window.moveTo(0, 0); 
      // Redimensiona a largura e altura para o tamanho total disponível do monitor do usuário
      window.resizeTo(window.screen.availWidth, window.screen.availHeight);
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