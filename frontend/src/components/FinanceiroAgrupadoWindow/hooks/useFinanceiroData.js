import { useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchEmpresas,
  fetchContasBancarias,
  fetchLancamentosIntervalo,
  fetchSaldosDiarios,
  salvarLancamento,
  marcarContaPago,
  marcarContaRecebido,
  estornarLancamento,
  excluirLancamento,
} from '../services/financeiroService';
import { FORM_VAZIO } from '../constants';

/**
 * Hook Controller — gerencia o estado de dados do Financeiro Agrupado.
 *
 * Responsabilidades:
 *  - Carregar empresas e contas bancárias (dados estáticos)
 *  - Manter o state dos lançamentos (fonte única de verdade)
 *  - Expor ações CRUD (salvar, marcarPago, marcarRecebido, excluir)
 *  - Controlar o modal de criação/edição
 *
 * As refs do intervalo visível (loadedInicioRef, loadedFimRef) são injetadas
 * via bindScrollRefs() pelo orquestrador (index.jsx) após o hook de scroll
 * ser inicializado, garantindo que recarregar() busque só o trecho visível.
 */
export function useFinanceiroData() {
  const [empresas,        setEmpresas]        = useState([]);
  const [contasBancarias, setContasBancarias] = useState([]);
  const [contasPagar,     setContasPagar]     = useState([]);
  const [contasReceber,   setContasReceber]   = useState([]);
  const [saldosDiarios,   setSaldosDiarios]   = useState([]);

  // Modal
  const [modalTipo,  setModalTipo]  = useState(null); // 'pagar' | 'receber' | null
  const [editandoId, setEditandoId] = useState(null);
  const [form,       setForm]       = useState(FORM_VAZIO);

  // Refs do intervalo visível — preenchidas externamente via bindScrollRefs()
  const loadedInicioRef = useRef(null);
  const loadedFimRef    = useRef(null);

  /**
   * Chamado pelo orquestrador para conectar as refs de intervalo do scroll.
   * Deve ser chamado em cada render (refs são estáveis, sem custo).
   */
  const bindScrollRefs = useCallback((inicioRef, fimRef) => {
    loadedInicioRef.current = inicioRef.current;
    loadedFimRef.current    = fimRef.current;
    // Guarda referência ao objeto ref (não ao valor) para uso em callbacks
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.defineProperty(loadedInicioRef, 'current', {
      get: () => inicioRef.current,
      set: (v) => { inicioRef.current = v; },
      configurable: true,
    });
    Object.defineProperty(loadedFimRef, 'current', {
      get: () => fimRef.current,
      set: (v) => { fimRef.current = v; },
      configurable: true,
    });
  }, []);

  // ── Dados estáticos (uma vez) ─────────────────────────────────────────────
  useEffect(() => {
    fetchEmpresas().then(setEmpresas);
    fetchContasBancarias().then(setContasBancarias);
  }, []);

  // ── Recarrega apenas o intervalo visível (pós-mutações) ──────────────────
  const recarregar = useCallback(async () => {
    if (!loadedInicioRef.current || !loadedFimRef.current) return;
    const inicio = loadedInicioRef.current;
    const fim    = loadedFimRef.current;
    const { pagar, receber } = await fetchLancamentosIntervalo(inicio, fim);
    setContasPagar(pagar);
    setContasReceber(receber);
    fetchSaldosDiarios(inicio, fim)
      .then(setSaldosDiarios)
      .catch(() => {});
  }, []);

  // ── Ações do modal ────────────────────────────────────────────────────────
  const abrirAdicionar = useCallback((tipo, empresaId) => {
    setEditandoId(null);
    setModalTipo(tipo);
    setForm({ ...FORM_VAZIO, empresa_id: String(empresaId) });
  }, []);

  const abrirEditar = useCallback((tipo, conta) => {
    setEditandoId(conta.id);
    setModalTipo(tipo);
    setForm({
      empresa_id:        String(conta.empresa_id),
      conta_bancaria_id: conta.conta_bancaria_id ? String(conta.conta_bancaria_id) : '',
      descricao:         conta.descricao,
      valor:             String(conta.valor),
      data_vencimento:   conta.data_vencimento ? conta.data_vencimento.slice(0, 10) : '',
      observacao:        conta.observacao || '',
    });
  }, []);

  const fecharModal = useCallback(() => setModalTipo(null), []);

  const salvar = useCallback(async () => {
    const body = {
      empresa_id:        Number(form.empresa_id),
      conta_bancaria_id: form.conta_bancaria_id ? Number(form.conta_bancaria_id) : null,
      descricao:         form.descricao,
      valor:             parseFloat(form.valor),
      data_vencimento:   form.data_vencimento + 'T12:00:00',
      observacao:        form.observacao || null,
    };
    await salvarLancamento(modalTipo, body, editandoId);
    setModalTipo(null);
    recarregar();
  }, [form, modalTipo, editandoId, recarregar]);

  // ── Ações de baixa e exclusão ─────────────────────────────────────────────
  const marcarPago = useCallback(async (id) => {
    await marcarContaPago(id);
    recarregar();
  }, [recarregar]);

  const marcarRecebido = useCallback(async (id) => {
    await marcarContaRecebido(id);
    recarregar();
  }, [recarregar]);

  const estornar = useCallback(async (tipo, id) => {
    await estornarLancamento(tipo, id);
    recarregar();
  }, [recarregar]);

  const excluir = useCallback(async (tipo, id) => {
    if (!confirm('Excluir este lançamento?')) return;
    await excluirLancamento(tipo, id);
    recarregar();
  }, [recarregar]);

  // ── Bancos filtrados pela empresa selecionada no formulário ───────────────
  const bancosDoForm = contasBancarias.filter(
    cb => !form.empresa_id || cb.empresa_id === Number(form.empresa_id),
  );

  return {
    // Estado (fonte única de verdade para lançamentos)
    empresas,
    contasBancarias,
    contasPagar,
    contasReceber,
    saldosDiarios,
    setContasPagar,
    setContasReceber,
    setSaldosDiarios,
    // Conexão com scroll
    bindScrollRefs,
    // Modal
    modalTipo,
    editandoId,
    form,
    setForm,
    bancosDoForm,
    // Ações
    abrirAdicionar,
    abrirEditar,
    fecharModal,
    salvar,
    marcarPago,
    marcarRecebido,
    estornar,
    excluir,
    recarregar,
  };
}
