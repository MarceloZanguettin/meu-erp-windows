import React from 'react';
import Portal from '../../shared/Portal.jsx';

/**
 * Modal unificado de criação / edição de conta a pagar ou a receber
 * no módulo Fluxo de Trabalho.
 *
 * @param {{
 *   tipo:      'pagar'|'receber',
 *   editando:  number|null,
 *   form:      object,
 *   setForm:   Function,
 *   empresas:  object[],
 *   onSalvar:  Function,
 *   onFechar:  Function,
 * }} props
 */
export default function ModalContaFluxo({ tipo, editando, form, setForm, empresas, onSalvar, onFechar }) {
  const titulo = `${editando ? 'Editar' : 'Nova'} Conta a ${tipo === 'receber' ? 'Receber' : 'Pagar'}`;

  return (
    <Portal>
      <div className="fluxo-modal-overlay">
      <div className="fluxo-modal">
        <div className="fluxo-modal-header">{titulo}</div>
        <div className="fluxo-modal-body">
          <label>Empresa</label>
          <select
            value={form.empresa_id}
            onChange={e => setForm({ ...form, empresa_id: e.target.value })}
          >
            {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
          </select>

          <label>Descrição</label>
          <input
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
          />

          <label>Valor (R$)</label>
          <input
            type="number"
            step="0.01"
            value={form.valor}
            onChange={e => setForm({ ...form, valor: e.target.value })}
          />

          <label>Vencimento</label>
          <input
            type="date"
            value={form.data_vencimento}
            onChange={e => setForm({ ...form, data_vencimento: e.target.value })}
          />

          <label>Observação</label>
          <input
            value={form.observacao}
            onChange={e => setForm({ ...form, observacao: e.target.value })}
          />
        </div>
        <div className="fluxo-modal-footer">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save"   onClick={onSalvar}>Salvar</button>
        </div>
      </div>
      </div>
    </Portal>
  );
}
