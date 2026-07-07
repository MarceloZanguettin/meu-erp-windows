import React, { useEffect, useState } from 'react';
import './FinanceiroAgrupadoWindow.css';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';

// Hooks (Controller)
import { useFinanceiroData }  from './hooks/useFinanceiroData';
import { useScrollInfinito }  from './hooks/useScrollInfinito';
import { useColunaResize }    from './hooks/useColunaResize';

// Sub-componentes (View)
import PainelEmpresaHeader from './components/PainelEmpresaHeader';
import TabelaUnificada     from './components/TabelaUnificada';
import ScrollSentinel      from './components/ScrollSentinel';

/**
 * Janela flutuante do Financeiro Agrupado.
 *
 * Responsabilidade deste arquivo: orquestrar os hooks e montar a View.
 * Toda lógica de negócio está nos hooks; todo acesso à API está em services/.
 * O cabeçalho (minimizar/maximizar/fechar), drag e resize vêm de JanelaBase —
 * este arquivo só cuida do conteúdo específico do módulo.
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
export default function FinanceiroAgrupadoWindow({ id, onClose, onMinimize, abrirJanela }) {
  // Espelha o tamanho real da janela (JanelaBase é a fonte da verdade) para
  // recalcular as larguras das colunas quando ela é redimensionada/maximizada.
  const [winSize, setWinSize] = useState({ width: 1200, height: 650 });

  // ── 1. Controller de dados (fonte única de estado dos lançamentos) ─────────
  //   Fornece: contasPagar, contasReceber, setters, ações CRUD e modal
  const dados = useFinanceiroData();

  // ── 2. Controller de scroll infinito ──────────────────────────────────────
  //   Injeta os setters de dados para escrever na mesma fonte de estado
  const scroll = useScrollInfinito({
    setContasPagar:   dados.setContasPagar,
    setContasReceber: dados.setContasReceber,
    setSaldosDiarios: dados.setSaldosDiarios,
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
  // winSize.width é passado para que as colunas reescalem ao maximizar/restaurar/resize
  const { colWidths, startColResize } = useColunaResize({
    empresas:        dados.empresas,
    contasBancarias: dados.contasBancarias,
    wrapperWidth:    winSize.width,
  });

  // ── View ───────────────────────────────────────────────────────────────────
  return (
    <JanelaBase
      id={id}
      titulo="Financeiro Agrupado"
      onClose={onClose}
      onMinimize={onMinimize}
      largura={1200}
      altura={650}
      minLargura={800}
      minAltura={450}
      iniciarMaximizado
      onResize={setWinSize}
    >
      {/* Totais e botões de adição por empresa (fixos, sem scroll) */}
      <div className="fagrup-empresas-barra">
        {dados.empresas.map(emp => (
          <PainelEmpresaHeader
            key={emp.id}
            empresa={emp}
            contasPagar={dados.contasPagar}
            contasReceber={dados.contasReceber}
            onAdicionar={(tipo, empresaId) =>
              abrirJanela('novoLancamentoFinanceiro', {
                tipo,
                empresaIdInicial: String(empresaId),
                onSalvar: dados.recarregar,
              })
            }
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
          saldosDiarios={dados.saldosDiarios}
          today={scroll.today}
          colWidths={colWidths}
          onStartColResize={startColResize}
          onClickLancamento={(conta) =>
            abrirJanela('lancamentoDetalhe', {
              conta,
              tipo: conta._tipo === 'R' ? 'receber' : 'pagar',
              onSalvar: dados.recarregar,
            })
          }
        />

        <ScrollSentinel
          loading={scroll.loadingFuture}
          hasMore={scroll.hasMoreFuture}
          msgLoading="Carregando lançamentos futuros..."
          msgFim="Fim dos registros"
        />

      </div>
    </JanelaBase>
  );
}
