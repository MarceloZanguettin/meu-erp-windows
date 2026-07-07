import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposContaPagarExcluida from './CamposContaPagarExcluida.jsx';
import { FORM_VAZIO_CONTA_PAGAR_EXCLUIDA, normalizarContaPagarExcluida } from './camposContaPagarExcluida.js';

const API = 'http://localhost:8050';

export default function NovaContaPagarExcluidaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_CONTA_PAGAR_EXCLUIDA });

  const salvar = async () => {
    const r = await fetch(`${API}/contas-pagar-excluidas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarContaPagarExcluida(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Conta a Pagar Excluída" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={700} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposContaPagarExcluida form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
