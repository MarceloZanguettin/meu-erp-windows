import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposCarteira from './CamposCarteira.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarCarteira } from './services/carteiraService.js';

const API = 'http://localhost:8050';

export default function NovoCarteiraWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/carteiras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarCarteira(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Carteira (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={560} altura={420} minLargura={480} minAltura={340}
      salvar={salvar}
    >
      <CamposCarteira form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
