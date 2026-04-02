import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import './UsuariosWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = { nome: '', descricao: '' };

export default function NovoPerfilAcessoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const r = await fetch(`${API}/usuarios/perfis`, {
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
    <JanelaBase id={id} titulo="Novo Perfil de Acesso" onClose={onClose} onMinimize={onMinimize} largura={460} altura={340} minLargura={360} minAltura={280}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="usuario-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
          <div className="form-group">
            <label>Nome *</label>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
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
