import { useState } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import CamposAuditoriaPrePedido from './CamposAuditoriaPrePedido.jsx';
import { FORM_VAZIO_AUDITORIA_PRE_PEDIDO, normalizarAuditoriaPrePedido } from './camposAuditoriaPrePedido.js';

const API = 'http://localhost:8050';

export default function NovaAuditoriaPrePedidoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO_AUDITORIA_PRE_PEDIDO });

  const salvar = async () => {
    const r = await fetch(`${API}/auditorias-pre-pedido`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizarAuditoriaPrePedido(form)),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro ao salvar');
    }
  };

  return (
    <CadastroFormWindow
      id={id} titulo="Nova Auditoria de Pré-Pedido" onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={800} altura={620} minLargura={560} minAltura={420}
      salvar={salvar}
    >
      <CamposAuditoriaPrePedido form={form} setForm={setForm} />
    </CadastroFormWindow>
  );
}
