import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import './ProductWindow.css';

// Importação das Abas
import AbaDados from './abas/AbaDados';
import AbaTabelaPreco from './abas/AbaTabelaPreco';

export default function ProdutoWindow({ id, onClose, onMinimize }) {
  const nodeRef = useRef(null); 
  const [abaAtiva, setAbaAtiva] = useState('Dados');

  // Variáveis de Estado (Concentradas aqui e passadas para as abas)
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [estoque, setEstoque] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState(''); 
  const [custo, setCusto] = useState('');
  const [margemLucro, setMargemLucro] = useState('');
  const [precoMinimo, setPrecoMinimo] = useState('');
  const [precoAtacado, setPrecoAtacado] = useState('');

  // Objeto contendo todos os estados para passar de uma vez só
  const estadosFormulario = {
    nome, setNome, descricao, setDescricao, estoque, setEstoque,
    categoria, setCategoria, preco, setPreco, custo, setCusto,
    margemLucro, setMargemLucro, precoMinimo, setPrecoMinimo, precoAtacado, setPrecoAtacado
  };

  const abas = [
    'Dados', 'Tabela de preço', 'Código de barras', 'Centro de custo', 
    'Imagem', 'Referência fornecedor', 'Composição', 'Observação', 
    'Processos', 'Regras', 'Regras cliente', 'Código alternativo', 'Conversão fornecedor'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Produto "${nome}" salvo com sucesso!`);
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
        
        <div className="window-header">
          <span>Cadastro de Produto (ID: {id.toString().slice(-4)})</span>
          <div className="window-controls">
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onMinimize}>_</button>
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onClose}>X</button>
          </div>
        </div>

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
              
              {/* RENDERIZAÇÃO CONDICIONAL DAS ABAS */}
              {abaAtiva === 'Dados' && <AbaDados estados={estadosFormulario} />}
              {abaAtiva === 'Tabela de preço' && <AbaTabelaPreco estados={estadosFormulario} />}

              {/* MENSAGEM PARA ABAS AINDA NÃO DESENVOLVIDAS */}
              {abaAtiva !== 'Dados' && abaAtiva !== 'Tabela de preço' && (
                <div className="aba-placeholder">
                  Configurações da aba <strong>{abaAtiva}</strong> em desenvolvimento...
                </div>
              )}

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