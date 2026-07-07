import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposCotacaoPreco from './CamposCotacaoPreco.jsx';
import { FORM_VAZIO_COTACAO_PRECO, normalizarCotacaoPreco } from './camposCotacaoPreco.js';

const API = 'http://localhost:8050';

export default function NovaCotacaoPrecoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_COTACAO_PRECO });

  const salvar = async () => {
    const r = await fetch(`${API}/cotacao-preco`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarCotacaoPreco(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Cotação de Preço (GENUS)" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={850} altura={620} minLargura={600} minAltura={420}
      salvar={salvar}
    >
      <CamposCotacaoPreco form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
