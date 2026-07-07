import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposCentroCusto from './CamposCentroCusto.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarCentroCusto } from './services/centroCustoService.js';

const API = 'http://localhost:8050';

export default function NovoCentroCustoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/cadastros/centros-custo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarCentroCusto(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Centro de Custo" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={900} altura={680} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposCentroCusto form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
