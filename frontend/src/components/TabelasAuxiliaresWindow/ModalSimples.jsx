import React from 'react';
import Portal from '../shared/Portal.jsx';

/**
 * Modal genérico para tabelas auxiliares simples.
 *
 * @param {string}   titulo
 * @param {Array}    campos   - [{ label, key, type?, options? }]
 * @param {object}   form
 * @param {function} setForm
 * @param {function} onSalvar
 * @param {function} onFechar
 * @param {boolean}  editando
 */
export default function ModalSimples({ titulo, campos, form, setForm, onSalvar, onFechar, editando }) {
  return (
    <Portal>
      <div className="modal-overlay">
      <div className="modal-content modal-simples">
        <div className="modal-header">
          <strong>{editando ? `Editar ${titulo}` : `Novo ${titulo}`}</strong>
        </div>
        <div className="modal-body modal-simples-body">
          {campos.map(campo => (
            <div className="form-group" key={campo.key}>
              <label>{campo.label}</label>
              {campo.type === 'select' ? (
                <select
                  value={form[campo.key] ?? ''}
                  onChange={e => setForm({ ...form, [campo.key]: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  {(campo.options || []).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : campo.type === 'checkbox' ? (
                <label className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={!!form[campo.key]}
                    onChange={e => setForm({ ...form, [campo.key]: e.target.checked })}
                  />
                  {campo.label}
                </label>
              ) : (
                <input
                  type={campo.type || 'text'}
                  step={campo.step}
                  value={form[campo.key] ?? ''}
                  onChange={e => setForm({ ...form, [campo.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save" onClick={onSalvar}>Salvar</button>
        </div>
      </div>
      </div>
    </Portal>
  );
}
