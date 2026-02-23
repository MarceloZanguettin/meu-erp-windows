import React from 'react';

export default function AbaTabelaPreco({ estados }) {
  const { 
    custo, setCusto, 
    margemLucro, setMargemLucro, 
    preco, setPreco, 
    precoMinimo, setPrecoMinimo, 
    precoAtacado, setPrecoAtacado 
  } = estados;

  return (
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
  );
}