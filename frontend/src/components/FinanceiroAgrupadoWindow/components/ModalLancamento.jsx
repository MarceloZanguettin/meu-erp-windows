import React from 'react';

/**
 * Modal unificado para criar ou editar um lançamento a pagar ou a receber.
 *
 * @param {{
 *   tipo:         'pagar'|'receber'|null,
 *   editandoId:   number|null,
 *   form:         object,
 *   setForm:      Function,
 *   empresas:     object[],
 *   bancosDoForm: object[],
 *   onSalvar:     Function,
 *   onFechar:     Function,
 * }} props
 */
export default function ModalLancamento({
  tipo, editandoId, form, setForm,
  empresas, bancosDoForm,
  onSalvar, onFechar,
}) {
  if (!tipo) return null;

  const titulo = `${editandoId ? 'Editar' : 'Novo'} Lançamento a ${tipo === 'receber' ? 'Receber' : 'Pagar'}`;

  return (
    <div className="fagrup-modal-overlay">
      <div className="fagrup-modal">
        <h3>{titulo}</h3>

        <div className="fagrup-form-group">
          <label>Empresa</label>
          <select
            value={form.empresa_id}
            onChange={e => setForm({ ...form, empresa_id: e.target.value, conta_bancaria_id: '' })}
          >
            <option value="">Selecione</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>

        <div className="fagrup-form-group">
          <label>Conta Bancária</label>
          <select
            value={form.conta_bancaria_id}
            onChange={e => setForm({ ...form, conta_bancaria_id: e.target.value })}
          >
            <option value="">Selecione</option>
            {bancosDoForm.map(cb => <option key={cb.id} value={cb.id}>{cb.banco}</option>)}
          </select>
        </div>

        <div className="fagrup-form-group">
          <label>Descrição</label>
          <input
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        <div className="fagrup-form-row">
          <div className="fagrup-form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.valor}
              onChange={e => setForm({ ...form, valor: e.target.value })}
            />
          </div>
          <div className="fagrup-form-group">
            <label>Vencimento</label>
            <input
              type="date"
              value={form.data_vencimento}
              onChange={e => setForm({ ...form, data_vencimento: e.target.value })}
            />
          </div>
        </div>

        <div className="fagrup-form-group">
          <label>Observação</label>
          <input
            value={form.observacao}
            onChange={e => setForm({ ...form, observacao: e.target.value })}
          />
        </div>

        <div className="fagrup-modal-actions">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button
            className={`btn-save ${tipo === 'receber' ? 'receber-save' : 'pagar-save'}`}
            onClick={onSalvar}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
