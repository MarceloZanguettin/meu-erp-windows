import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposCredito from './CamposCredito.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarCredito } from './services/creditoService.js';

const API = 'http://localhost:8050';

export default function NovoCreditoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/creditos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarCredito(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Crédito (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={560} minLargura={560} minAltura={420}
      salvar={salvar}
    >
      <CamposCredito form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
