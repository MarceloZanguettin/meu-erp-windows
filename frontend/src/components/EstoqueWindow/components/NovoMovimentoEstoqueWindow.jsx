import React, { useState, useEffect } from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
import { registrarMovimento, fetchProdutos, fetchDepositos } from '../services/estoqueService.js';
import '../EstoqueWindow.css';

const FORM_VAZIO = {
  produto_id: '',
  produto_nome: '',
  deposito_id: '',
  tipo: 'entrada',
  quantidade: '',
  custo_unitario: '',
  documento_ref: '',
  observacao: '',
};

export default function NovoMovimentoEstoqueWindow({ id, onClose, onMinimize, onSalvar }) {
  const [form, setForm] = useState({ ...FORM_VAZIO });
  const [produtos, setProdutos] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    Promise.all([fetchProdutos(), fetchDepositos()]).then(([p, d]) => {
      setProdutos(p);
      setDepositos(d);
    }).catch(console.error);
  }, []);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const payload = {
        ...form,
        produto_id: form.produto_id ? parseInt(form.produto_id) : null,
        deposito_id: form.deposito_id ? parseInt(form.deposito_id) : null,
        quantidade: parseFloat(form.quantidade),
        custo_unitario: form.custo_unitario !== '' ? parseFloat(form.custo_unitario) : null,
      };
      await registrarMovimento(payload);
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro ao lançar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <JanelaBase id={id} titulo="Lançar Movimento de Estoque" onClose={onClose} onMinimize={onMinimize} largura={520} altura={520} minLargura={400} minAltura={380}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="estoque-modal-body" style={{ flex: 1, maxHeight: 'none', overflowY: 'auto' }}>
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

        <div className="modal-actions" style={{ flexShrink: 0, borderTop: '1px solid #e2e8f0', padding: '10px 16px' }}>
          <button className="btn-cancel" onClick={onClose} disabled={salvando}>Cancelar</button>
          <button className="btn-save" onClick={handleSalvar} disabled={salvando}>
            {salvando ? 'Lançando...' : 'Lançar'}
          </button>
        </div>
      </div>
    </JanelaBase>
  );
}
