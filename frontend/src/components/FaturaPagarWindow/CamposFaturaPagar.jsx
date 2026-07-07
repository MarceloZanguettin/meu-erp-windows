import React from 'react';

/**
 * Campos do formulário de FaturaPagar (GENUS.FATURAPAGAR) — reutilizado
 * tanto pelo modal de edição em FaturaPagarWindow quanto pela janela de
 * criação NovoFaturaPagarWindow, para os dois ficarem sempre em sincronia.
 */
export default function CamposFaturaPagar({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="fatpag-secao">Identificação (GENUS)</div>
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
          <label>Documento</label>
          <input type="number" value={form.doc} onChange={set('doc')} />
        </div>
        <div className="form-group">
          <label>Emissão</label>
          <input type="date" value={form.emissao} onChange={set('emissao')} />
        </div>
        <div className="form-group">
          <label>Data-Base</label>
          <input type="date" value={form.data_base} onChange={set('data_base')} />
        </div>
      </div>

      <div className="fatpag-secao">Fornecedor / Vínculos</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Cadastro (fornecedor/credor)</label>
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

      <div className="fatpag-secao">Observações</div>
      <div className="form-group-full">
        <label>Observação (GENUS: OBS)</label>
        <textarea rows={3} value={form.obs} onChange={set('obs')} />
      </div>
    </>
  );
}
