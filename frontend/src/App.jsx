import React, { useState } from 'react';
import './App.css';

// Importação dos Módulos Separados (Componentes)
import LoginScreen from './components/LoginScreen/LoginScreen.jsx';
import Header from './components/Header/Header.jsx';
import Taskbar from './components/Taskbar/Taskbar.jsx';
import ProdutoWindow from './components/ProductWindow/ProductWindow.jsx';

// --- TELA PRINCIPAL DO ERP ---
function App() {
  const [usuario, setUsuario] = useState(null);
  const [janelas, setJanelas] = useState([]);

  // Função para abrir uma nova janela
  const abrirNovaJanelaProduto = () => {
    const novaJanela = {
      id: Date.now(),
      tipo: 'produto',
      titulo: 'Novo Produto',
      minimizada: false
    };
    setJanelas([...janelas, novaJanela]);
  };

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

  // Se o usuário não estiver logado
  if (!usuario) {
    return <LoginScreen onLoginSuccess={setUsuario} />;
  }

  // Se o usuário ESTIVER logado, renderiza o sistema:
  return (
    <div className="app-wrapper">
      
      {/* Cabeçalho Injetado */}
      <Header 
        usuario={usuario} 
        setUsuario={setUsuario} 
        abrirNovaJanelaProduto={abrirNovaJanelaProduto} 
      />

      {/* Conteúdo Central */}
      <main className="main-content">
        <div className="welcome-box">
            <h1>Bem-vindo ao Sistema!</h1>
            <p>Utilize o menu "Cadastro" para abrir janelas de trabalho.</p>
        </div>
      </main>

      {/* Renderizador de Janelas Abertas */}
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

      {/* Rodapé Injetado */}
      <Taskbar janelas={janelas} alternarMinimizar={alternarMinimizar} />

    </div>
  );
}

export default App;