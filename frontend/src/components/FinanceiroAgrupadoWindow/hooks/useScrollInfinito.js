import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { fetchLancamentosIntervalo } from '../services/financeiroService';
import { todayStr, addDays } from '../utils/dateUtils';
import { INIT_DAYS, LOAD_DAYS, SCROLL_THRESHOLD_PX } from '../constants';

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
export function useScrollInfinito({ setContasPagar, setContasReceber }) {
  const today = useRef(todayStr()).current;

  // Intervalo já carregado — state para re-render, refs para callbacks estáveis
  const [loadedInicio, setLoadedInicio] = useState(addDays(today, -INIT_DAYS));
  const [loadedFim,    setLoadedFim]    = useState(addDays(today,  INIT_DAYS));
  const loadedInicioRef = useRef(addDays(today, -INIT_DAYS));
  const loadedFimRef    = useRef(addDays(today,  INIT_DAYS));

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
    fetchLancamentosIntervalo(loadedInicioRef.current, loadedFimRef.current)
      .then(({ pagar, receber }) => {
        setContasPagar(pagar);
        setContasReceber(receber);
      });
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
        loadedInicioRef.current = novoInicio;
        setLoadedInicio(novoInicio);
      }
    } finally {
      guardRef.current.loadingPast = false;
      setLoadingPast(false);
    }
  }, [setContasPagar, setContasReceber]);

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
        loadedFimRef.current = novoFim;
        setLoadedFim(novoFim);
      }
    } finally {
      guardRef.current.loadingFuture = false;
      setLoadingFuture(false);
    }
  }, [setContasPagar, setContasReceber]);

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
