import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Server, Plus, CheckCircle, AlertTriangle } from 'lucide-react';

// A API FastAPI roda na porta 8050, conforme definido no main.py
const API_URL = 'http://localhost:8050'; 

function App() {
  const [serverStatus, setServerStatus] = useState({ status: 'Verificando...', msg: '' });
  const [clienteId, setClienteId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [itensPedido, setItensPedido] = useState([]);
  const [mensagem, setMensagem] = useState(null);

  // Verifica o status do servidor ao carregar a página
  useEffect(() => {
    axios.get(`${API_URL}/api/status`)
      .then(response => {
        setServerStatus(response.data);
      })
      .catch(error => {
        setServerStatus({ status: 'Offline', msg: 'Não foi possível conectar ao servidor backend.' });
      });
  }, []);

  const adicionarItem = (e) => {
    e.preventDefault();
    if (!produtoId || quantidade <= 0) return;
    
    setItensPedido([
      ...itensPedido, 
      { produto_id: parseInt(produtoId), quantidade: parseInt(quantidade) }
    ]);
    setProdutoId('');
    setQuantidade(1);
  };

  const realizarVenda = async () => {
    if (!clienteId || itensPedido.length === 0) {
      setMensagem({ tipo: 'erro', texto: 'Informe o ID do cliente e adicione pelo menos um item.' });
      return;
    }

    // Estrutura exigida pelo schema PedidoCreate do backend
    const payload = {
      cliente_id: parseInt(clienteId),
      itens: itensPedido,
      total: 0 // O backend calcula o total real, mas o schema exige esse campo
    };

    try {
      const response = await axios.post(`${API_URL}/pedidos/`, payload);
      setMensagem({ tipo: 'sucesso', texto: `Venda ${response.data.pedido_id} realizada! Total: R$ ${response.data.total}` });
      setItensPedido([]);
      setClienteId('');
    } catch (error) {
      const erroMsg = error.response?.data?.detail || 'Erro ao realizar a venda.';
      setMensagem({ tipo: 'erro', texto: erroMsg });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h1>Meu ERP - PDV</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: serverStatus.status === 'Online' ? 'green' : 'red' }}>
          <Server size={20} />
          <span>{serverStatus.status}</span>
        </div>
      </header>

      {mensagem && (
        <div style={{ 
          padding: '10px', 
          marginTop: '20px', 
          backgroundColor: mensagem.tipo === 'sucesso' ? '#d4edda' : '#f8d7da',
          color: mensagem.tipo === 'sucesso' ? '#155724' : '#721c24',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle /> : <AlertTriangle />}
          {mensagem.texto}
        </div>
      )}

      <main style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Formulário de Adição de Itens */}
        <div style={{ flex: 1, padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2>Nova Venda</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>ID do Cliente:</label>
            <input 
              type="number" 
              value={clienteId} 
              onChange={e => setClienteId(e.target.value)} 
              style={{ width: '100%', padding: '8px' }}
              placeholder="Ex: 1"
            />
          </div>

          <form onSubmit={adicionarItem} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>ID do Produto:</label>
              <input 
                type="number" 
                value={produtoId} 
                onChange={e => setProdutoId(e.target.value)} 
                style={{ width: '100%', padding: '8px' }}
                placeholder="Ex: 10"
              />
            </div>
            <div style={{ width: '100px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Qtd:</label>
              <input 
                type="number" 
                min="1"
                value={quantidade} 
                onChange={e => setQuantidade(e.target.value)} 
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" style={{ padding: '9px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Plus size={16} /> Add
            </button>
          </form>
        </div>

        {/* Carrinho / Resumo do Pedido */}
        <div style={{ flex: 1, padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h2>Carrinho <ShoppingCart size={20} /></h2>
          {itensPedido.length === 0 ? (
            <p style={{ color: '#888' }}>Nenhum item adicionado.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {itensPedido.map((item, index) => (
                <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Produto ID: {item.produto_id}</span>
                  <strong>{item.quantidade}x</strong>
                </li>
              ))}
            </ul>
          )}

          <button 
            onClick={realizarVenda}
            disabled={itensPedido.length === 0}
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '20px', 
              backgroundColor: itensPedido.length === 0 ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: itensPedido.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Finalizar Venda
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;