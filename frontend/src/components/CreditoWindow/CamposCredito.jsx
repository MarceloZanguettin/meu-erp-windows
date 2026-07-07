import React from 'react';

/**
 * Campos do formulário de Crédito de Cliente (GENUS.CREDITO) — reutilizado
 * tanto pelo modal de edição em CreditoWindow quanto pela janela de criação
 * NovoCreditoWindow, para os dois ficarem sempre em sincronia.
 *
 * Ver docstring do model Credito em backend/models/tabelas.py para o detalhe
 * completo de cada campo (inclui onde CODCLIENTE, CODCONTA, CODHISTORICO e
 * CODSAIDA são referências brutas a outras tabelas GENUS já reconhecidas
 * neste ERP — CADASTRO/CLIENTE, PlanoConta, Historico e Saida — que só
 * podem ser resolvidas de fato pelo agente de migração de dados).
 */
export default function CamposCredito({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="cr-secao">Identificação (GENUS)</div>
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
          <label>Cód. Cliente</label>
          <input type="number" value={form.cod_cliente} onChange={set('cod_cliente')} />
        </div>
        <div className="form-group">
          <label>Emissão</label>
          <input type="date" value={form.emissao} onChange={set('emissao')} />
        </div>
      </div>

      <div className="cr-secao">Crédito</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Valor (crédito disponível)</label>
          <input type="number" step="0.01" value={form.valor} onChange={set('valor')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação (GENUS: OBS)</label>
          <textarea rows={3} value={form.obs} onChange={set('obs')} />
        </div>
      </div>

      <div className="cr-secao">Vínculos Contábeis (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Conta (Plano de Contas)</label>
          <input type="number" value={form.cod_conta} onChange={set('cod_conta')} />
        </div>
        <div className="form-group">
          <label>Cód. Histórico</label>
          <input maxLength={12} value={form.cod_historico} onChange={set('cod_historico')} />
        </div>
        <div className="form-group">
          <label>Cód. Saída</label>
          <input type="number" value={form.cod_saida} onChange={set('cod_saida')} />
        </div>
      </div>

      <div className="cr-secao">Auditoria (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Alteração</label>
          <input type="number" value={form.cod_alteracao} onChange={set('cod_alteracao')} />
        </div>
        <div className="form-group">
          <label>Hora Alteração</label>
          <input maxLength={8} value={form.hora_alteracao_genus} onChange={set('hora_alteracao_genus')} />
        </div>
        <div className="form-group">
          <label>Data Alteração</label>
          <input type="date" value={form.data_alteracao_genus} onChange={set('data_alteracao_genus')} />
        </div>
      </div>
    </>
  );
}
