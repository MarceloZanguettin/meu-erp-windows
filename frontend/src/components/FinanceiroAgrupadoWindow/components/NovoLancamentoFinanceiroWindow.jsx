import React, { useState, useEffect } from 'react';
import JanelaBase from '../../JanelaBase/JanelaBase.jsx';
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
  const [salvando, setSalvando] = useState(false);

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

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const body = {
        empresa_id:        Number(form.empresa_id),
        conta_bancaria_id: form.conta_bancaria_id ? Number(form.conta_bancaria_id) : null,
        descricao:         form.descricao,
        valor:             parseFloat(form.valor),
        data_vencimento:   form.data_vencimento + 'T12:00:00',
        observacao:        form.observacao || null,
      };
      await salvarLancamento(tipo, body, null);
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <JanelaBase id={id} titulo={titulo} onClose={onClose} onMinimize={onMinimize} largura={520} altura={460} minLargura={400} minAltura={360}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

        <div className="modal-actions" style={{ flexShrink: 0, borderTop: '1px solid #e2e8f0', padding: '10px 16px' }}>
          <button className="btn-cancel" onClick={onClose} disabled={salvando}>Cancelar</button>
          <button
            className={`btn-save ${tipo === 'receber' ? 'receber-save' : 'pagar-save'}`}
            onClick={handleSalvar}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </JanelaBase>
  );
}
