import React from 'react';

/**
 * Campos do formulário de Cheque Emitido (GENUS.CHEQUE_EMITIDO) — reutilizado
 * tanto pelo modal de edição em ChequeEmitidoWindow quanto pela janela de
 * criação NovoChequeEmitidoWindow, para os dois ficarem sempre em sincronia.
 *
 * No GENUS, CHEQUE_EMITIDO é o cheque próprio emitido pela empresa para
 * pagar um fornecedor/título — o contraponto, no lado de contas a pagar, de
 * GENUS.CHEQUE (cheque de terceiro recebido, ainda não modelado neste ERP).
 * Ver docstring do model ChequeEmitido em backend/models/tabelas.py para o
 * detalhe completo (chave composta CODCONTAS+CHEQUE, vínculo com ContaPagar
 * via CODPAGAR etc.).
 */
export default function CamposChequeEmitido({ form, setForm }) {
  const set = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  return (
    <>
      <div className="ce-secao">Vínculo com o título a pagar (ContaPagar)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Conta a Pagar (ID interno)</label>
          <input type="number" value={form.conta_pagar_id} onChange={set('conta_pagar_id')} />
        </div>
        <div className="form-group">
          <label>Cód. Pagar (GENUS)</label>
          <input type="number" value={form.cod_pagar} onChange={set('cod_pagar')} />
        </div>
        <div className="form-group">
          <label>Cód. Empresa Pagar</label>
          <input type="number" value={form.cod_empresa_pagar} onChange={set('cod_empresa_pagar')} />
        </div>
      </div>

      <div className="ce-secao">Identificação do Cheque (GENUS)</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Cód. Empresa</label>
          <input type="number" value={form.cod_empresa} onChange={set('cod_empresa')} />
        </div>
        <div className="form-group">
          <label>Cód. Contas (conta bancária emissora)</label>
          <input type="number" value={form.cod_contas} onChange={set('cod_contas')} />
        </div>
        <div className="form-group">
          <label>Número do Cheque</label>
          <input type="number" value={form.cheque} onChange={set('cheque')} />
        </div>
        <div className="form-group">
          <label>Nominal (favorecido)</label>
          <input maxLength={30} value={form.nominal} onChange={set('nominal')} />
        </div>
      </div>

      <div className="ce-secao">Datas</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Emissão</label>
          <input type="date" value={form.emissao} onChange={set('emissao')} />
        </div>
        <div className="form-group">
          <label>Para (pré-datado)</label>
          <input type="date" value={form.para} onChange={set('para')} />
        </div>
        <div className="form-group">
          <label>Devolve</label>
          <input type="date" value={form.devolve} onChange={set('devolve')} />
        </div>
        <div className="form-group">
          <label>Data Baixa</label>
          <input type="date" value={form.dt_baixa} onChange={set('dt_baixa')} />
        </div>
        <div className="form-group">
          <label>Digitado</label>
          <input type="date" value={form.digitado} onChange={set('digitado')} />
        </div>
      </div>

      <div className="ce-secao">Valor / Observação</div>
      <div className="form-grid-2">
        <div className="form-group">
          <label>Valor</label>
          <input type="number" step="0.01" value={form.valor} onChange={set('valor')} />
        </div>
        <div className="form-group">
          <label>Cód. Histórico</label>
          <input maxLength={12} value={form.cod_historico} onChange={set('cod_historico')} />
        </div>
        <div className="form-group form-group-full">
          <label>Observação</label>
          <input value={form.obs} onChange={set('obs')} />
        </div>
      </div>

      <div className="ce-secao">Auditoria (GENUS)</div>
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
