import React from 'react';

/**
 * Campos do formulário de Fatura (GENUS.FATURA) — reutilizado tanto pelo
 * modal de edição em FaturaWindow quanto pela janela de criação
 * NovoFaturaWindow, para os dois ficarem sempre em sincronia.
 */
export default function CamposFatura({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="fat-secao">Identificação (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Emissão</label>
          <input type="date" value={form.emissao} onChange={set('emissao')} />
        </div>
      </div>

      <div className="fat-secao">Sacado / Vínculos</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Cadastro (sacado/cliente)</label>
          <input type="number" value={form.cod_cadastro} onChange={set('cod_cadastro')} />
        </div>
        <div className="form-group">
          <label>Cód. Condição de Pagamento</label>
          <input maxLength={5} value={form.cod_cond_pagto} onChange={set('cod_cond_pagto')} />
        </div>
        <div className="form-group">
          <label>Cód. Carteira</label>
          <input type="number" value={form.cod_carteira} onChange={set('cod_carteira')} />
        </div>
      </div>
    </>
  );
}
