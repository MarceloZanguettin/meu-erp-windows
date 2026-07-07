import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposBcoSicred from './CamposBcoSicred.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarBcoSicred } from './services/bcoSicredService.js';

const API = 'http://localhost:8050';

export default function NovoBcoSicredWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/bco-sicred`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarBcoSicred(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Configuração Banco Sicred (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={720} altura={640} minLargura={560} minAltura={460}
      salvar={salvar}
    >
      <CamposBcoSicred form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
