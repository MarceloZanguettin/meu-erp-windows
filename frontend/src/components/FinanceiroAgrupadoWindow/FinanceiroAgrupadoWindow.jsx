import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import './FinanceiroAgrupadoWindow.css';
import { useWindowResize } from '../../hooks/useWindowResize.jsx';

const API = 'http://localhost:8050/financeiro';

const INIT_DAYS = 3;  // dias para trás e para frente ao abrir
const LOAD_DAYS = 7;  // dias carregados a cada scroll

// ── Formatters ────────────────────────────────────────────────────────────────
const fmt    = (v)      => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtMes = (isoStr) => new Date(isoStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
const fmtDia = (isoStr) => new Date(isoStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', weekday: 'short' });
const mesKey = (isoStr) => { const d = new Date(isoStr); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; };
const diaKey = (isoStr) => { const d = new Date(isoStr); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

const dateToStr = (d) => {
  const dd = new Date(d);
  return `${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,'0')}-${String(dd.getDate()).padStart(2,'0')}`;
};

const addDays = (ds, n) => {
  const d = new Date(ds + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return dateToStr(d);
};

const todayStr = () => dateToStr(new Date());

const isAtrasado = (c) => c.status === 'pendente' && new Date(c.data_vencimento) < new Date();

const FORM_VAZIO = { empresa_id: '', conta_bancaria_id: '', descricao: '', valor: '', data_vencimento: '', observacao: '' };

// ── Fetch module-level (não depende de estado do componente) ──────────────────
async function fetchIntervalo(ini, fim) {
  const [pagar, receber] = await Promise.all([
    fetch(`${API}/contas-pagar?data_inicio=${ini}&data_fim=${fim}`).then(r => r.json()),
    fetch(`${API}/contas-receber?data_inicio=${ini}&data_fim=${fim}`).then(r => r.json()),
  ]);
  return { pagar, receber };
}

// ── Agrupamento ───────────────────────────────────────────────────────────────
function agruparPorData(pagarList, receberList) {
  const todos = [
    ...receberList.map(c => ({ ...c, _tipo: 'R' })),
    ...pagarList.map(c => ({ ...c, _tipo: 'P' })),
  ].sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento));

  const meses = {};
  todos.forEach(c => {
    const mk = mesKey(c.data_vencimento);
    const dk = diaKey(c.data_vencimento);
    if (!meses[mk]) meses[mk] = { label: fmtMes(c.data_vencimento), dias: {} };
    if (!meses[mk].dias[dk]) meses[mk].dias[dk] = { label: fmtDia(c.data_vencimento), entradas: [] };
    meses[mk].dias[dk].entradas.push(c);
  });
  return meses;
}

function classeLinha(c) {
  if (isAtrasado(c)) return 'row-atrasado';
  return '';
}

function classeValorFn(c) {
  return c._tipo === 'R' ? 'col-valor valor-receber' : 'col-valor valor-pagar';
}

// ═════════════════════════════════════════════════════════════════════════════
export default function FinanceiroAgrupadoWindow({ id, onClose, onMinimize }) {
  const nodeRef    = useRef(null);
  const preMaxRef  = useRef(null);
  const randomOffset = (id % 10) * 15;
  const { winPos, setWinPos, winSize, setWinSize, ResizeHandles } = useWindowResize({
    initX: 60 + randomOffset, initY: 60 + randomOffset,
    initW: 1200, initH: 650, minW: 800, minH: 450,
  });

  const [maximizada, setMaximizada] = useState(false);

  const toggleMaximizar = () => {
    if (maximizada) {
      if (preMaxRef.current) {
        setWinPos(preMaxRef.current.pos);
        setWinSize(preMaxRef.current.size);
      }
      setMaximizada(false);
    } else {
      const headerEl = document.querySelector('.app-header');
      const headerH  = headerEl ? headerEl.offsetHeight : 60;
      const taskbarH = 45;
      preMaxRef.current = { pos: { ...winPos }, size: { ...winSize } };
      setWinPos({ x: 0, y: headerH });
      setWinSize({ width: window.innerWidth, height: window.innerHeight - headerH - taskbarH });
      setMaximizada(true);
    }
  };

  // ── Dados ─────────────────────────────────────────────────────────────────
  const [empresas,        setEmpresas]        = useState([]);
  const [contasBancarias, setContasBancarias] = useState([]);
  const [contasPagar,     setContasPagar]     = useState([]);
  const [contasReceber,   setContasReceber]   = useState([]);

  // ── Estado do scroll infinito ─────────────────────────────────────────────
  const today = useRef(todayStr()).current;
  const [loadedInicio, setLoadedInicio] = useState(addDays(today, -INIT_DAYS));
  const [loadedFim,    setLoadedFim]    = useState(addDays(today,  INIT_DAYS));
  const [loadingPast,   setLoadingPast]   = useState(false);
  const [loadingFuture, setLoadingFuture] = useState(false);
  const [hasMorePast,   setHasMorePast]   = useState(true);
  const [hasMoreFuture, setHasMoreFuture] = useState(true);

  // Refs estáveis para os callbacks (evitam recriação em cada render)
  const loadedInicioRef = useRef(addDays(today, -INIT_DAYS));
  const loadedFimRef    = useRef(addDays(today,  INIT_DAYS));
  const guardRef        = useRef({ loadingPast: false, loadingFuture: false, hasMorePast: true, hasMoreFuture: true });

  // Manter refs sincronizados com state
  useEffect(() => { loadedInicioRef.current = loadedInicio; }, [loadedInicio]);
  useEffect(() => { loadedFimRef.current    = loadedFim;    }, [loadedFim]);

  // Restauração de scroll ao fazer prepend (dados carregados no topo)
  const tableWrapRef        = useRef(null);
  const isPrependingRef     = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const initialScrollDoneRef = useRef(false);

  // ── Modal ─────────────────────────────────────────────────────────────────
  const [modalTipo,  setModalTipo]  = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [form,       setForm]       = useState(FORM_VAZIO);

  // ── Dados estáticos ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/empresas`).then(r => r.json()).then(setEmpresas);
    fetch(`${API}/contas-bancarias`).then(r => r.json()).then(setContasBancarias);
  }, []);

  // ── Carga inicial (janela de ±INIT_DAYS ao redor de hoje) ────────────────
  useEffect(() => {
    fetchIntervalo(loadedInicioRef.current, loadedFimRef.current).then(({ pagar, receber }) => {
      setContasPagar(pagar);
      setContasReceber(receber);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Recarrega o intervalo já visível (pós-mutações) ──────────────────────
  const recarregar = useCallback(async () => {
    const { pagar, receber } = await fetchIntervalo(loadedInicioRef.current, loadedFimRef.current);
    setContasPagar(pagar);
    setContasReceber(receber);
  }, []);

  // ── Carga incremental — passado ───────────────────────────────────────────
  const carregarMaisPassado = useCallback(async () => {
    if (guardRef.current.loadingPast || !guardRef.current.hasMorePast) return;
    guardRef.current.loadingPast = true;
    setLoadingPast(true);
    try {
      const novoFim    = addDays(loadedInicioRef.current, -1);
      const novoInicio = addDays(loadedInicioRef.current, -LOAD_DAYS);
      const { pagar, receber } = await fetchIntervalo(novoInicio, novoFim);
      if (pagar.length === 0 && receber.length === 0) {
        guardRef.current.hasMorePast = false;
        setHasMorePast(false);
      } else {
        // Salva altura atual antes do prepend para restaurar o scroll depois
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Carga incremental — futuro ────────────────────────────────────────────
  const carregarMaisFuturo = useCallback(async () => {
    if (guardRef.current.loadingFuture || !guardRef.current.hasMoreFuture) return;
    guardRef.current.loadingFuture = true;
    setLoadingFuture(true);
    try {
      const novoInicio = addDays(loadedFimRef.current,  1);
      const novoFim    = addDays(loadedFimRef.current, LOAD_DAYS);
      const { pagar, receber } = await fetchIntervalo(novoInicio, novoFim);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Restaura scroll após prepend (useLayoutEffect roda antes do paint) ────
  useLayoutEffect(() => {
    if (isPrependingRef.current && tableWrapRef.current) {
      const delta = tableWrapRef.current.scrollHeight - prevScrollHeightRef.current;
      if (delta > 0) tableWrapRef.current.scrollTop += delta;
      isPrependingRef.current = false;
    }
  });

  // ── Scroll inicial para a data de hoje ────────────────────────────────────
  useEffect(() => {
    if (!initialScrollDoneRef.current && (contasPagar.length > 0 || contasReceber.length > 0)) {
      initialScrollDoneRef.current = true;
      requestAnimationFrame(() => {
        const wrap = tableWrapRef.current;
        if (!wrap) return;
        const todayEl = wrap.querySelector(`[data-date="${today}"]`);
        if (todayEl) {
          todayEl.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      });
    }
  }, [contasPagar, contasReceber, today]);

  // ── Listener de scroll para scroll infinito ───────────────────────────────
  useEffect(() => {
    const wrap = tableWrapRef.current;
    if (!wrap) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = wrap;
      if (scrollTop < 300)                              carregarMaisPassado();
      if (scrollHeight - scrollTop - clientHeight < 300) carregarMaisFuturo();
    };
    wrap.addEventListener('scroll', onScroll, { passive: true });
    return () => wrap.removeEventListener('scroll', onScroll);
  }, [carregarMaisPassado, carregarMaisFuturo]); // callbacks estáveis → roda 1x

  // ── Ações ─────────────────────────────────────────────────────────────────
  const abrirAdicionar = (tipo, empresaId) => {
    setEditandoId(null);
    setModalTipo(tipo);
    setForm({ ...FORM_VAZIO, empresa_id: String(empresaId) });
  };

  const abrirEditar = (tipo, c) => {
    setEditandoId(c.id);
    setModalTipo(tipo);
    setForm({
      empresa_id:        String(c.empresa_id),
      conta_bancaria_id: c.conta_bancaria_id ? String(c.conta_bancaria_id) : '',
      descricao:         c.descricao,
      valor:             String(c.valor),
      data_vencimento:   c.data_vencimento ? c.data_vencimento.slice(0, 10) : '',
      observacao:        c.observacao || '',
    });
  };

  const salvar = async () => {
    const body = {
      empresa_id:        Number(form.empresa_id),
      conta_bancaria_id: form.conta_bancaria_id ? Number(form.conta_bancaria_id) : null,
      descricao:         form.descricao,
      valor:             parseFloat(form.valor),
      data_vencimento:   new Date(form.data_vencimento).toISOString(),
      observacao:        form.observacao || null,
    };
    const base   = modalTipo === 'pagar' ? `${API}/contas-pagar` : `${API}/contas-receber`;
    const url    = editandoId ? `${base}/${editandoId}` : base;
    const method = editandoId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setModalTipo(null);
    recarregar();
  };

  const marcarPago = async (cId) => {
    await fetch(`${API}/contas-pagar/${cId}/pagar`, { method: 'PATCH' });
    recarregar();
  };

  const marcarRecebido = async (cId) => {
    await fetch(`${API}/contas-receber/${cId}/receber`, { method: 'PATCH' });
    recarregar();
  };

  const excluir = async (tipo, cId) => {
    if (!confirm('Excluir este lançamento?')) return;
    const base = tipo === 'P' ? `${API}/contas-pagar` : `${API}/contas-receber`;
    await fetch(`${base}/${cId}`, { method: 'DELETE' });
    recarregar();
  };

  // ── Bancos para o formulário ──────────────────────────────────────────────
  const bancosDoForm = contasBancarias.filter(
    cb => !form.empresa_id || cb.empresa_id === Number(form.empresa_id)
  );

  // ── Larguras de colunas redimensionáveis ──────────────────────────────────
  const [colWidths, setColWidths] = useState([]);

  useEffect(() => {
    const allBanks = empresas.flatMap(emp =>
      contasBancarias.filter(cb => cb.empresa_id === emp.id)
    );
    const n = allBanks.length;
    const expected = 6 + n;
    if (expected > 0 && colWidths.length !== expected) {
      setColWidths([
        110, 55, 180,
        ...Array(n).fill(120),
        90, 110, 175,
      ]);
    }
  }, [empresas, contasBancarias]); // eslint-disable-line react-hooks/exhaustive-deps

  const startColResize = useCallback((e, colIdx) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startW = colWidths[colIdx] ?? 80;
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';
    const onMove = (ev) => {
      const newW = Math.max(40, startW + ev.clientX - startX);
      setColWidths(prev => prev.map((w, i) => i === colIdx ? newW : w));
    };
    const onUp = () => {
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup',   onUp);
  }, [colWidths]);

  // ── Badge de status ───────────────────────────────────────────────────────
  const BadgeStatus = ({ conta }) => {
    if (isAtrasado(conta))
      return <span className="fagrup-badge badge-atrasado">Atrasado</span>;
    const ok = conta._tipo === 'R' ? 'recebido' : 'pago';
    return (
      <span className={`fagrup-badge ${conta.status === ok ? 'badge-ok' : 'badge-pend'}`}>
        {conta.status}
      </span>
    );
  };

  // ── Cabeçalho de empresa com totais ──────────────────────────────────────
  const PainelEmpresaHeader = ({ empresa }) => {
    const pagar   = contasPagar.filter(c => c.empresa_id === empresa.id);
    const receber = contasReceber.filter(c => c.empresa_id === empresa.id);
    const totRecPend = receber.filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);
    const totRecRec  = receber.filter(c => c.status === 'recebido').reduce((s, c) => s + c.valor, 0);
    const totPagPend = pagar.filter(c => c.status === 'pendente').reduce((s, c) => s + c.valor, 0);
    const totPagPago = pagar.filter(c => c.status === 'pago').reduce((s, c) => s + c.valor, 0);
    return (
      <div className="fagrup-empresa-bloco">
        <div className="fagrup-painel-header">
          <span className="fagrup-painel-titulo fagrup-empresa-nome">{empresa.nome}</span>
          <div className="fagrup-painel-btns">
            <button className="fagrup-btn-add btn-receber" onClick={() => abrirAdicionar('receber', empresa.id)}>+ Receber</button>
            <button className="fagrup-btn-add btn-pagar"   onClick={() => abrirAdicionar('pagar',   empresa.id)}>+ Pagar</button>
          </div>
        </div>
        <div className="fagrup-totais">
          <span className="fagrup-total-item receber-pend">A receber: <strong>{fmt(totRecPend)}</strong></span>
          <span className="fagrup-total-sep">|</span>
          <span className="fagrup-total-item recebido">Recebido: <strong>{fmt(totRecRec)}</strong></span>
          <span className="fagrup-total-sep">|</span>
          <span className="fagrup-total-item pagar-pend">A pagar: <strong>{fmt(totPagPend)}</strong></span>
          <span className="fagrup-total-sep">|</span>
          <span className="fagrup-total-item pago">Pago: <strong>{fmt(totPagPago)}</strong></span>
        </div>
      </div>
    );
  };

  // ── Tabela única com todos os lançamentos carregados ─────────────────────
  const TabelaUnificada = () => {
    const grupos = agruparPorData(contasPagar, contasReceber);

    const empBancos = empresas.map(emp =>
      contasBancarias.filter(cb => cb.empresa_id === emp.id)
    );
    const allBanks  = empBancos.flat();
    const TOTAL_COLS = 3 + allBanks.length + 3;

    // Saldo corrido + resumo por dia
    let saldoCorrido = 0;
    const resumoDia = {};
    Object.values(grupos).forEach(({ dias }) => {
      Object.entries(dias).forEach(([dk, { entradas }]) => {
        const recebido = entradas.filter(c => c._tipo === 'R' && c.status === 'recebido').reduce((s, c) => s + c.valor, 0);
        const pago     = entradas.filter(c => c._tipo === 'P' && c.status === 'pago').reduce((s, c) => s + c.valor, 0);
        const prevRec  = entradas.filter(c => c._tipo === 'R' && c.status === 'pendente' && !isAtrasado(c)).reduce((s, c) => s + c.valor, 0);
        const prevPag  = entradas.filter(c => c._tipo === 'P' && c.status === 'pendente' && !isAtrasado(c)).reduce((s, c) => s + c.valor, 0);
        const saldoAnterior = saldoCorrido;
        const diferenca = (recebido + prevRec) - (pago + prevPag);
        saldoCorrido += diferenca;
        resumoDia[dk] = { recebido, pago, prevRec, prevPag, saldoAnterior, diferenca, saldoFinal: saldoCorrido };
      });
    });

    const hasEntradas = Object.keys(grupos).length > 0;
    const nBancos     = allBanks.length;
    const totalW      = colWidths.reduce((s, w) => s + w, 0);

    const Handle = ({ ci }) => (
      <div className="col-resize-handle" onMouseDown={e => startColResize(e, ci)} />
    );

    return (
      <table className="fagrup-tabela" style={{ tableLayout: 'fixed', width: totalW > 0 ? totalW : undefined }}>
        <colgroup>
          {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
        </colgroup>
        <thead>
          <tr>
            <th rowSpan={2} className="th-data">Data<Handle ci={0} /></th>
            <th rowSpan={2} className="th-tipo">Tipo<Handle ci={1} /></th>
            <th rowSpan={2} className="th-desc">Descrição<Handle ci={2} /></th>
            {empresas.map((emp, i) =>
              empBancos[i]?.length > 0
                ? <th key={emp.id} colSpan={empBancos[i].length} className="th-empresa-group">{emp.nome}</th>
                : null
            )}
            <th rowSpan={2} className="th-status">Status<Handle ci={3 + nBancos} /></th>
            <th rowSpan={2} className="th-acoes">Ações<Handle ci={4 + nBancos} /></th>
            <th rowSpan={2} className="th-resumo">Resumo do Dia<Handle ci={5 + nBancos} /></th>
          </tr>
          <tr>
            {allBanks.map((cb, i) => (
              <th key={cb.id} className="th-banco-sub">{cb.banco}<Handle ci={3 + i} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!hasEntradas && (
            <tr><td colSpan={TOTAL_COLS} className="fagrup-vazio">Nenhum lançamento encontrado</td></tr>
          )}

          {Object.entries(grupos).map(([mk, { label: labelMes, dias }]) => (
            <React.Fragment key={mk}>
              <tr className="row-mes">
                <td colSpan={TOTAL_COLS}>{labelMes}</td>
              </tr>

              {Object.entries(dias).map(([dk, { entradas }], dayIdx) => {
                const res     = resumoDia[dk] || {};
                const diaBase = dayIdx % 2 === 1 ? 'dia-alt' : 'dia-base';
                const isToday = dk === today;
                return (
                  <React.Fragment key={dk}>
                    {entradas.map((c, idx) => {
                      const isFirst = idx === 0;
                      const isLast  = idx === entradas.length - 1;
                      const rowCls  = [
                        classeLinha(c), diaBase,
                        isFirst ? 'row-dia-first' : '',
                        isLast  ? 'row-dia-last'  : '',
                        isToday ? 'row-hoje'       : '',
                      ].filter(Boolean).join(' ');
                      return (
                        <tr
                          key={`${c._tipo}-${c.id}`}
                          className={rowCls}
                          data-date={isFirst ? dk : undefined}
                        >
                          {isFirst && (
                            <td rowSpan={entradas.length} className="col-data col-data-grupo">
                              {fmtDia(c.data_vencimento)}
                            </td>
                          )}
                          <td className="col-tipo">
                            <span className={`tipo-badge tipo-${c._tipo === 'R' ? 'receber' : 'pagar'}`}>
                              {c._tipo === 'R' ? 'R' : 'P'}
                            </span>
                          </td>
                          <td className="col-desc" title={c.observacao}>{c.descricao}</td>
                          {allBanks.map(cb =>
                            c.empresa_id === cb.empresa_id && c.conta_bancaria_id === cb.id
                              ? <td key={cb.id} className={classeValorFn(c)}>{fmt(c.valor)}</td>
                              : <td key={cb.id} className="celula-vazia">—</td>
                          )}
                          <td><BadgeStatus conta={c} /></td>
                          <td className="col-acoes">
                            {c.status === 'pendente' && c._tipo === 'R' && (
                              <button className="act-ok" title="Marcar recebido" onClick={() => marcarRecebido(c.id)}>✓</button>
                            )}
                            {c.status === 'pendente' && c._tipo === 'P' && (
                              <button className="act-ok" title="Marcar pago" onClick={() => marcarPago(c.id)}>✓</button>
                            )}
                            <button className="act-edit" title="Editar" onClick={() => abrirEditar(c._tipo === 'R' ? 'receber' : 'pagar', c)}>✎</button>
                            <button className="act-del"  title="Excluir" onClick={() => excluir(c._tipo, c.id)}>✕</button>
                          </td>
                          {isFirst && (
                            <td rowSpan={entradas.length} className="col-resumo-dia">
                              <div className="resumo-linha resumo-ant">
                                <span className="resumo-label">Ant</span>
                                <span className="resumo-val">{fmt(res.saldoAnterior)}</span>
                              </div>
                              <div className="resumo-linha resumo-rec">
                                <span className="resumo-label">Rec</span>
                                <span className="resumo-val val-receber">{fmt(res.recebido)}</span>
                              </div>
                              <div className="resumo-linha resumo-pag">
                                <span className="resumo-label">Pag</span>
                                <span className="resumo-val val-pagar">{fmt(res.pago)}</span>
                              </div>
                              {res.prevRec > 0 && (
                                <div className="resumo-linha resumo-prev-rec">
                                  <span className="resumo-label resumo-label-prev">Prev ↑</span>
                                  <span className="resumo-val val-prev-rec">{fmt(res.prevRec)}</span>
                                </div>
                              )}
                              {res.prevPag > 0 && (
                                <div className="resumo-linha resumo-prev-pag">
                                  <span className="resumo-label resumo-label-prev">Prev ↓</span>
                                  <span className="resumo-val val-prev-pag">{fmt(res.prevPag)}</span>
                                </div>
                              )}
                              <div className="resumo-linha resumo-dif">
                                <span className="resumo-label">Dif</span>
                                <span className={`resumo-val ${res.diferenca >= 0 ? 'val-pos' : 'val-neg'}`}>{fmt(res.diferenca)}</span>
                              </div>
                              <div className="resumo-linha resumo-sal">
                                <span className="resumo-label">Sal</span>
                                <span className={`resumo-val resumo-saldo-final ${res.saldoFinal >= 0 ? 'val-pos' : 'val-neg'}`}>{fmt(res.saldoFinal)}</span>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".fagrup-header"
      position={winPos}
      disabled={maximizada}
      onDrag={(_e, data) => setWinPos({ x: data.x, y: data.y })}
    >
      <div ref={nodeRef} className="fagrup-window" style={{ width: winSize.width, height: winSize.height }}>
        <ResizeHandles />

        {/* Cabeçalho */}
        <div className="fagrup-header">
          <span>Financeiro Agrupado</span>
          <div className="fagrup-controls">
            <button className="fagrup-btn" onMouseDown={e => e.stopPropagation()} onClick={onMinimize}      title="Minimizar">—</button>
            <button className="fagrup-btn" onMouseDown={e => e.stopPropagation()} onClick={toggleMaximizar} title={maximizada ? 'Restaurar' : 'Maximizar'}>{maximizada ? '❐' : '□'}</button>
            <button className="fagrup-btn" onMouseDown={e => e.stopPropagation()} onClick={onClose}         title="Fechar">✕</button>
          </div>
        </div>

        {/* Cabeçalhos das empresas — fixos, acima da tabela */}
        <div className="fagrup-empresas-barra">
          {empresas.map(emp => <PainelEmpresaHeader key={emp.id} empresa={emp} />)}
        </div>

        {/* Área de scroll infinito */}
        <div className="fagrup-tabela-wrap" ref={tableWrapRef}>

          {/* Sentinel do passado */}
          <div className="fagrup-sentinel">
            {loadingPast  && <span className="fagrup-loading-msg">Carregando lançamentos anteriores...</span>}
            {!hasMorePast && <span className="fagrup-sem-mais">Início dos registros</span>}
          </div>

          <TabelaUnificada />

          {/* Sentinel do futuro */}
          <div className="fagrup-sentinel">
            {loadingFuture  && <span className="fagrup-loading-msg">Carregando lançamentos futuros...</span>}
            {!hasMoreFuture && <span className="fagrup-sem-mais">Fim dos registros</span>}
          </div>

        </div>

        {/* Modal unificado (pagar / receber) */}
        {modalTipo && (
          <div className="fagrup-modal-overlay">
            <div className="fagrup-modal">
              <h3>
                {editandoId ? 'Editar' : 'Novo'}{' '}
                {modalTipo === 'receber' ? 'Lançamento a Receber' : 'Lançamento a Pagar'}
              </h3>

              <div className="fagrup-form-group">
                <label>Empresa</label>
                <select value={form.empresa_id} onChange={e => setForm({ ...form, empresa_id: e.target.value, conta_bancaria_id: '' })}>
                  <option value="">Selecione</option>
                  {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>

              <div className="fagrup-form-group">
                <label>Conta Bancária</label>
                <select value={form.conta_bancaria_id} onChange={e => setForm({ ...form, conta_bancaria_id: e.target.value })}>
                  <option value="">Selecione</option>
                  {bancosDoForm.map(cb => <option key={cb.id} value={cb.id}>{cb.banco}</option>)}
                </select>
              </div>

              <div className="fagrup-form-group">
                <label>Descrição</label>
                <input value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
              </div>

              <div className="fagrup-form-row">
                <div className="fagrup-form-group">
                  <label>Valor (R$)</label>
                  <input type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                </div>
                <div className="fagrup-form-group">
                  <label>Vencimento</label>
                  <input type="date" value={form.data_vencimento} onChange={e => setForm({ ...form, data_vencimento: e.target.value })} />
                </div>
              </div>

              <div className="fagrup-form-group">
                <label>Observação</label>
                <input value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
              </div>

              <div className="fagrup-modal-actions">
                <button className="btn-cancel" onClick={() => setModalTipo(null)}>Cancelar</button>
                <button
                  className={`btn-save ${modalTipo === 'receber' ? 'receber-save' : 'pagar-save'}`}
                  onClick={salvar}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Draggable>
  );
}
