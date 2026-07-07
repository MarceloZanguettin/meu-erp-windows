import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import './UsuariosWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = { nome: '', descricao: '' };

export default function NovoPerfilAcessoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/usuarios/perfis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Perfil de Acesso" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={460} altura={340} minLargura={360} minAltura={280}
      salvar={salvar}
    >
      <div className="form-group">
        <label>Nome *</label>
        <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Descrição</label>
        <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
      </div>
    </CadastroFormWindow>
  );
}
