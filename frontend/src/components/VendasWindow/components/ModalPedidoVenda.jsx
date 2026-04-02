import React, { useMemo } from 'react';
import Portal from '../../shared/Portal.jsx';

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ModalPedidoVenda({ editandoId, form, setForm, itens, setItens, formasPag, representantes, onSalvar, onFechar, ITEM_VAZIO }) {
  const addItem = () => setItens([...itens, { ...ITEM_VAZIO }]);
  const remItem = (i) => setItens(itens.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => {
    const novo = [...itens];
    novo[i] = { ...novo[i], [field]: val };
    setItens(novo);
  };

  const subtotal = useMemo(() =>
    itens.reduce((s, it) => s + (parseFloat(it.quantidade) || 0) * (parseFloat(it.preco_unitario) || 0), 0),
    [itens]
  );
  const desconto = (parseFloat(form.desconto_percentual) || 0) / 100;
  const total = subtotal * (1 - desconto);

  return (
    <Portal>
      <div className="modal-overlay">
      <div className="modal-content vendas-modal vendas-modal-lg">
        <div className="modal-header">
          <strong>{editandoId ? 'Editar Pedido de Venda' : 'Novo Pedido de Venda'}</strong>
        </div>
        <div className="modal-body vendas-modal-body">
          <div className="form-grid-3">
            <div className="form-group form-group-full">
              <label>Cliente</label>
              <input value={form.nome_cliente} onChange={e => setForm({ ...form, nome_cliente: e.target.value })} placeholder="Nome do cliente" />
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
              <label>Representante</label>
              <select value={form.representante_id} onChange={e => setForm({ ...form, representante_id: e.target.value })}>
                <option value="">Nenhum</option>
                {representantes.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
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
            <span>Itens do Pedido</span>
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
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save" onClick={onSalvar}>Salvar</button>
        </div>
      </div>
      </div>
    </Portal>
  );
}
