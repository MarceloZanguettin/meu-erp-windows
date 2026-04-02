import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import './ProductWindow.css';
import { useWindowResize } from '../../hooks/useWindowResize.jsx';
import { useProdutoForm }  from './hooks/useProdutoForm.js';

import AbaDados       from './abas/AbaDados';
import AbaTabelaPreco from './abas/AbaTabelaPreco';
import { useState } from 'react';

const ABAS = [
  'Dados', 'Tabela de preço', 'Código de barras', 'Centro de custo',
  'Imagem', 'Referência fornecedor', 'Composição', 'Observação',
  'Processos', 'Regras', 'Regras cliente', 'Código alternativo', 'Conversão fornecedor',
];

export default function ProdutoWindow({ id, onClose, onMinimize }) {
  const nodeRef  = useRef(null);
  const [abaAtiva, setAbaAtiva] = useState('Dados');

  const randomOffset = (id % 10) * 15;
  const { winPos, setWinPos, winSize, ResizeHandles } = useWindowResize({
    initX: 100 + randomOffset,
    initY: 100 + randomOffset,
    initW: 950,
    initH: 600,
    minW:  600,
    minH:  400,
  });

  const { form, setField, resetForm } = useProdutoForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Produto "${form.nome}" salvo com sucesso!`);
    resetForm();
    onClose();
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-header"
      position={winPos}
      onDrag={(_e, data) => setWinPos({ x: data.x, y: data.y })}
    >
      <div
        ref={nodeRef}
        className="floating-window"
        style={{ width: winSize.width, height: winSize.height }}
      >
        <ResizeHandles />

        <div className="window-header">
          <span>Cadastro de Produto (ID: {id.toString().slice(-4)})</span>
          <div className="window-controls">
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onMinimize} title="Minimizar">—</button>
            <button type="button" className="window-btn" onMouseDown={e => e.stopPropagation()} onClick={onClose}   title="Fechar">✕</button>
          </div>
        </div>

        <div className="window-body">
          <div className="product-top-section">
            <div className="search-container">
              <button type="button" className="btn-search" title="Pesquisar Produto cadastrado">
                🔍 Pesquisar
              </button>
            </div>

            <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
              <label>Código</label>
              <input
                type="text"
                value={form.codigo}
                onChange={e => setField('codigo', e.target.value)}
                placeholder="Auto"
              />
            </div>

            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label>Descrição:</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setField('nome', e.target.value)}
                required
                placeholder="Ex: Pulverizador..."
              />
            </div>
          </div>

          <div className="tabs-header">
            {ABAS.map(aba => (
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
              {abaAtiva === 'Dados'           && <AbaDados       form={form} setField={setField} />}
              {abaAtiva === 'Tabela de preço' && <AbaTabelaPreco form={form} setField={setField} />}
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
