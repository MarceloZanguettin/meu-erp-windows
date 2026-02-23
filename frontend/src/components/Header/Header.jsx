import React, { useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import './Header.css';

// Componente interno do Menu Cascata
function Dropdown({ title, items }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="dropdown-container" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      {title} {items && items.length > 0 && <ChevronDown size={14} />}
      
      {isOpen && items && items.length > 0 && (
        <div className="dropdown-menu">
          {items.map((item, index) => {
            const isObject = typeof item === 'object';
            const label = isObject ? item.label : item;
            const handleClick = () => {
              if (isObject && item.onClick) item.onClick();
              setIsOpen(false);
            };

            return (
              <div key={index} className="dropdown-item" onClick={handleClick}>
                {label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Header({ usuario, setUsuario, abrirNovaJanelaProduto }) {
  return (
    <header className="app-header">
      <h2 className="header-title">Meu ERP</h2>
      
      <div className="nav-menu">
        <Dropdown title="Cadastro" items={[
          { label: 'Cadastrar novos produtos', onClick: abrirNovaJanelaProduto },
          { label: 'Novos clientes', onClick: () => alert("Módulo em desenvolvimento") },
          { label: 'Novos fornecedores', onClick: () => alert("Módulo em desenvolvimento") }
        ]} />
        <Dropdown title="Estoque" items={['Entrada Produto', 'Saída Produto']} />
        <Dropdown title="Pedidos" items={['Novo Orçamento', 'Novo Pré-Pedido']} />
      </div>

      <div className="user-info">
        <span className="user-badge">Olá, {usuario.username}</span>
        <LogOut size={20} className="logout-icon" onClick={() => setUsuario(null)} title="Sair do sistema" />
      </div>
    </header>
  );
}