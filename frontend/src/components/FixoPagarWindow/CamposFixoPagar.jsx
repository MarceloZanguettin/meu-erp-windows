import React from 'react';

/**
 * Campos do formulário de Fixo a Pagar (GENUS.FIXOPAGAR) — reutilizado tanto
 * pelo modal de edição em FixoPagarWindow quanto pela janela de criação
 * NovoFixoPagarWindow, para os dois ficarem sempre em sincronia.
 */
export default function CamposFixoPagar({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="fp-secao">Identificação (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
      </div>

      <div className="fp-secao">Beneficiário / Vínculos</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Cadastro (beneficiário)</label>
          <input type="number" value={form.cod_cadastro} onChange={set('cod_cadastro')} />
        </div>
        <div className="form-group">
          <label>Cód. Contas</label>
          <input type="number" value={form.cod_contas} onChange={set('cod_contas')} />
        </div>
        <div className="form-group">
          <label>Cód. Carteira</label>
          <input type="number" value={form.cod_carteira} onChange={set('cod_carteira')} />
        </div>
        <div className="form-group">
          <label>Cód. Histórico</label>
          <input maxLength={12} value={form.cod_historico} onChange={set('cod_historico')} />
        </div>
      </div>

      <div className="fp-secao">Vigência / Vencimento</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Início</label>
          <input maxLength={6} placeholder="MMAAAA" value={form.inicio} onChange={set('inicio')} />
        </div>
        <div className="form-group">
          <label>Término</label>
          <input maxLength={6} placeholder="MMAAAA" value={form.termino} onChange={set('termino')} />
        </div>
        <div className="form-group">
          <label>Dia de Vencimento</label>
          <input type="number" value={form.dia} onChange={set('dia')} />
        </div>
        <div className="form-group">
          <label>Qtde. Parcelas</label>
          <input type="number" value={form.qtde_parcela} onChange={set('qtde_parcela')} />
        </div>
      </div>

      <div className="fp-secao">Valor / Observação</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Valor</label>
          <input type="number" step="0.01" value={form.valor} onChange={set('valor')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <input maxLength={50} value={form.obs} onChange={set('obs')} />
        </div>
      </div>
    </>
  );
}
