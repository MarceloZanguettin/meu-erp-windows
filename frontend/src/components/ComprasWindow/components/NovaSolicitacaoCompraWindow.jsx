import React, { useState } from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import { salvarSolicitacao } from '../services/comprasService.js';
import '../ComprasWindow.css';

const FORM_VAZIO = { solicitante: '', observacao: '' };
const ITEM_VAZIO = { descricao: '', quantidade: '', unidade: '' };

export default function NovaSolicitacaoCompraWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [itens, setItens] = useState([{ ...ITEM_VAZIO }]);
  const [salvando, setSalvando] = useState(false);

  const addItem = () => setItens(prev => [...prev, { ...ITEM_VAZIO }]);
  const remItem = (i) => setItens(prev => prev.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => setItens(prev => {
    const novo = [...prev];
    novo[i] = { ...novo[i], [field]: val };
    return novo;
  });

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await salvarSolicitacao({ ...form, itens }, null);
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <JanelaBase id={id} titulo="Nova Solicitação de Compra" onClose={onClose} onMinimize={onMinimize} largura={700} altura={500} minLargura={500} minAltura={360}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="compras-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
          <div className="form-group">
            <label>Solicitante</label>
            <input value={form.solicitante} onChange={e => setForm({ ...form, solicitante: e.target.value })} placeholder="Nome do solicitante" />
          </div>
          <div className="form-group">
            <label>Observação</label>
            <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
          </div>

          <div className="compras-itens-header">
            <span>Itens da Solicitação</span>
            <button type="button" className="btn-adicionar-item" onClick={addItem}>+ Item</button>
          </div>

          <div className="compras-itens-tabela">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th style={{ width: 80 }}>Qtd</th>
                  <th style={{ width: 80 }}>Unidade</th>
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((it, i) => (
                  <tr key={i}>
                    <td><input value={it.descricao} onChange={e => setItem(i, 'descricao', e.target.value)} placeholder="Descrição do item" /></td>
                    <td><input type="number" min="0" value={it.quantidade} onChange={e => setItem(i, 'quantidade', e.target.value)} /></td>
                    <td><input value={it.unidade} onChange={e => setItem(i, 'unidade', e.target.value)} placeholder="un, kg..." /></td>
                    <td><button type="button" className="btn-remover-item" onClick={() => remItem(i)} disabled={itens.length === 1}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-actions" style={{ flexShrink: 0, borderTop: '1px solid #e2e8f0', padding: '10px 16px' }}>
          <button className="btn-cancel" onClick={onClose} disabled={salvando}>Cancelar</button>
          <button className="btn-save" onClick={handleSalvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </JanelaBase>
  );
}
