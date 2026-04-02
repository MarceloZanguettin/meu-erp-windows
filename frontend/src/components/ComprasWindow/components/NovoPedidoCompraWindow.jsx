import React, { useState, useEffect, useMemo } from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import { salvarPedido, fetchFornecedores, fetchFormasPagamento } from '../services/comprasService.js';
import '../ComprasWindow.css';

const FORM_VAZIO = { fornecedor_id: '', data_entrega_prevista: '', forma_pagamento_id: '', observacao: '' };
const ITEM_VAZIO = { descricao: '', quantidade: '', preco_unitario: '', unidade: '' };

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function NovoPedidoCompraWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [itens, setItens] = useState([{ ...ITEM_VAZIO }]);
  const [fornecedores, setFornecedores] = useState([]);
  const [formasPag, setFormasPag] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    Promise.all([fetchFornecedores(), fetchFormasPagamento()]).then(([f, fp]) => {
      setFornecedores(f);
      setFormasPag(fp);
    }).catch(console.error);
  }, []);

  const addItem = () => setItens(prev => [...prev, { ...ITEM_VAZIO }]);
  const remItem = (i) => setItens(prev => prev.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => setItens(prev => {
    const novo = [...prev];
    novo[i] = { ...novo[i], [field]: val };
    return novo;
  });

  const total = useMemo(() =>
    itens.reduce((s, it) => s + (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0), 0),
    [itens]
  );

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const payload = {
        ...form,
        fornecedor_id: form.fornecedor_id ? parseInt(form.fornecedor_id) : null,
        forma_pagamento_id: form.forma_pagamento_id ? parseInt(form.forma_pagamento_id) : null,
        itens: itens.map(it => ({
          ...it,
          quantidade: parseFloat(it.quantidade) || 0,
          preco_unitario: parseFloat(it.preco_unitario) || 0,
        })),
      };
      await salvarPedido(payload, null);
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <JanelaBase id={id} titulo="Novo Pedido de Compra" onClose={onClose} onMinimize={onMinimize} largura={950} altura={580} minLargura={640} minAltura={420}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="compras-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Fornecedor</label>
              <select value={form.fornecedor_id} onChange={e => setForm({ ...form, fornecedor_id: e.target.value })}>
                <option value="">Selecione...</option>
                {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Entrega Prevista</label>
              <input type="date" value={form.data_entrega_prevista} onChange={e => setForm({ ...form, data_entrega_prevista: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Forma de Pagamento</label>
              <select value={form.forma_pagamento_id} onChange={e => setForm({ ...form, forma_pagamento_id: e.target.value })}>
                <option value="">Selecione...</option>
                {formasPag.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Observação</label>
              <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
            </div>
          </div>

          <div className="compras-itens-header">
            <span>Itens do Pedido</span>
            <button type="button" className="btn-adicionar-item" onClick={addItem}>+ Item</button>
          </div>

          <div className="compras-itens-tabela">
            <table>
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th style={{ width: 70 }}>Qtd</th>
                  <th style={{ width: 70 }}>Unidade</th>
                  <th style={{ width: 110 }}>Preço Un.</th>
                  <th style={{ width: 110 }}>Subtotal</th>
                  <th style={{ width: 32 }}></th>
                </tr>
              </thead>
              <tbody>
                {itens.map((it, i) => {
                  const sub = (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0);
                  return (
                    <tr key={i}>
                      <td><input value={it.descricao} onChange={e => setItem(i, 'descricao', e.target.value)} placeholder="Descrição" /></td>
                      <td><input type="number" min="0" value={it.quantidade} onChange={e => setItem(i, 'quantidade', e.target.value)} /></td>
                      <td><input value={it.unidade} onChange={e => setItem(i, 'unidade', e.target.value)} placeholder="un, kg..." /></td>
                      <td><input type="number" step="0.01" min="0" value={it.preco_unitario} onChange={e => setItem(i, 'preco_unitario', e.target.value)} /></td>
                      <td className="compras-subtotal">{fmtMoeda(sub)}</td>
                      <td><button type="button" className="btn-remover-item" onClick={() => remItem(i)} disabled={itens.length === 1}>✕</button></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="compras-total-label">Total</td>
                  <td className="compras-total-valor">{fmtMoeda(total)}</td>
                  <td></td>
                </tr>
              </tfoot>
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
