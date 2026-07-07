import React from 'react';
import TabelaPrecosProduto from '../components/TabelaPrecosProduto.jsx';

export default function AbaTabelaPreco({ form, setField, produtoId }) {
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Preço de Custo (R$)</label>
          <input type="number" step="0.01" value={form.custo} onChange={e => setField('custo', e.target.value)} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Margem de Lucro (%)</label>
          <input type="number" step="0.01" value={form.margem_lucro} onChange={e => setField('margem_lucro', e.target.value)} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Preço de Venda (R$) *</label>
          <input type="number" step="0.01" value={form.preco} onChange={e => setField('preco', e.target.value)} required placeholder="0.00" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Preço Mínimo Permitido (R$)</label>
          <input type="number" step="0.01" value={form.preco_minimo} onChange={e => setField('preco_minimo', e.target.value)} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Preço para Atacado (R$)</label>
          <input type="number" step="0.01" value={form.preco_atacado} onChange={e => setField('preco_atacado', e.target.value)} placeholder="0.00" />
        </div>
      </div>

      <TabelaPrecosProduto produtoId={produtoId} />
    </>
  );
}
