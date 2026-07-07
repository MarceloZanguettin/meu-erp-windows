import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposRequisicaoMateria from './CamposRequisicaoMateria.jsx';
import { FORM_VAZIO_REQUISICAO_MATERIA, normalizarRequisicaoMateria } from './camposRequisicaoMateria.js';

const API = 'http://localhost:8050';

export default function NovaRequisicaoMateriaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_REQUISICAO_MATERIA });

  const salvar = async () => {
    const r = await fetch(`${API}/requisicao-materia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarRequisicaoMateria(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Requisição de Material (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={850} altura={640} minLargura={600} minAltura={420}
      salvar={salvar}
    >
      <CamposRequisicaoMateria form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
