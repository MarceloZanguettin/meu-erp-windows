import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import './TransportadoraWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = {
  nome: '', cnpj: '', email: '', telefone: '',
  cep: '', logradouro: '', numero: '', bairro: '', cidade: '', uf: '',
  observacao: '', ativo: true,
};

export default function NovaTransportadoraWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const r = await fetch(`${API}/cadastros/transportadoras`, {
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
    <JanelaBase id={id} titulo="Nova Transportadora" onClose={onClose} onMinimize={onMinimize} largura={760} altura={560} minLargura={520} minAltura={400}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="transp-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
          <div className="form-grid-2">
            <div className="form-group form-group-full">
              <label>Nome *</label>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div className="form-group">
              <label>CNPJ</label>
              <input value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })} />
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
              <label>CEP</label>
              <input value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Logradouro</label>
              <input value={form.logradouro} onChange={e => setForm({ ...form, logradouro: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Número</label>
              <input value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input value={form.bairro} onChange={e => setForm({ ...form, bairro: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Cidade</label>
              <input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} />
            </div>
            <div className="form-group">
              <label>UF</label>
              <input maxLength={2} value={form.uf} onChange={e => setForm({ ...form, uf: e.target.value.toUpperCase() })} />
            </div>
            <div className="form-group form-group-full">
              <label>Observação</label>
              <textarea rows={2} value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
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
