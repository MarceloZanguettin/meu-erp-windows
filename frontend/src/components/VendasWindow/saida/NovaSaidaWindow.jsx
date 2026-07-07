import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposSaida from './CamposSaida.jsx';
import { FORM_VAZIO_SAIDA, normalizarSaida } from './camposSaida.js';

const API = 'http://localhost:8050';

export default function NovaSaidaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_SAIDA });

  const salvar = async () => {
    const r = await fetch(`${API}/saidas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarSaida(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Saída" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={700} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposSaida form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
