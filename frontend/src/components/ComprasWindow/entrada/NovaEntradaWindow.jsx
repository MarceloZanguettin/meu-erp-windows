import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposEntrada from './CamposEntrada.jsx';
import { FORM_VAZIO_ENTRADA, normalizarEntrada } from './camposEntrada.js';

const API = 'http://localhost:8050';

export default function NovaEntradaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_ENTRADA });

  const salvar = async () => {
    const r = await fetch(`${API}/entradas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarEntrada(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Entrada" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={700} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposEntrada form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
