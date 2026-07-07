import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposContaGenus from './CamposContaGenus.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarContaGenus } from './services/contaGenusService.js';

const API = 'http://localhost:8050';

export default function NovoContaGenusWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/contas-genus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarContaGenus(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Conta (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={560} minLargura={520} minAltura={400}
      salvar={salvar}
    >
      <CamposContaGenus form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
