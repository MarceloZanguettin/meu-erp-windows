import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginScreen.css';

const API_URL = 'http://localhost:8050';

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando]     = useState(false);
  const [erro, setErro]                 = useState('');
  const [agitando, setAgitando]         = useState(false);

  useEffect(() => {
    const W = 440, H = 580;
    const x = Math.round((window.screen.availWidth  - W) / 2);
    const y = Math.round((window.screen.availHeight - H) / 2);
    window.resizeTo(W, H);
    window.moveTo(x, y);

    const bloquear = () => { window.resizeTo(W, H); window.moveTo(x, y); };
    window.addEventListener('resize', bloquear);
    return () => window.removeEventListener('resize', bloquear);
  }, []);

  const disparaErro = (mensagem) => {
    setErro(mensagem);
    setAgitando(true);
    setTimeout(() => setAgitando(false), 500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const res = await axios.post(`${API_URL}/api/login`, { username, password });
      window.moveTo(0, 0);
      window.resizeTo(window.screen.availWidth, window.screen.availHeight);
      onLoginSuccess(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Não foi possível conectar ao servidor.';
      disparaErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-bg">
      {/* Círculos decorativos de fundo */}
      <div className="login-circle login-circle--1" />
      <div className="login-circle login-circle--2" />
      <div className="login-circle login-circle--3" />

      <div className={`login-card ${agitando ? 'login-card--shake' : ''}`}>

        {/* Logo / Ícone */}
        <div className="login-logo">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="48" height="48" rx="14" fill="url(#g1)" />
            <path d="M14 24h20M14 17h20M14 31h12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#1e40af" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="login-title">Meu ERP</h1>
        <p className="login-subtitle">Acesse sua conta para continuar</p>

        {/* Mensagem de erro */}
        {erro && (
          <div className="login-erro" role="alert">
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          {/* Campo usuário */}
          <div className="login-field">
            <label htmlFor="login-username">Usuário</label>
            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </span>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                autoComplete="username"
                autoFocus
                required
                disabled={carregando}
              />
            </div>
          </div>

          {/* Campo senha */}
          <div className="login-field">
            <label htmlFor="login-password">Senha</label>
            <div className="login-input-wrap">
              <span className="login-input-icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                id="login-password"
                type={mostrarSenha ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
                disabled={carregando}
              />
              <button
                type="button"
                className="login-toggle-senha"
                onClick={() => setMostrarSenha(v => !v)}
                tabIndex={-1}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? (
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                    <path d="M10.748 13.93l2.523 2.523a10.003 10.003 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={carregando}>
            {carregando ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="login-hint">
          Primeiro acesso: <strong>admin</strong> / <strong>admin</strong>
        </p>
      </div>
    </div>
  );
}
