import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposMovto from './CamposMovto.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarMovto } from './services/movtoService.js';

const API = 'http://localhost:8050';

export default function NovoMovtoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/movtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarMovto(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Movimento (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={620} minLargura={560} minAltura={440}
      salvar={salvar}
    >
      <CamposMovto form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
