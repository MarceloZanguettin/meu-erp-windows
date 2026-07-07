import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposLancamentoContabil from './CamposLancamentoContabil.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarLancamentoContabil } from './services/lancamentoContabilService.js';

const API = 'http://localhost:8050';

export default function NovoLancamentoContabilWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/lancamentos-contabeis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarLancamentoContabil(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Lançamento Contábil" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={900} altura={680} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposLancamentoContabil form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
