import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { fetchLancamentosIntervalo, fetchSaldosDiarios } from '../services/financeiroService';
import { todayStr, addDays } from '../utils/dateUtils';
import { INIT_DAYS_PAST, INIT_DAYS_FUTURE, LOAD_DAYS, SCROLL_THRESHOLD_PX } from '../constants';

/**
 * Hook Controller — gerencia o scroll infinito bidirecional do Financeiro Agrupado.
 *
 * Expõe:
 *  - tableWrapRef         ref para o elemento scrollável (deve ser colocado no div da tabela)
 *  - loadingPast/Future   indicadores de loading
 *  - hasMorePast/Future   indicadores de fim dos dados
 *  - loadedInicio/Fim     intervalo atual carregado
 *  - loadedInicioRef/FimRef  refs estáveis do intervalo (para outros hooks)
 *  - today                data de hoje (estável)
 *  - onDadosCarregados    callback a ser chamado pelo componente pai quando os dados chegam
 */
export function useScrollInfinito({ setContasPagar, setContasReceber, setSaldosDiarios }) {
  const today = useRef(todayStr()).current;

  // Intervalo já carregado — cobre todo o histórico para trás e 30 dias para frente
  const [loadedInicio, setLoadedInicio] = useState(addDays(today, -INIT_DAYS_PAST));
  const [loadedFim,    setLoadedFim]    = useState(addDays(today,  INIT_DAYS_FUTURE));
  const loadedInicioRef = useRef(addDays(today, -INIT_DAYS_PAST));
  const loadedFimRef    = useRef(addDays(today,  INIT_DAYS_FUTURE));

  useEffect(() => { loadedInicioRef.current = loadedInicio; }, [loadedInicio]);
  useEffect(() => { loadedFimRef.current    = loadedFim;    }, [loadedFim]);

  // Loading e disponibilidade
  const [loadingPast,   setLoadingPast]   = useState(false);
  const [loadingFuture, setLoadingFuture] = useState(false);
  const [hasMorePast,   setHasMorePast]   = useState(true);
  const [hasMoreFuture, setHasMoreFuture] = useState(true);

  // Guard ref evita disparos duplos (não é gerenciado pelo React)
  const guardRef = useRef({
    loadingPast:   false,
    loadingFuture: false,
    hasMorePast:   true,
    hasMoreFuture: true,
  });

  // Refs para restauração de scroll após prepend
  const tableWrapRef        = useRef(null);
  const isPrependingRef     = useRef(false);
  const prevScrollHeightRef = useRef(0);

  // Controla o scroll inicial para "hoje"
  const initialScrollDoneRef = useRef(false);

  // ── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    const ini = loadedInicioRef.current;
    const fim = loadedFimRef.current;
    fetchLancamentosIntervalo(ini, fim).then(({ pagar, receber }) => {
      setContasPagar(pagar);
      setContasReceber(receber);
    });
    if (setSaldosDiarios) {
      fetchSaldosDiarios(ini, fim)
        .then(saldos => setSaldosDiarios(saldos))
        .catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Restaura scrollTop após prepend (antes do paint) ────────────────────
  useLayoutEffect(() => {
    if (isPrependingRef.current && tableWrapRef.current) {
      const delta = tableWrapRef.current.scrollHeight - prevScrollHeightRef.current;
      if (delta > 0) tableWrapRef.current.scrollTop += delta;
      isPrependingRef.current = false;
    }
  });

  // ── Scroll inicial para a linha de hoje ──────────────────────────────────
  const scrollParaHoje = useCallback((contemDados) => {
    if (initialScrollDoneRef.current || !contemDados) return;
    initialScrollDoneRef.current = true;
    requestAnimationFrame(() => {
      const wrap = tableWrapRef.current;
      if (!wrap) return;
      const el = wrap.querySelector(`[data-date="${today}"]`);
      if (el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
  }, [today]);

  // ── Carrega dados do passado ─────────────────────────────────────────────
  const carregarMaisPassado = useCallback(async () => {
    if (guardRef.current.loadingPast || !guardRef.current.hasMorePast) return;
    guardRef.current.loadingPast = true;
    setLoadingPast(true);
    try {
      const novoFim    = addDays(loadedInicioRef.current, -1);
      const novoInicio = addDays(loadedInicioRef.current, -LOAD_DAYS);
      const { pagar, receber } = await fetchLancamentosIntervalo(novoInicio, novoFim);
      if (pagar.length === 0 && receber.length === 0) {
        guardRef.current.hasMorePast = false;
        setHasMorePast(false);
      } else {
        isPrependingRef.current     = true;
        prevScrollHeightRef.current = tableWrapRef.current?.scrollHeight ?? 0;
        setContasPagar(prev   => [...pagar,   ...prev]);
        setContasReceber(prev => [...receber, ...prev]);
        if (setSaldosDiarios) {
          fetchSaldosDiarios(novoInicio, novoFim).then(saldos => {
            setSaldosDiarios(prev => {
              const ids = new Set(saldos.map(s => `${s.conta_bancaria_id}|${s.data}`));
              return [...saldos, ...prev.filter(s => !ids.has(`${s.conta_bancaria_id}|${s.data}`))];
            });
          }).catch(() => {});
        }
        loadedInicioRef.current = novoInicio;
        setLoadedInicio(novoInicio);
      }
    } finally {
      guardRef.current.loadingPast = false;
      setLoadingPast(false);
    }
  }, [setContasPagar, setContasReceber, setSaldosDiarios]);

  // ── Carrega dados do futuro ──────────────────────────────────────────────
  const carregarMaisFuturo = useCallback(async () => {
    if (guardRef.current.loadingFuture || !guardRef.current.hasMoreFuture) return;
    guardRef.current.loadingFuture = true;
    setLoadingFuture(true);
    try {
      const novoInicio = addDays(loadedFimRef.current,  1);
      const novoFim    = addDays(loadedFimRef.current, LOAD_DAYS);
      const { pagar, receber } = await fetchLancamentosIntervalo(novoInicio, novoFim);
      if (pagar.length === 0 && receber.length === 0) {
        guardRef.current.hasMoreFuture = false;
        setHasMoreFuture(false);
      } else {
        setContasPagar(prev   => [...prev, ...pagar]);
        setContasReceber(prev => [...prev, ...receber]);
        if (setSaldosDiarios) {
          fetchSaldosDiarios(novoInicio, novoFim).then(saldos => {
            setSaldosDiarios(prev => {
              const ids = new Set(prev.map(s => `${s.conta_bancaria_id}|${s.data}`));
              return [...prev, ...saldos.filter(s => !ids.has(`${s.conta_bancaria_id}|${s.data}`))];
            });
          }).catch(() => {});
        }
        loadedFimRef.current = novoFim;
        setLoadedFim(novoFim);
      }
    } finally {
      guardRef.current.loadingFuture = false;
      setLoadingFuture(false);
    }
  }, [setContasPagar, setContasReceber, setSaldosDiarios]);

  // ── Listener de scroll ───────────────────────────────────────────────────
  useEffect(() => {
    const wrap = tableWrapRef.current;
    if (!wrap) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrap;
      if (scrollTop < SCROLL_THRESHOLD_PX)
        carregarMaisPassado();
      if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD_PX)
        carregarMaisFuturo();
    };
    wrap.addEventListener('scroll', onScroll, { passive: true });
    return () => wrap.removeEventListener('scroll', onScroll);
  }, [carregarMaisPassado, carregarMaisFuturo]);

  return {
    tableWrapRef,
    today,
    loadedInicio,
    loadedFim,
    loadedInicioRef,
    loadedFimRef,
    loadingPast,
    loadingFuture,
    hasMorePast,
    hasMoreFuture,
    scrollParaHoje,
  };
}
