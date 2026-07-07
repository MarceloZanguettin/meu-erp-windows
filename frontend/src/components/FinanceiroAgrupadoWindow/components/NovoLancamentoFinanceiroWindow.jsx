import React, { useState, useEffect } from 'react';
import CadastroFormWindow from '../../shared/CadastroFormWindow.jsx';
import { fetchEmpresas, fetchContasBancarias, salvarLancamento } from '../services/financeiroService';
import '../FinanceiroAgrupadoWindow.css';

/**
 * Janela flutuante para criar um novo lançamento financeiro (a pagar ou a receber).
 *
 * Props:
 *   tipo            - 'pagar' | 'receber'
 *   empresaIdInicial - string com o ID da empresa pré-selecionada
 *   onSalvar        - callback para recarregar os dados na janela principal
 */
export default function NovoLancamentoFinanceiroWindow({ id, onClose, onMinimize, tipo, empresaIdInicial, onSalvar }) {
  const [form, setForm] = useState({
    empresa_id:        empresaIdInicial || '',
    conta_bancaria_id: '',
    descricao:         '',
    valor:             '',
    data_vencimento:   '',
    observacao:        '',
  });
  const [empresas, setEmpresas] = useState([]);
  const [contasBancarias, setContasBancarias] = useState([]);

  useEffect(() => {
    Promise.all([fetchEmpresas(), fetchContasBancarias()]).then(([emp, cbs]) => {
      setEmpresas(emp);
      setContasBancarias(cbs);
    }).catch(console.error);
  }, []);

  const bancosDoForm = contasBancarias.filter(
    cb => !form.empresa_id || cb.empresa_id === Number(form.empresa_id)
  );

  const titulo = `Novo Lançamento a ${tipo === 'receber' ? 'Receber' : 'Pagar'}`;

  const salvar = async () => {
    const body = {
      empresa_id:        Number(form.empresa_id),
      conta_bancaria_id: form.conta_bancaria_id ? Number(form.conta_bancaria_id) : null,
      descricao:         form.descricao,
      valor:             parseFloat(form.valor),
      data_vencimento:   form.data_vencimento + 'T12:00:00',
      observacao:        form.observacao || null,
    };
    await salvarLancamento(tipo, body, null);
  };

  return (
    <CadastroFormWindow
      id={id} titulo={titulo} onClose={onClose} onMinimize={onMinimize} onSalvar={onSalvar}
      largura={520} altura={460} minLargura={400} minAltura={360}
      salvar={salvar}
      saveButtonClassName={tipo === 'receber' ? 'receber-save' : 'pagar-save'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="fagrup-form-group">
          <label>Empresa</label>
          <select
            value={form.empresa_id}
            onChange={e => setForm({ ...form, empresa_id: e.target.value, conta_bancaria_id: '' })}
          >
            <option value="">Selecione</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>

        <div className="fagrup-form-group">
          <label>Conta Bancária</label>
          <select
            value={form.conta_bancaria_id}
            onChange={e => setForm({ ...form, conta_bancaria_id: e.target.value })}
          >
            <option value="">Selecione</option>
            {bancosDoForm.map(cb => <option key={cb.id} value={cb.id}>{cb.banco}</option>)}
          </select>
        </div>

        <div className="fagrup-form-group">
          <label>Descrição</label>
          <input
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
          />
        </div>

        <div className="fagrup-form-row">
          <div className="fagrup-form-group">
            <label>Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.valor}
              onChange={e => setForm({ ...form, valor: e.target.value })}
            />
          </div>
          <div className="fagrup-form-group">
            <label>Vencimento</label>
            <input
              type="date"
              value={form.data_vencimento}
              onChange={e => setForm({ ...form, data_vencimento: e.target.value })}
            />
          </div>
        </div>

        <div className="fagrup-form-group">
          <label>Observação</label>
          <input
            value={form.observacao}
            onChange={e => setForm({ ...form, observacao: e.target.value })}
          />
        </div>
      </div>
    </CadastroFormWindow>
  );
}
