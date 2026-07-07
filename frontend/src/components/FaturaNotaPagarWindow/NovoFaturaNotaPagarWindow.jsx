import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposFaturaNotaPagar from './CamposFaturaNotaPagar.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFaturaNotaPagar } from './services/faturaNotaPagarService.js';

const API = 'http://localhost:8050';

export default function NovoFaturaNotaPagarWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/faturas-nota-pagar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarFaturaNotaPagar(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Vínculo Fatura-Nota Pagar" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={720} altura={680} minLargura={580} minAltura={440}
      salvar={salvar}
    >
      <CamposFaturaNotaPagar form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
