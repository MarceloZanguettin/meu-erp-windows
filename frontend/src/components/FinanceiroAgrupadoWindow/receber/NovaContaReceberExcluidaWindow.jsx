import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposContaReceberExcluida from './CamposContaReceberExcluida.jsx';
import { FORM_VAZIO_CONTA_RECEBER_EXCLUIDA, normalizarContaReceberExcluida } from './camposContaReceberExcluida.js';

const API = 'http://localhost:8050';

export default function NovaContaReceberExcluidaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_CONTA_RECEBER_EXCLUIDA });

  const salvar = async () => {
    const r = await fetch(`${API}/contas-receber-excluidas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarContaReceberExcluida(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Conta a Receber Excluída" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={700} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposContaReceberExcluida form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
