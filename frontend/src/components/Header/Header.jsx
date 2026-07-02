import React, { useState } from 'react';
import { LogOut, ChevronDown } from 'lucide-react';
import './Header.css';

function Dropdown({ title, items }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="dropdown-container"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {title} {items && items.length > 0 && <ChevronDown size={14} />}

      {isOpen && items && items.length > 0 && (
        <div className="dropdown-menu">
          {items.map((item, index) => {
            const isObject    = typeof item === 'object';
            const label       = isObject ? item.label : item;
            const isSeparator = isObject && item.separator;
            if (isSeparator) return <div key={index} className="dropdown-separator" />;
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

/**
 * Barra de navegação superior.
 *
 * Recebe uma única callback `abrirJanela(tipo)` em vez de uma prop por janela.
 * Para adicionar um novo item de menu basta inserir a entrada aqui e registrar
 * o tipo correspondente em src/config/janelasConfig.js.
 */
export default function Header({ usuario, setUsuario, abrirJanela }) {
  return (
    <header className="app-header">
      <h2 className="header-title">Meu ERP</h2>

      <div className="nav-menu">
        <Dropdown title="Cadastro" items={[
          { label: 'Produtos',           onClick: () => abrirJanela('produto') },
          { label: 'Clientes',           onClick: () => abrirJanela('cliente') },
          { label: 'Fornecedores',       onClick: () => abrirJanela('fornecedor') },
          { label: 'Transportadoras',    onClick: () => abrirJanela('transportadora') },
          { label: 'Representantes',     onClick: () => abrirJanela('representante') },
          { label: 'Funcionários',       onClick: () => abrirJanela('funcionario') },
          { separator: true },
          { label: 'Tabelas Auxiliares', onClick: () => abrirJanela('tabelasAuxiliares') },
        ]} />

        <Dropdown title="Estoque" items={[
          { label: 'Posição / Movimentos', onClick: () => abrirJanela('estoque') },
        ]} />

        <Dropdown title="Compras" items={[
          { label: 'Solicitações / Pedidos de Compra', onClick: () => abrirJanela('compras') },
        ]} />

        <Dropdown title="Vendas" items={[
          { label: 'Orçamentos / Pedidos de Venda', onClick: () => abrirJanela('vendas') },
        ]} />

        <Dropdown title="Financeiro" items={[
          { label: 'Fluxo de Trabalho',   onClick: () => abrirJanela('fluxoTrabalho') },
          { label: 'Financeiro Agrupado', onClick: () => abrirJanela('financeiroAgrupado') },
        ]} />

        <Dropdown title="Configurações" items={[
          { label: 'Usuários e Perfis', onClick: () => abrirJanela('usuarios') },
          { separator: true },
          { label: 'Aparência do Sistema', onClick: () => abrirJanela('aparencia') },
        ]} />
      </div>

      <div className="user-info">
        <span className="user-badge">Olá, {usuario.username}</span>
        <LogOut
          size={20}
          className="logout-icon"
          onClick={() => setUsuario(null)}
          title="Sair do sistema"
        />
      </div>
    </header>
  );
}
