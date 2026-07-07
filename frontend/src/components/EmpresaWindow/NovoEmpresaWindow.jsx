import { useState } from 'react';
import CadastroFormWindow from '../shared/CadastroFormWindow.jsx';
import CamposEmpresa from './CamposEmpresa.jsx';
import { FORM_VAZIO } from './constants.js';
import { normalizarEmpresa } from './services/empresaService.js';

const API = 'http://localhost:8050';

export default function NovoEmpresaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });

  const salvar = async () => {
    const r = await fetch(`${API}/financeiro/empresas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarEmpresa(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Empresa" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={900} altura={680} minLargura={640} minAltura={460}
      salvar={salvar}
    >
      <CamposEmpresa form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
