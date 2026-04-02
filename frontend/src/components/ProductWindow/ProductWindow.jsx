import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import './ProductWindow.css';
import { useProdutoForm } from './hooks/useProdutoForm.js';

import AbaDados       from './abas/AbaDados';
import AbaTabelaPreco from './abas/AbaTabelaPreco';

const ABAS = [
  'Dados', 'Tabela de preço', 'Código de barras', 'Centro de custo',
  'Imagem', 'Referência fornecedor', 'Composição', 'Observação',
  'Processos', 'Regras', 'Regras cliente', 'Código alternativo', 'Conversão fornecedor',
];

export default function ProdutoWindow({ id, onClose, onMinimize }) {
  const [abaAtiva, setAbaAtiva] = useState('Dados');
  const { form, setField, resetForm } = useProdutoForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Produto "${form.nome}" salvo com sucesso!`);
    resetForm();
    onClose();
  };

  return (
    <JanelaBase
      id={id}
      titulo="Cadastro de Produto"
      onClose={onClose}
      onMinimize={onMinimize}
      largura={950}
      altura={600}
      minLargura={600}
      minAltura={400}
      maximizavel
      iniciarMaximizado
    >
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

      <div className="tab-content" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
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
    </JanelaBase>
  );
}
