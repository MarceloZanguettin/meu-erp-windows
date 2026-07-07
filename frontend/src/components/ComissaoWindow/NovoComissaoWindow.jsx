import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposComissao from './CamposComissao.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarComissao } from './services/comissaoService.js';

const API = 'http://localhost:8050';

export default function NovoComissaoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/comissoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarComissao(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Comissão" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={600} minLargura={560} minAltura={420}
      salvar={salvar}
    >
      <CamposComissao form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
