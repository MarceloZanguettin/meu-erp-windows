import React, { useState, useRef } from 'react';
import axios from 'axios';
import { User, Lock, LogOut, ChevronDown } from 'lucide-react';
import Draggable from 'react-draggable';
import './App.css'; 

const API_URL = 'http://localhost:8050';

// --- COMPONENTE DE DROPDOWN (MENU SUPERIOR) ---
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
        <div style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', color: '#333', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '4px', minWidth: '220px', zIndex: 1001 }}>
          {items.map((item, index) => {
            const isObject = typeof item === 'object';
            const label = isObject ? item.label : item;
            const handleClick = () => {
              if (isObject && item.onClick) item.onClick();
              setIsOpen(false);
            };

            return (
              <div 
                key={index} 
                onClick={handleClick}
                style={{ padding: '12px 15px', borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {label}
              </div>
            );
          })}
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
      // Tenta fazer o login usando sua API
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

// --- COMPONENTE DE JANELA DE PRODUTO ---
// --- COMPONENTE DE JANELA DE PRODUTO ---
function ProdutoWindow({ id, onClose, onMinimize }) {
  const nodeRef = useRef(null); 

  // Controle da aba ativa
  const [abaAtiva, setAbaAtiva] = useState('Dados');

  // --- ESTADOS DA ABA: DADOS ---
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estoque, setEstoque] = useState('');
  const [categoria, setCategoria] = useState('');
  
  // O "preco" principal (Preço de Venda) serve tanto para Dados quanto para Tabela de Preço
  const [preco, setPreco] = useState(''); 

  // --- ESTADOS DA ABA: TABELA DE PREÇO ---
  const [custo, setCusto] = useState('');
  const [margemLucro, setMargemLucro] = useState('');
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoAtacado, setPrecoAtacado] = useState('');

  const abas = [
    'Dados', 'Tabela de preço', 'Código de barras', 'Centro de custo', 
    'Imagem', 'Referência fornecedor', 'Composição', 'Observação', 
    'Processos', 'Regras', 'Regras cliente', 'Código alternativo', 'Conversão fornecedor'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Produto "${nome}" salvo com sucesso! \nPreço Venda: R$ ${preco} \nPreço Custo: R$ ${custo}`);
    onClose(); 
  };

  const randomOffset = (id % 10) * 15; 

  return (
    <Draggable 
      nodeRef={nodeRef} 
      handle=".window-header" 
      defaultPosition={{ x: 100 + randomOffset, y: 100 + randomOffset }}
    >
      <div ref={nodeRef} className="floating-window" style={{ maxWidth: '950px', width: '95%' }}>
        
        {/* Cabeçalho da Janela */}
        <div className="window-header">
          <span>Cadastro de Produto (ID: {id.toString().slice(-4)})</span>
          <div className="window-controls">
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onMinimize} title="Minimizar">_</button>
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onClose} title="Fechar">X</button>
          </div>
        </div>

        {/* Corpo da Janela com Abas */}
        <div className="window-body">
          
          <div className="tabs-header">
            {abas.map(aba => (
              <button
                key={aba}
                type="button"
                className={`tab-btn ${abaAtiva === aba ? 'active' : ''}`}
                onClick={() => setAbaAtiva(aba)}
              >
                {aba}
              </button>
            ))}
          </div>

          <div className="tab-content">
            <form onSubmit={handleSubmit}>
              
              {/* --- ABA: DADOS --- */}
              {abaAtiva === 'Dados' && (
                <>
                  <div className="form-group">
                    <label>Nome do Produto *</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Teclado Mecânico" />
                  </div>

                  <div className="form-group">
                    <label>Descrição</label>
                    <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows="3" placeholder="Detalhes do produto..."></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Preço de Venda (R$) *</label>
                      <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>Estoque Inicial *</label>
                      <input type="number" value={estoque} onChange={e => setEstoque(e.target.value)} required placeholder="0" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Categoria</label>
                    <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ex: Informática" />
                  </div>
                </>
              )}

              {/* --- ABA: TABELA DE PREÇO --- */}
              {abaAtiva === 'Tabela de preço' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Preço de Custo (R$)</label>
                      <input type="number" step="0.01" value={custo} onChange={e => setCusto(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>Margem de Lucro (%)</label>
                      <input type="number" step="0.01" value={margemLucro} onChange={e => setMargemLucro(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>Preço de Venda (R$) *</label>
                      <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required placeholder="0.00" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Preço Mínimo Permitido (R$)</label>
                      <input type="number" step="0.01" value={precoMinimo} onChange={e => setPrecoMinimo(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>Preço para Atacado (R$)</label>
                      <input type="number" step="0.01" value={precoAtacado} onChange={e => setPrecoAtacado(e.target.value)} placeholder="0.00" />
                    </div>
                  </div>
                </>
              )}

              {/* MENSAGEM PARA AS OUTRAS ABAS (Somente se não for 'Dados' e nem 'Tabela de preço') */}
              {abaAtiva !== 'Dados' && abaAtiva !== 'Tabela de preço' && (
                <div className="aba-placeholder">
                  Configurações da aba <strong>{abaAtiva}</strong> em desenvolvimento...
                </div>
              )}

              {/* Botões de Salvar/Cancelar */}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Produto</button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </Draggable>
  );
}

// --- TELA PRINCIPAL DO ERP ---
function App() {
  const [usuario, setUsuario] = useState(null);
  const [janelas, setJanelas] = useState([]); // Gerencia as múltiplas janelas abertas

  // Função para instanciar uma nova janela
  const abrirNovaJanelaProduto = () => {
    const novaJanela = {
      id: Date.now(), // Usamos o tempo exato para ser um ID único
      tipo: 'produto',
      titulo: 'Novo Produto',
      minimizada: false
    };
    setJanelas([...janelas, novaJanela]);
  };

  // Funções de controle de janelas
  const fecharJanela = (idParaFechar) => {
    setJanelas(janelas.filter(janela => janela.id !== idParaFechar));
  };

  const alternarMinimizar = (idParaAlternar) => {
    setJanelas(janelas.map(janela => {
      if (janela.id === idParaAlternar) {
        return { ...janela, minimizada: !janela.minimizada };
      }
      return janela;
    }));
  };

  // Se não estiver logado, exibe a tela de login
  if (!usuario) {
    return <LoginScreen onLoginSuccess={setUsuario} />;
  }

  // Se estiver logado, exibe a interface principal (ERP)
  return (
    <div className="app-wrapper">
      
      {/* BARRA SUPERIOR (HEADER) */}
      <header className="app-header">
        <h2 style={{ margin: 0, fontSize: '20px' }}>Meu ERP</h2>
        
        <div className="nav-menu">
          <Dropdown title="Cadastro" items={[
            { label: 'Cadastrar novos produtos', onClick: abrirNovaJanelaProduto },
            { label: 'Novos clientes', onClick: () => alert("Módulo em desenvolvimento") },
            { label: 'Novos fornecedores', onClick: () => alert("Módulo em desenvolvimento") }
          ]} />
          <Dropdown title="Estoque" items={['Entrada Produto', 'Saída Produto']} />
          <Dropdown title="Pedidos" items={['Novo Orçamento', 'Novo Pré-Pedido']} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '20px' }}>
            Olá, {usuario.username}
          </span>
          <LogOut size={20} style={{ cursor: 'pointer', color: '#ff6b6b' }} onClick={() => setUsuario(null)} title="Sair do sistema" />
        </div>
      </header>

      {/* ÁREA CENTRAL DE FUNDO */}
      <main className="main-content">
        <div className="welcome-box">
            <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Bem-vindo ao Sistema!</h1>
            <p style={{ color: '#666' }}>Utilize o menu "Cadastro" para abrir janelas de trabalho.</p>
        </div>
      </main>

      {/* RENDERIZAÇÃO DAS JANELAS ABERTAS (Se não estiverem minimizadas) */}
      {janelas.map(janela => {
        if (janela.minimizada) return null;

        if (janela.tipo === 'produto') {
          return (
            <ProdutoWindow 
              key={janela.id} 
              id={janela.id}
              onClose={() => fecharJanela(janela.id)}
              onMinimize={() => alternarMinimizar(janela.id)}
            />
          );
        }
        return null;
      })}

      {/* BARRA DE TAREFAS NO RODAPÉ */}
      {janelas.length > 0 && (
        <div className="taskbar">
          {janelas.map(janela => (
            <button 
              key={janela.id}
              className={`taskbar-item ${janela.minimizada ? 'minimized' : ''}`}
              onClick={() => alternarMinimizar(janela.id)}
              title={janela.minimizada ? "Restaurar janela" : "Minimizar janela"}
            >
              {janela.titulo} ({janela.id.toString().slice(-4)})
            </button>
          ))}
        </div>
      )}

    </div>
  );
}

export default App;