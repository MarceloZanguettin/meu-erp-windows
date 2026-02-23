import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, LogOut, ChevronDown } from 'lucide-react';
import './App.css'; // Importante para puxar as regras criadas!

const API_URL = 'http://localhost:8050';

// --- COMPONENTE DE DROPDOWN (MENU EM CASCATA) ---
function Dropdown({ title, items }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
      style={{ position: 'relative', cursor: 'pointer', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '5px' }}
    >
      {title} {items && items.length > 0 && <ChevronDown size={14} />}
      
      {isOpen && items && items.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', color: '#333', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '4px', minWidth: '220px', zIndex: 10 }}>
          {items.map((item, index) => (
            <div 
              key={index} 
              style={{ padding: '12px 15px', borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none', cursor: 'pointer' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- TELA DE LOGIN ---
function LoginScreen({ onLoginSuccess }) {
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
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Meu ERP</h2>
        {error && <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Usuário</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
              <User size={18} style={{ margin: '0 10px', color: '#888' }} />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} required />
            </div>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Senha</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
              <Lock size={18} style={{ margin: '0 10px', color: '#888' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} required />
            </div>
          </div>
          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#888' }}>Use <strong>admin</strong> / <strong>admin</strong> para o primeiro acesso.</p>
      </div>
    </div>
  );
}

// --- TELA PRINCIPAL (APP COMPLETO) ---
function App() {
  const [usuario, setUsuario] = useState(null);

  if (!usuario) {
    return <LoginScreen onLoginSuccess={setUsuario} />;
  }

  return (
    <div className="app-wrapper">
      
      {/* TOOLBAR SUPERIOR */}
      <header className="app-header">
        <h2 style={{ margin: 0, fontSize: '20px' }}>Meu ERP</h2>
        
        {/* Abas com Menu Cascata */}
        <div className="nav-menu">
          <Dropdown title="Cadastro" items={['Cadastrar novos produtos', 'Novos clientes', 'Novos fornecedores', 'Novos transportadores', 'Nova condição de pagamento']} />
          <Dropdown title="Estoque" items={['Entrada Produto', 'Entrada Matéria Prima', 'Saída Produto', 'Produção para estoque']} />
          <Dropdown title="Fluxo de Trabalho" items={[]} />
          <Dropdown title="Pedidos" items={['Novo Orçamento', 'Novo Pré-Pedido']} />
        </div>

        {/* Info do Usuário e Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '20px' }}>
            Olá, {usuario.username} ({usuario.permissao})
          </span>
          <LogOut size={20} style={{ cursor: 'pointer', color: '#ff6b6b' }} onClick={() => setUsuario(null)} title="Sair do sistema" />
        </div>
      </header>

      {/* ÁREA DE TRABALHO / TELA DE FUNDO */}
      <main className="main-content">
        <div className="welcome-box">
            <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Bem-vindo ao Sistema!</h1>
            <p style={{ color: '#666' }}>Utilize a barra de ferramentas acima para navegar nas rotinas.</p>
        </div>
      </main>

    </div>
  );
}

export default App;