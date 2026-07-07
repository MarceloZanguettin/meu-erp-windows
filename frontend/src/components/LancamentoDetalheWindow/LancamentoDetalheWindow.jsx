import React, { useState, useEffect } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import {
  fetchEmpresas,
  fetchContasBancarias,
  salvarLancamento,
  excluirLancamento,
  marcarContaPago,
  marcarContaRecebido,
  estornarLancamento,
} from '../FinanceiroAgrupadoWindow/services/financeiroService';
import AbaGenusReceber from './abas/AbaGenusReceber.jsx';
import { buildGenusFormFromConta, serializeGenusForm } from './abas/genusReceberFields.js';
import AbaGenusPagar from './abas/AbaGenusPagar.jsx';
import { buildGenusPagarFormFromConta, serializeGenusPagarForm } from './abas/genusPagarFields.js';
import '../FinanceiroAgrupadoWindow/FinanceiroAgrupadoWindow.css';
import './LancamentoDetalheWindow.css';

function buildFormFromConta(conta, tipo) {
  const base = {
    empresa_id:        String(conta.empresa_id),
    conta_bancaria_id: conta.conta_bancaria_id ? String(conta.conta_bancaria_id) : '',
    descricao:         conta.descricao ?? '',
    valor:             String(conta.valor ?? ''),
    data_vencimento:   conta.data_vencimento ? conta.data_vencimento.slice(0, 10) : '',
    observacao:        conta.observacao ?? '',
  };
  // Campos migrados de GENUS.RECEBER/GENUS.PAGAR só existem/fazem sentido
  // para o respectivo tipo de lançamento
  if (tipo === 'receber') return { ...base, ...buildGenusFormFromConta(conta) };
  if (tipo === 'pagar')   return { ...base, ...buildGenusPagarFormFromConta(conta) };
  return base;
}

/** Formata ISO datetime como "dd/mm/aaaa HH:MM" ou "—" se nulo */
function fmtDT(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  const data = d.toLocaleDateString('pt-BR');
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${data} ${hora}`;
}

/**
 * Janela flutuante de detalhe/edição de um lançamento financeiro.
 *
 * Props:
 *   conta    — objeto do lançamento (contasPagar ou contasReceber)
 *   tipo     — 'pagar' | 'receber'
 *   onSalvar — callback chamado após qualquer mutação (recarrega a tabela principal)
 */
export default function LancamentoDetalheWindow({ id, onClose, onMinimize, conta, tipo, onSalvar }) {
  const [form, setForm]             = useState(() => buildFormFromConta(conta, tipo));
  const [formOriginal]              = useState(() => buildFormFromConta(conta, tipo));
  const [aba, setAba]               = useState('Dados');
  const [empresas, setEmpresas]     = useState([]);
  const [contas, setContas]         = useState([]);
  const [status, setStatus]         = useState(conta.status);
  const [postergado, setPostergado] = useState(conta.postergado ?? false);
  const [dataBaixa, setDataBaixa]   = useState(
    tipo === 'pagar' ? (conta.data_pagamento ?? null) : (conta.data_recebimento ?? null)
  );
  const [salvando, setSalvando]     = useState(false);

  useEffect(() => {
    Promise.all([fetchEmpresas(), fetchContasBancarias()]).then(([emp, cbs]) => {
      setEmpresas(emp);
      setContas(cbs);
    });
  }, []);

  const bancosDoForm = contas.filter(
    cb => !form.empresa_id || cb.empresa_id === Number(form.empresa_id),
  );

  const setField = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const dirty = JSON.stringify(form) !== JSON.stringify(formOriginal);

  const handleClose = () => {
    if (dirty && !window.confirm('Você fez alterações que não foram salvas. Deseja sair mesmo assim?')) return;
    onClose();
  };

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
        // Campos migrados de GENUS.RECEBER/GENUS.PAGAR — só enviados para o
        // respectivo tipo de lançamento
        ...(tipo === 'receber' ? serializeGenusForm(form) : {}),
        ...(tipo === 'pagar' ? serializeGenusPagarForm(form) : {}),
      };
      await salvarLancamento(tipo, body, conta.id);
      onSalvar?.();
      onClose();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = async () => {
    if (!window.confirm('Excluir este lançamento? Esta ação não pode ser desfeita.')) return;
    await excluirLancamento(tipo === 'pagar' ? 'P' : 'R', conta.id);
    onSalvar?.();
    onClose();
  };

  const handleMarcarPago = async () => {
    const res = await marcarContaPago(conta.id);
    setStatus('pago');
    setPostergado(false);
    setDataBaixa(res.data_pagamento ?? null);
    onSalvar?.();
  };

  const handleMarcarRecebido = async () => {
    const res = await marcarContaRecebido(conta.id);
    setStatus('recebido');
    setPostergado(false);
    setDataBaixa(res.data_recebimento ?? null);
    onSalvar?.();
  };

  const handleEstornar = async () => {
    await estornarLancamento(tipo === 'pagar' ? 'P' : 'R', conta.id);
    setStatus('pendente');
    setPostergado(false);  // estorno sempre volta para pendente puro — sem postergado
    setDataBaixa(null);
    onSalvar?.();
  };

  const tipoLabel  = tipo === 'receber' ? 'Receber' : 'Pagar';
  const titulo     = `Lançamento a ${tipoLabel}`;
  const isPendente = status === 'pendente';
  const isQuitado  = status === 'pago' || status === 'recebido';

  const isVencido = (() => {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const venc = new Date(form.data_vencimento + 'T00:00:00');
    return venc < hoje;
  })();

  const badgeClasse = isQuitado
    ? 'fagrup-badge badge-ok'
    : postergado
      ? 'fagrup-badge badge-postergado'
      : isVencido
        ? 'fagrup-badge badge-atrasado'
        : 'fagrup-badge badge-pend';

  const badgeLabel = isQuitado
    ? status
    : postergado
      ? 'Postergado'
      : isVencido
        ? 'Atrasado'
        : 'Pendente';

  const labelBaixa = tipo === 'pagar' ? 'Data do pagamento' : 'Data do recebimento';

  return (
    <JanelaBase
      id={id}
      titulo={titulo}
      onClose={handleClose}
      onMinimize={onMinimize}
      largura={tipo === 'receber' || tipo === 'pagar' ? 640 : 540}
      altura={tipo === 'receber' || tipo === 'pagar' ? 620 : 560}
      minLargura={420}
      minAltura={460}
    >
      <div className="detalhe-wrapper">

        {/* ── Status + ações rápidas ── */}
        <div className="detalhe-status-bar">
          <span className={badgeClasse}>{badgeLabel}</span>
          <div className="detalhe-status-actions">
            {isPendente && tipo === 'pagar' && (
              <button className="act-ok detalhe-act" onClick={handleMarcarPago}>
                ✓ Marcar pago
              </button>
            )}
            {isPendente && tipo === 'receber' && (
              <button className="act-ok detalhe-act" onClick={handleMarcarRecebido}>
                ✓ Marcar recebido
              </button>
            )}
            {isQuitado && (
              <button className="act-estornar detalhe-act" onClick={handleEstornar}>
                ↩ Estornar
              </button>
            )}
          </div>
        </div>

        {/* ── Informações somente leitura ── */}
        <div className="detalhe-info-readonly">
          <div className="detalhe-info-item">
            <span className="detalhe-info-label">Emissão</span>
            <span className="detalhe-info-value">{fmtDT(conta.criado_em)}</span>
          </div>
          <div className="detalhe-info-item">
            <span className="detalhe-info-label">{labelBaixa}</span>
            <span className="detalhe-info-value">{fmtDT(dataBaixa)}</span>
          </div>
        </div>

        {/* ── Abas (GENUS existe para contas a receber e a pagar) ── */}
        {(tipo === 'receber' || tipo === 'pagar') && (
          <div className="tabs-header">
            {['Dados', 'GENUS'].map(nomeAba => (
              <button
                key={nomeAba}
                type="button"
                className={`tab-btn ${aba === nomeAba ? 'active' : ''}`}
                onClick={() => setAba(nomeAba)}
              >
                {nomeAba}
              </button>
            ))}
          </div>
        )}

        {/* ── Formulário editável ── */}
        <div className="detalhe-form">
          {aba === 'Dados' && (
            <>
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
                  placeholder="Opcional"
                />
              </div>
            </>
          )}

          {aba === 'GENUS' && tipo === 'receber' && (
            <AbaGenusReceber form={form} setField={setField} />
          )}

          {aba === 'GENUS' && tipo === 'pagar' && (
            <AbaGenusPagar form={form} setField={setField} />
          )}
        </div>

        {/* ── Rodapé ── */}
        <div className="detalhe-footer">
          <button className="detalhe-btn-excluir" onClick={handleExcluir}>
            Excluir
          </button>
          <div className="detalhe-footer-right">
            <button className="btn-cancel" onClick={handleClose}>
              Sair
            </button>
            {dirty && (
              <button
                className={`btn-save ${tipo === 'receber' ? 'receber-save' : 'pagar-save'}`}
                onClick={handleSalvar}
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar alterações'}
              </button>
            )}
          </div>
        </div>

      </div>
    </JanelaBase>
  );
}
