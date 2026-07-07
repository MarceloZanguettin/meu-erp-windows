import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposMovimentoFixo from './CamposMovimentoFixo.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarMovimentoFixo } from './services/movimentoFixoService.js';

const API = 'http://localhost:8050';

export default function NovoMovimentoFixoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/movimentos-fixos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarMovimentoFixo(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Movimento Fixo" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={680} altura={520} minLargura={520} minAltura={380}
      salvar={salvar}
    >
      <CamposMovimentoFixo form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
