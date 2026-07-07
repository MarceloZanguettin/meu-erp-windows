import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';

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

  const salvar = async () => {
    const normalizar = config.normalizar || ((f) => f);
    const r = await fetch(`${API}${config.endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizar(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id}
      titulo={`Novo(a) ${config.label}`}
      onClose={onClose}
      onMinimize={onMinimize}
      onSalvar={onSalvar}
      largura={500}
      altura={420}
      minLargura={380}
      minAltura={320}
      salvar={salvar}
    >
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
          ) : campo.type === 'textarea' ? (
            <textarea
              rows={3}
              value={form[campo.key] ?? ''}
              onChange={e => setForm({ ...form, [campo.key]: e.target.value })}
            />
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
    </CadastroFormWindow>
  );
}
