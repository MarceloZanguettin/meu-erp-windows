import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposFaturaPagar from './CamposFaturaPagar.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarFaturaPagar } from './services/faturaPagarService.js';

const API = 'http://localhost:8050';

export default function NovoFaturaPagarWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/faturas-pagar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarFaturaPagar(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Fatura a Pagar" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={560} minLargura={520} minAltura={420}
      salvar={salvar}
    >
      <CamposFaturaPagar form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
