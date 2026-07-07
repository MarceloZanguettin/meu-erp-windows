import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposFatura from './CamposFatura.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFatura } from './services/faturaService.js';

const API = 'http://localhost:8050';

export default function NovoFaturaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/faturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarFatura(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Fatura" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={520} minLargura={520} minAltura={380}
      salvar={salvar}
    >
      <CamposFatura form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
