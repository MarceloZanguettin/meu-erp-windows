import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposSaidaCancelada from './CamposSaidaCancelada.jsx';
import { FORM_VAZIO_SAIDA_CANCELADA, normalizarSaidaCancelada } from './camposSaidaCancelada.js';

const API = 'http://localhost:8050';

export default function NovaSaidaCanceladaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_SAIDA_CANCELADA });

  const salvar = async () => {
    const r = await fetch(`${API}/saidas-canceladas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarSaidaCancelada(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Saída Cancelada" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={700} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposSaidaCancelada form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
