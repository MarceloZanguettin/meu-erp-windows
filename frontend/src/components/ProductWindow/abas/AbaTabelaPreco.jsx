import React from 'react';

export default function AbaTabelaPreco({ form, setField }) {
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Preço de Custo (R$)</label>
          <input type="number" step="0.01" value={form.custo} onChange={e => setField('custo', e.target.value)} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Margem de Lucro (%)</label>
          <input type="number" step="0.01" value={form.margemLucro} onChange={e => setField('margemLucro', e.target.value)} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Preço de Venda (R$) *</label>
          <input type="number" step="0.01" value={form.preco} onChange={e => setField('preco', e.target.value)} required placeholder="0.00" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Preço Mínimo Permitido (R$)</label>
          <input type="number" step="0.01" value={form.precoMinimo} onChange={e => setField('precoMinimo', e.target.value)} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Preço para Atacado (R$)</label>
          <input type="number" step="0.01" value={form.precoAtacado} onChange={e => setField('precoAtacado', e.target.value)} placeholder="0.00" />
        </div>
      </div>
    </>
  );
}
