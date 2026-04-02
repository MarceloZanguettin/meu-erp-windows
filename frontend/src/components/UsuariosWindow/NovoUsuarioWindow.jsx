import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import './UsuariosWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = { username: '', password: '', permissao: 'operador' };

export default function NovoUsuarioWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const r = await fetch(`${API}/usuarios/`, {
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
    <JanelaBase id={id} titulo="Novo Usuário" onClose={onClose} onMinimize={onMinimize} largura={460} altura={360} minLargura={360} minAltura={300}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="usuario-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
          <div className="form-group">
            <label>Username *</label>
            <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} autoComplete="off" />
          </div>
          <div className="form-group">
            <label>Senha *</label>
            <input
              type="password"
              placeholder="Senha"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Permissão</label>
            <select value={form.permissao} onChange={e => setForm({ ...form, permissao: e.target.value })}>
              <option value="admin">Administrador</option>
              <option value="gerente">Gerente</option>
              <option value="operador">Operador</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </div>
        </div>
        <div className="modal-actions" style={{ flexShrink: 0, borderTop: '1px solid #e2e8f0', padding: '10px 16px' }}>
          <button className="btn-cancel" onClick={onClose} disabled={salvando}>Cancelar</button>
          <button className="btn-save" onClick={handleSalvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </JanelaBase>
  );
}
