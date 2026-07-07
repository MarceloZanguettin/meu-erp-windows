import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import './UsuariosWindow.css';

const API = 'http://localhost:8050';
const FORM_VAZIO = { username: '', password: '', permissao: 'operador' };

export default function NovoUsuarioWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/usuarios/`, {
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
      id={id} titulo="Novo Usuário" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={460} altura={360} minLargura={360} minAltura={300}
      salvar={salvar}
    >
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
    </CadastroFormWindow>
  );
}
