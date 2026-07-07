import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposNotaDestinada from './CamposNotaDestinada.jsx';
import { FORM_VAZIO_NOTA_DESTINADA, normalizarNotaDestinada } from './camposNotaDestinada.js';

const API = 'http://localhost:8050';

/**
 * Janela de criação de uma Nota Destinada (GENUS.NOTASDESTINADAS — manifesto
 * do destinatário / NF-e recebida de terceiros). Segue o mesmo padrão
 * "+Novo X" já usado em ComprasWindow/entrada/NovaEntradaWindow.jsx, apenas
 * trocando os campos específicos.
 */
export default function NovaNotaDestinadaWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_NOTA_DESTINADA });

  const salvar = async () => {
    const r = await fetch(`${API}/notas-destinadas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarNotaDestinada(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Nota Destinada" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={900} altura={680} minLargura={620} minAltura={440}
      salvar={salvar}
    >
      <CamposNotaDestinada form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
