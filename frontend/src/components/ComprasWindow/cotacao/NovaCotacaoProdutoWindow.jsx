import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposCotacaoProduto from './CamposCotacaoProduto.jsx';
import { FORM_VAZIO_COTACAO_PRODUTO, normalizarCotacaoProduto } from './camposCotacaoProduto.js';

const API = 'http://localhost:8050';

export default function NovaCotacaoProdutoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_COTACAO_PRODUTO });

  const salvar = async () => {
    const r = await fetch(`${API}/cotacao-produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarCotacaoProduto(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Novo Produto de Cotação (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={700} altura={480} minLargura={500} minAltura={360}
      salvar={salvar}
    >
      <CamposCotacaoProduto form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
