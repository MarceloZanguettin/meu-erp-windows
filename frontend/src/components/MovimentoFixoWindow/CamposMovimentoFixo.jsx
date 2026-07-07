import React from 'react';

/**
 * Campos do formulário de Movimento Fixo (GENUS.MOVTOFIXO) — reutilizado
 * tanto pelo modal de edição em MovimentoFixoWindow quanto pela janela de
 * criação NovoMovimentoFixoWindow, para os dois ficarem sempre em
 * sincronia.
 */
export default function CamposMovimentoFixo({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="mf-secao">Competência (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Mês</label>
          <input maxLength={2} placeholder="MM" value={form.mes} onChange={set('mes')} />
        </div>
        <div className="form-group">
          <label>Ano</label>
          <input maxLength={4} placeholder="AAAA" value={form.ano} onChange={set('ano')} />
        </div>
      </div>

      <div className="mf-secao">Origem do Título Fixo</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Fixo a Pagar</label>
          <input type="number" value={form.cod_fixo_pagar} onChange={set('cod_fixo_pagar')} />
        </div>
        <div className="form-group">
          <label>Cód. Fixo a Receber</label>
          <input type="number" value={form.cod_fixo_receber} onChange={set('cod_fixo_receber')} />
        </div>
      </div>
    </>
  );
}
