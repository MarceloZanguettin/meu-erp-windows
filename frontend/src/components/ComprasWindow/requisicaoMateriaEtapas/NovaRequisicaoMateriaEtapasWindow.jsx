import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposRequisicaoMateriaEtapas from './CamposRequisicaoMateriaEtapas.jsx';
import { FORM_VAZIO_REQUISICAO_MATERIA_ETAPAS, normalizarRequisicaoMateriaEtapas } from './camposRequisicaoMateriaEtapas.js';

const API = 'http://localhost:8050';

export default function NovaRequisicaoMateriaEtapasWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_REQUISICAO_MATERIA_ETAPAS });

  const salvar = async () => {
    const r = await fetch(`${API}/requisicao-materia-etapas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarRequisicaoMateriaEtapas(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Etapa de Requisição de Material (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={600} altura={460} minLargura={420} minAltura={360}
      salvar={salvar}
    >
      <CamposRequisicaoMateriaEtapas form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
