import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8050';

const formatarData = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('pt-BR');
};

const formatarValor = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function AbaContasPagar({ empresas }) {
  const [contas, setContas] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ empresa_id: '', descricao: '', valor: '', data_vencimento: '', observacao: '' });

  const carregar = () => {
    axios.get(`${API}/financeiro/contas-pagar`)
      .then(r => setContas(r.data))
      .catch(() => {});
  };

  useEffect(() => { carregar(); }, []);

  const abrirAdicionar = () => {
    setEditando(null);
    setForm({ empresa_id: empresas[0]?.id ?? '', descricao: '', valor: '', data_vencimento: '', observacao: '' });
    setModal(true);
  };

  const abrirEditar = (conta) => {
    setEditando(conta.id);
    setForm({
      empresa_id: conta.empresa_id,
      descricao: conta.descricao,
      valor: conta.valor,
      data_vencimento: conta.data_vencimento.slice(0, 10),
      observacao: conta.observacao ?? ''
    });
    setModal(true);
  };

  const salvar = async () => {
    const payload = {
      ...form,
      valor: parseFloat(form.valor),
      empresa_id: parseInt(form.empresa_id),
      data_vencimento: new Date(form.data_vencimento + 'T00:00:00').toISOString()
    };
    try {
      if (editando) {
        await axios.put(`${API}/financeiro/contas-pagar/${editando}`, payload);
      } else {
        await axios.post(`${API}/financeiro/contas-pagar`, payload);
      }
      setModal(false);
      carregar();
    } catch (e) {
      alert('Erro ao salvar: ' + (e.response?.data?.detail ?? e.message));
    }
  };

  const marcarPago = async (id) => {
    await axios.patch(`${API}/financeiro/contas-pagar/${id}/pagar`);
    carregar();
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este lançamento?')) return;
    await axios.delete(`${API}/financeiro/contas-pagar/${id}`);
    carregar();
  };

  const contasDaEmpresa = (empresaId) => contas.filter(c => c.empresa_id === empresaId);

  const totalEmpresa = (empresaId) =>
    contasDaEmpresa(empresaId)
      .filter(c => c.status === 'pendente')
      .reduce((s, c) => s + c.valor, 0);

  return (
    <div className="fluxo-aba">
      <div className="fluxo-aba-toolbar">
        <button className="fluxo-btn-add" onClick={abrirAdicionar}>+ Adicionar</button>
      </div>

      <div className="fluxo-tabelas-lado">
        {empresas.map(emp => (
          <div key={emp.id} className="fluxo-empresa-col">
            <div className="fluxo-empresa-titulo pagar">{emp.nome}</div>
            <table className="fluxo-table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {contasDaEmpresa(emp.id).length === 0 && (
                  <tr><td colSpan={5} className="fluxo-vazio">Nenhum lançamento</td></tr>
                )}
                {contasDaEmpresa(emp.id).map(c => (
                  <tr key={c.id} className={c.status === 'pago' ? 'fluxo-row-pago' : 'fluxo-row-pend-pagar'}>
                    <td>{c.descricao}</td>
                    <td>{formatarValor(c.valor)}</td>
                    <td>{formatarData(c.data_vencimento)}</td>
                    <td>
                      <span className={`fluxo-badge ${c.status === 'pago' ? 'badge-pago' : 'badge-pend-pagar'}`}>
                        {c.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="fluxo-acoes">
                      {c.status === 'pendente' && (
                        <button className="fluxo-btn-acao ok" title="Marcar como pago" onClick={() => marcarPago(c.id)}>✓</button>
                      )}
                      <button className="fluxo-btn-acao edit" title="Editar" onClick={() => abrirEditar(c)}>✎</button>
                      <button className="fluxo-btn-acao del" title="Excluir" onClick={() => excluir(c.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="fluxo-total">
              Pendente: <strong>{formatarValor(totalEmpresa(emp.id))}</strong>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fluxo-modal-overlay">
          <div className="fluxo-modal">
            <div className="fluxo-modal-header">
              {editando ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
            </div>
            <div className="fluxo-modal-body">
              <label>Empresa</label>
              <select value={form.empresa_id} onChange={e => setForm({ ...form, empresa_id: e.target.value })}>
                {empresas.map(emp => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
              </select>
              <label>Descrição</label>
              <input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
              <label>Valor (R$)</label>
              <input type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
              <label>Vencimento</label>
              <input type="date" value={form.data_vencimento} onChange={e => setForm({ ...form, data_vencimento: e.target.value })} />
              <label>Observação</label>
              <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
            </div>
            <div className="fluxo-modal-footer">
              <button className="btn-cancel" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn-save" onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
