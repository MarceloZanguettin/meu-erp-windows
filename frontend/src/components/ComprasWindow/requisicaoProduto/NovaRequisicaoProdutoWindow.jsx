import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposRequisicaoProduto from './CamposRequisicaoProduto.jsx';
import { FORM_VAZIO_REQUISICAO_PRODUTO, normalizarRequisicaoProduto } from './camposRequisicaoProduto.js';

const API = 'http://localhost:8050';

export default function NovaRequisicaoProdutoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_REQUISICAO_PRODUTO });

  const salvar = async () => {
    const r = await fetch(`${API}/requisicao-produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarRequisicaoProduto(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Item de Requisição de Material (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={700} altura={520} minLargura={480} minAltura={400}
      salvar={salvar}
    >
      <CamposRequisicaoProduto form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
