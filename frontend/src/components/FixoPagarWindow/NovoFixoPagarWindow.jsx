import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposFixoPagar from './CamposFixoPagar.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFixoPagar } from './services/fixoPagarService.js';

const API = 'http://localhost:8050';

export default function NovoFixoPagarWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/fixos-pagar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarFixoPagar(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Fixo a Pagar" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={560} minLargura={520} minAltura={400}
      salvar={salvar}
    >
      <CamposFixoPagar form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
