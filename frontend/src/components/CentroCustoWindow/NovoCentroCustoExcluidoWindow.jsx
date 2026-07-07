import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposCentroCustoExcluido from './CamposCentroCustoExcluido.jsx';
import { FORM_VAZIO_CENTRO_CUSTO_EXCLUIDO, normalizarCentroCustoExcluido } from './camposCentroCustoExcluido.js';

const API = 'http://localhost:8050';

export default function NovoCentroCustoExcluidoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_CENTRO_CUSTO_EXCLUIDO });

  const salvar = async () => {
    const r = await fetch(`${API}/centros-custo-excluidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarCentroCustoExcluido(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Centro de Custo Excluído" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={950} altura={700} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposCentroCustoExcluido form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
