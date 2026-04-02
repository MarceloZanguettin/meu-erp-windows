import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import './RepresentanteWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = {
  nome: '', cpf_cnpj: '', email: '', telefone: '',
  celular: '', comissao_percentual: '', meta_mensal: '', ativo: true,
};

export default function NovoRepresentanteWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const r = await fetch(`${API}/cadastros/representantes`, {
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
    <JanelaBase id={id} titulo="Novo Representante" onClose={onClose} onMinimize={onMinimize} largura={680} altura={460} minLargura={480} minAltura={360}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="repr-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
          <div className="form-grid-2">
            <div className="form-group form-group-full">
              <label>Nome *</label>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="form-group">
              <label>CPF / CNPJ</label>
              <input value={form.cpf_cnpj} onChange={e => setForm({ ...form, cpf_cnpj: e.target.value })} />
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Celular</label>
              <input value={form.celular} onChange={e => setForm({ ...form, celular: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Comissão (%)</label>
              <input type="number" step="0.01" min="0" max="100" value={form.comissao_percentual} onChange={e => setForm({ ...form, comissao_percentual: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Meta Mensal (R$)</label>
              <input type="number" step="0.01" min="0" value={form.meta_mensal} onChange={e => setForm({ ...form, meta_mensal: e.target.value })} />
            </div>
            <div className="form-group form-group-checkbox">
              <label>
                <input type="checkbox" checked={!!form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
                Ativo
              </label>
            </div>
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
