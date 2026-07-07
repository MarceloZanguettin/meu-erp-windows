import React from 'react';

/**
 * Campos do formulário de Lançamento Contábil (GENUS.LANCAMENTO) — reutilizado
 * tanto pelo modal de edição em LancamentoContabilWindow quanto pela janela de
 * criação NovoLancamentoContabilWindow, para os dois ficarem sempre em
 * sincronia.
 */
export default function CamposLancamentoContabil({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="lc-secao">Identificação / Origem (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={form.codigo} onChange={set('codigo')} />
        </div>
        <div className="form-group">
          <label>Cód. Contas (Plano de Contas)</label>
          <input type="number" value={form.cod_contas} onChange={set('cod_contas')} />
        </div>
        <div className="form-group">
          <label>Cód. Histórico</label>
          <input maxLength={12} value={form.cod_historico} onChange={set('cod_historico')} />
        </div>
        <div className="form-group">
          <label>Valor</label>
          <input type="number" step="0.01" value={form.valor} onChange={set('valor')} />
        </div>
        <div className="form-group">
          <label>Documento</label>
          <input maxLength={15} value={form.doc} onChange={set('doc')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <input maxLength={70} value={form.obs} onChange={set('obs')} />
        </div>
        <div className="form-group">
          <label>Data de Movimento</label>
          <input type="date" value={form.dt_movto} onChange={set('dt_movto')} />
        </div>
        <div className="form-group">
          <label>Usuário</label>
          <input maxLength={20} value={form.usuario} onChange={set('usuario')} />
        </div>
        <div className="form-group">
          <label>Data de Digitação</label>
          <input type="date" value={form.dt_digitacao} onChange={set('dt_digitacao')} />
        </div>
        <div className="form-group">
          <label>Cód. Centro de Custo</label>
          <input type="number" value={form.cod_centro_custo} onChange={set('cod_centro_custo')} />
        </div>
      </div>

      <div className="lc-secao">Auditoria de Alteração (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Alteração</label>
          <input type="number" value={form.cod_alteracao} onChange={set('cod_alteracao')} />
        </div>
        <div className="form-group">
          <label>Hora da Alteração</label>
          <input maxLength={8} placeholder="HH:MM:SS" value={form.hora_alteracao_genus} onChange={set('hora_alteracao_genus')} />
        </div>
        <div className="form-group">
          <label>Data da Alteração</label>
          <input type="date" value={form.data_alteracao_genus} onChange={set('data_alteracao_genus')} />
        </div>
      </div>

      <div className="lc-secao">Partida Dobrada / Contrapartida</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Partida Dobrada</label>
          <input maxLength={1} placeholder="S/N" value={form.partida_dobrada} onChange={set('partida_dobrada')} />
        </div>
        <div className="form-group">
          <label>Cód. Partida Dobrada</label>
          <input type="number" value={form.cod_partida_dobrada} onChange={set('cod_partida_dobrada')} />
        </div>
        <div className="form-group">
          <label>Cód. Lançamento de Crédito (contrapartida)</label>
          <input type="number" value={form.cod_lanc_credito} onChange={set('cod_lanc_credito')} />
        </div>
      </div>

      <div className="lc-secao">Origem do Lançamento</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Comissão Representante</label>
          <input type="number" value={form.cod_comissao_representante} onChange={set('cod_comissao_representante')} />
        </div>
        <div className="form-group">
          <label>Cód. Receber (ContaReceber)</label>
          <input type="number" value={form.cod_receber} onChange={set('cod_receber')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa (Receber)</label>
          <input type="number" value={form.cod_empresa_receber} onChange={set('cod_empresa_receber')} />
        </div>
        <div className="form-group">
          <label>Cód. Crédito Fornecedor</label>
          <input type="number" value={form.cod_credito_fornecedor} onChange={set('cod_credito_fornecedor')} />
        </div>
        <div className="form-group">
          <label>Cód. Depósito</label>
          <input type="number" value={form.cod_deposito} onChange={set('cod_deposito')} />
        </div>
      </div>
    </>
  );
}
