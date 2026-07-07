import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposSaidaExcluida from './CamposSaidaExcluida.jsx';
import { FORM_VAZIO_SAIDA_EXCLUIDA, normalizarSaidaExcluida } from './camposSaidaExcluida.js';

const API = 'http://localhost:8050';

export default function NovaSaidaExcluidaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_SAIDA_EXCLUIDA });

  const salvar = async () => {
    const r = await fetch(`${API}/saidas-excluidas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarSaidaExcluida(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Saída Excluída" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={700} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposSaidaExcluida form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
