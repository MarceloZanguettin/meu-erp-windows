import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposFaturaNota from './CamposFaturaNota.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFaturaNota } from './services/faturaNotaService.js';

const API = 'http://localhost:8050';

export default function NovoFaturaNotaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/faturas-nota`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarFaturaNota(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Vínculo Fatura-Nota" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={480} minLargura={520} minAltura={360}
      salvar={salvar}
    >
      <CamposFaturaNota form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
