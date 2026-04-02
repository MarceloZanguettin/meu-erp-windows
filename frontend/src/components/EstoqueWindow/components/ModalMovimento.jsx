import React from 'react';
import Portal from '../../shared/Portal.jsx';

export default function ModalMovimento({ form, setForm, produtos, depositos, onSalvar, onFechar }) {
  return (
    <Portal>
      <div className="modal-overlay">
      <div className="modal-content estoque-modal">
        <div className="modal-header">
          <strong>Lançar Movimento de Estoque</strong>
        </div>
        <div className="modal-body estoque-modal-body">
          <div className="form-group">
            <label>Tipo *</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
              <option value="ajuste">Ajuste</option>
            </select>
          </div>

          {produtos.length > 0 ? (
            <div className="form-group">
              <label>Produto *</label>
              <select
                value={form.produto_id}
                onChange={e => {
                  const p = produtos.find(x => String(x.id) === e.target.value);
                  setForm({ ...form, produto_id: e.target.value, produto_nome: p?.nome || '' });
                }}
              >
                <option value="">Selecione...</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Nome do Produto</label>
                <input value={form.produto_nome} onChange={e => setForm({ ...form, produto_nome: e.target.value })} placeholder="Nome do produto" />
              </div>
              <div className="form-group">
                <label>ID do Produto (opcional)</label>
                <input type="number" value={form.produto_id} onChange={e => setForm({ ...form, produto_id: e.target.value })} />
              </div>
            </>
          )}

          {depositos.length > 0 && (
            <div className="form-group">
              <label>Depósito</label>
              <select value={form.deposito_id} onChange={e => setForm({ ...form, deposito_id: e.target.value })}>
                <option value="">Selecione...</option>
                {depositos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Quantidade *</label>
            <input type="number" step="0.001" min="0" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Custo Unitário (R$)</label>
            <input type="number" step="0.01" min="0" value={form.custo_unitario} onChange={e => setForm({ ...form, custo_unitario: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Documento / Referência</label>
            <input value={form.documento_ref} onChange={e => setForm({ ...form, documento_ref: e.target.value })} placeholder="Nota fiscal, ordem, etc." />
          </div>

          <div className="form-group">
            <label>Observação</label>
            <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onFechar}>Cancelar</button>
          <button className="btn-save" onClick={onSalvar}>Lançar</button>
        </div>
      </div>
      </div>
    </Portal>
  );
}
