import React, { useState, useEffect, useMemo } from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import { salvarOrcamento, fetchFormasPagamento } from '../services/vendasService.js';
import '../VendasWindow.css';

const FORM_VAZIO = { nome_cliente: '', data_validade: '', forma_pagamento_id: '', desconto_percentual: '0', observacao: '' };
const ITEM_VAZIO = { descricao: '', quantidade: '', preco_unitario: '', unidade: '' };

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function NovoOrcamentoWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [itens, setItens] = useState([{ ...ITEM_VAZIO }]);
  const [formasPag, setFormasPag] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetchFormasPagamento().then(setFormasPag).catch(console.error);
  }, []);

  const addItem = () => setItens(prev => [...prev, { ...ITEM_VAZIO }]);
  const remItem = (i) => setItens(prev => prev.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => setItens(prev => {
    const novo = [...prev];
    novo[i] = { ...novo[i], [field]: val };
    return novo;
  });

  const subtotal = useMemo(() =>
    itens.reduce((s, it) => s + (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0), 0),
    [itens]
  );
  const desconto = (parseFloat(form.desconto_percentual) || 0) / 100;
  const total = subtotal * (1 - desconto);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const payload = {
        ...form,
        forma_pagamento_id: form.forma_pagamento_id ? parseInt(form.forma_pagamento_id) : null,
        desconto_percentual: parseFloat(form.desconto_percentual) || 0,
        itens: itens.map(it => ({
          ...it,
          quantidade: parseFloat(it.quantidade) || 0,
          preco_unitario: parseFloat(it.preco_unitario) || 0,
        })),
      };
      await salvarOrcamento(payload, null);
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <JanelaBase id={id} titulo="Novo Orçamento" onClose={onClose} onMinimize={onMinimize} largura={900} altura={580} minLargura={600} minAltura={400}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="vendas-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Cliente</label>
              <input value={form.nome_cliente} onChange={e => setForm({ ...form, nome_cliente: e.target.value })} placeholder="Nome do cliente" />
            </div>
            <div className="form-group">
              <label>Validade</label>
              <input type="date" value={form.data_validade} onChange={e => setForm({ ...form, data_validade: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Forma de Pagamento</label>
              <select value={form.forma_pagamento_id} onChange={e => setForm({ ...form, forma_pagamento_id: e.target.value })}>
                <option value="">Selecione...</option>
                {formasPag.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Desconto (%)</label>
              <input type="number" step="0.01" min="0" max="100" value={form.desconto_percentual} onChange={e => setForm({ ...form, desconto_percentual: e.target.value })} />
            </div>
            <div className="form-group form-group-full">
              <label>Observação</label>
              <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
            </div>
          </div>

          <div className="vendas-itens-header">
            <span>Itens do Orçamento</span>
            <button type="button" className="btn-adicionar-item" onClick={addItem}>+ Item</button>
          </div>

          <div className="vendas-itens-tabela">
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
                      <td className="vendas-subtotal">{fmtMoeda(sub)}</td>
                      <td><button type="button" className="btn-remover-item" onClick={() => remItem(i)} disabled={itens.length === 1}>✕</button></td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                {desconto > 0 && (
                  <>
                    <tr>
                      <td colSpan={4} className="vendas-total-label">Subtotal</td>
                      <td className="vendas-subtotal-valor">{fmtMoeda(subtotal)}</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="vendas-total-label">Desconto ({form.desconto_percentual}%)</td>
                      <td className="vendas-desconto-valor">-{fmtMoeda(subtotal * desconto)}</td>
                      <td></td>
                    </tr>
                  </>
                )}
                <tr>
                  <td colSpan={4} className="vendas-total-label">Total</td>
                  <td className="vendas-total-valor">{fmtMoeda(total)}</td>
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
