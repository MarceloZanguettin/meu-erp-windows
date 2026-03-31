import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import './FinanceiroAgrupadoWindow.css';
import { useWindowResize } from '../../hooks/useWindowResize.jsx';

// Hooks (Controller)
import { useFinanceiroData }  from './hooks/useFinanceiroData';
import { useScrollInfinito }  from './hooks/useScrollInfinito';
import { useColunaResize }    from './hooks/useColunaResize';

// Sub-componentes (View)
import PainelEmpresaHeader from './components/PainelEmpresaHeader';
import TabelaUnificada     from './components/TabelaUnificada';
import ScrollSentinel      from './components/ScrollSentinel';
import ModalLancamento     from './components/ModalLancamento';

/**
 * Janela flutuante do Financeiro Agrupado.
 *
 * Responsabilidade deste arquivo: orquestrar os hooks e montar a View.
 * Toda lógica de negócio está nos hooks; todo acesso à API está em services/.
 *
 * Fluxo de dados (MVC adaptado ao React):
 *   Model   → services/financeiroService.js
 *   Controller → hooks/useFinanceiroData, useScrollInfinito, useColunaResize
 *   View    → components/* + este arquivo (JSX)
 *
 * Fonte única de estado dos lançamentos: useFinanceiroData.
 * useScrollInfinito recebe os setters do hook de dados por injeção,
 * evitando estado duplicado.
 */
export default function FinanceiroAgrupadoWindow({ id, onClose, onMinimize }) {
  const nodeRef      = useRef(null);
  const preMaxRef    = useRef(null);
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

  // ── 1. Controller de dados (fonte única de estado dos lançamentos) ─────────
  //   Fornece: contasPagar, contasReceber, setters, ações CRUD e modal
  const dados = useFinanceiroData();

  // ── 2. Controller de scroll infinito ──────────────────────────────────────
  //   Injeta os setters de dados para escrever na mesma fonte de estado
  const scroll = useScrollInfinito({
    setContasPagar:   dados.setContasPagar,
    setContasReceber: dados.setContasReceber,
  });

  // Conecta as refs de intervalo do scroll ao hook de dados,
  // para que recarregar() busque exatamente o trecho visível
  dados.bindScrollRefs(scroll.loadedInicioRef, scroll.loadedFimRef);

  // ── 3. Scroll inicial para "hoje" após a primeira carga ───────────────────
  useEffect(() => {
    const temDados = dados.contasPagar.length > 0 || dados.contasReceber.length > 0;
    scroll.scrollParaHoje(temDados);
  }, [dados.contasPagar, dados.contasReceber]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 4. Controller de resize de colunas ───────────────────────────────────
  const { colWidths, startColResize } = useColunaResize({
    empresas:        dados.empresas,
    contasBancarias: dados.contasBancarias,
  });

  // ── View ───────────────────────────────────────────────────────────────────
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

        {/* Barra de título */}
        <div className="fagrup-header">
          <span>Financeiro Agrupado</span>
          <div className="fagrup-controls">
            <button className="fagrup-btn" onMouseDown={e => e.stopPropagation()} onClick={onMinimize}      title="Minimizar">—</button>
            <button className="fagrup-btn" onMouseDown={e => e.stopPropagation()} onClick={toggleMaximizar} title={maximizada ? 'Restaurar' : 'Maximizar'}>{maximizada ? '❐' : '□'}</button>
            <button className="fagrup-btn" onMouseDown={e => e.stopPropagation()} onClick={onClose}         title="Fechar">✕</button>
          </div>
        </div>

        {/* Totais e botões de adição por empresa (fixos, sem scroll) */}
        <div className="fagrup-empresas-barra">
          {dados.empresas.map(emp => (
            <PainelEmpresaHeader
              key={emp.id}
              empresa={emp}
              contasPagar={dados.contasPagar}
              contasReceber={dados.contasReceber}
              onAdicionar={dados.abrirAdicionar}
            />
          ))}
        </div>

        {/* Área com scroll infinito */}
        <div className="fagrup-tabela-wrap" ref={scroll.tableWrapRef}>

          <ScrollSentinel
            loading={scroll.loadingPast}
            hasMore={scroll.hasMorePast}
            msgLoading="Carregando lançamentos anteriores..."
            msgFim="Início dos registros"
          />

          <TabelaUnificada
            contasPagar={dados.contasPagar}
            contasReceber={dados.contasReceber}
            empresas={dados.empresas}
            contasBancarias={dados.contasBancarias}
            today={scroll.today}
            colWidths={colWidths}
            onStartColResize={startColResize}
            onMarcarPago={dados.marcarPago}
            onMarcarRecebido={dados.marcarRecebido}
            onEditar={dados.abrirEditar}
            onExcluir={dados.excluir}
          />

          <ScrollSentinel
            loading={scroll.loadingFuture}
            hasMore={scroll.hasMoreFuture}
            msgLoading="Carregando lançamentos futuros..."
            msgFim="Fim dos registros"
          />

        </div>

        {/* Modal de criação / edição */}
        <ModalLancamento
          tipo={dados.modalTipo}
          editandoId={dados.editandoId}
          form={dados.form}
          setForm={dados.setForm}
          empresas={dados.empresas}
          bancosDoForm={dados.bancosDoForm}
          onSalvar={dados.salvar}
          onFechar={dados.fecharModal}
        />

      </div>
    </Draggable>
  );
}
