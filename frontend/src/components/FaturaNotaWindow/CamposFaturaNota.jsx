import React from 'react';

/**
 * Campos do formulário de Vínculo Fatura-Nota Fiscal (GENUS.FATURANOTA) —
 * reutilizado tanto pelo modal de edição em FaturaNotaWindow quanto pela
 * janela de criação NovoFaturaNotaWindow, para os dois ficarem sempre em
 * sincronia.
 */
export default function CamposFaturaNota({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="fn-secao">Vínculo (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Cód. Fatura</label>
          <input type="number" value={form.cod_fatura} onChange={set('cod_fatura')} />
        </div>
        <div className="form-group">
          <label>Cód. Saída (GENUS)</label>
          <input type="number" value={form.cod_saida} onChange={set('cod_saida')} />
        </div>
        <div className="form-group">
          <label>Saída vinculada (ID interno)</label>
          <input type="number" value={form.saida_id} onChange={set('saida_id')} />
        </div>
      </div>
    </>
  );
}
