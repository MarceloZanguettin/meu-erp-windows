import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';

const API = 'http://localhost:8050';

/**
 * Janela genérica para adicionar um novo registro em qualquer aba de Tabelas Auxiliares.
 *
 * Props:
 *   config   - objeto da ABAS_CONFIG: { endpoint, formVazio, campasModal, label }
 *   onSalvar - callback para recarregar a lista na janela pai
 */
export default function NovaEntradaAuxiliarWindow({ id, onClose, onMinimize, config, onSalvar }) {
  const [form, setForm] = useState(() => ({ ...config.formVazio }));
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const r = await fetch(`${API}${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
        throw new Error(err.detail || 'Erro ao salvar');
      }
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <JanelaBase
      id={id}
      titulo={`Novo(a) ${config.label}`}
      onClose={onClose}
      onMinimize={onMinimize}
      largura={500}
      altura={420}
      minLargura={380}
      minAltura={320}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="modal-simples-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto', padding: '16px' }}>
          {config.campasModal.map(campo => (
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
                  {' '}{campo.label}
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
        <div className="modal-actions" style={{ flexShrink: 0, borderTop: '1px solid #e2e8f0', padding: '10px 16px' }}>
          <button className="btn-cancel" onClick={onClose} disabled={salvando}>Cancelar</button>
          <button className="btn-save" onClick={handleSalvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </JanelaBase>
  );
}
