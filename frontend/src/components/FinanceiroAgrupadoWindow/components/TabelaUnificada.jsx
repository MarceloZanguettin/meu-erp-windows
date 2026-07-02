import React, { useState, useCallback } from 'react';
import BadgeStatus from './BadgeStatus';
import { agruparPorData, calcularResumoDia, classeLinha, classeValor } from '../utils/lancamentoUtils';
import { fmtDia, fmt } from '../utils/formatters';

/** Handle de redimensionamento de coluna */
function ColHandle({ colIdx, onStart }) {
  return (
    <div
      className="col-resize-handle"
      onMouseDown={e => onStart(e, colIdx)}
    />
  );
}

/** Bloco de resumo de um único contexto (empresa ou consolidado) */
function BlocoResumo({ r }) {
  if (!r) return null;
  return (
    <>
      <div className="resumo-linha resumo-ant">
        <span className="resumo-label">Anterior</span>
        <span className="resumo-val">{fmt(r.saldoAnterior)}</span>
      </div>
      <div className="resumo-linha resumo-rec">
        <span className="resumo-label">Recebido</span>
        <span className="resumo-val val-receber">{fmt(r.recebido)}</span>
      </div>
      <div className="resumo-linha resumo-pag">
        <span className="resumo-label">Pago</span>
        <span className="resumo-val val-pagar">{fmt(r.pago)}</span>
      </div>
      {r.prevRec > 0 && (
        <div className="resumo-linha resumo-prev-rec">
          <span className="resumo-label resumo-label-prev">Prev. Recebimento</span>
          <span className="resumo-val val-prev-rec">{fmt(r.prevRec)}</span>
        </div>
      )}
      {r.prevPag > 0 && (
        <div className="resumo-linha resumo-prev-pag">
          <span className="resumo-label resumo-label-prev">Prev. a Pagar</span>
          <span className="resumo-val val-prev-pag">{fmt(r.prevPag)}</span>
        </div>
      )}
      <div className="resumo-linha resumo-dif">
        <span className="resumo-label">Diferença</span>
        <span className={`resumo-val ${r.diferenca >= 0 ? 'val-pos' : 'val-neg'}`}>
          {fmt(r.diferenca)}
        </span>
      </div>
      <div className="resumo-linha resumo-sal">
        <span className="resumo-label">Saldo</span>
        <span className={`resumo-val resumo-saldo-final ${r.saldoFinal >= 0 ? 'val-pos' : 'val-neg'}`}>
          {fmt(r.saldoFinal)}
        </span>
      </div>
    </>
  );
}

/**
 * Linha de resumo do dia — sempre visível, clicável para expandir/recolher.
 * Mostra data, contagem e resumo por empresa → bancos da empresa → consolidado.
 */
function DaySummaryRow({ dk, entradas, res, empresas, empBancos, isExpanded, isToday, onToggle }) {
  return (
    <tr
      className={`row-day-summary ${isToday ? 'row-day-summary--hoje' : ''}`}
      onClick={onToggle}
    >
      <td colSpan={999} className="cell-day-summary">
        <div className="day-summary-inner">

          {/* ── Esquerda: data + contador ── */}
          <div className="day-summary-left">
            <span className="day-summary-arrow">{isExpanded ? '▼' : '▶'}</span>
            <span className="day-summary-date">{fmtDia(dk)}</span>
            <span className="day-summary-count">
              {entradas.length} lançamento{entradas.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── Direita: por empresa → bancos → consolidado ── */}
          <div className="day-summary-resumos">
            {empresas.map((emp, i) => (
              <React.Fragment key={emp.id}>
                {i > 0 && <div className="day-summary-vsep day-summary-vsep--empresa" />}

                {/* Total da empresa */}
                <div className="day-empresa-block">
                  <span className="day-empresa-block-label">{emp.nome}</span>
                  <BlocoResumo r={res.porEmpresa?.[emp.id]} />
                </div>

                {/* Bancos desta empresa */}
                {empBancos[i]?.map(cb => (
                  <React.Fragment key={cb.id}>
                    <div className="day-summary-vsep day-summary-vsep--banco" />
                    <div className="day-banco-block">
                      <span className="day-banco-block-label">{cb.banco}</span>
                      <BlocoResumo r={res.porBanco?.[cb.id]} />
                    </div>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}

            {/* Consolidado (só com mais de uma empresa) */}
            {empresas.length > 1 && res.consolidado && (
              <>
                <div className="day-summary-vsep day-summary-vsep--consolidado" />
                <div className="day-empresa-block day-empresa-block--consolidado">
                  <span className="day-empresa-block-label">Consolidado</span>
                  <BlocoResumo r={res.consolidado} />
                </div>
              </>
            )}
          </div>

        </div>
      </td>
    </tr>
  );
}

/**
 * Tabela unificada de lançamentos agrupados por mês e dia.
 *
 * Cada dia começa recolhido mostrando a linha de resumo.
 * Clicar na linha do dia expande os lançamentos individuais.
 * Clicar em um lançamento abre a janela de detalhe.
 */
export default function TabelaUnificada({
  contasPagar, contasReceber,
  empresas, contasBancarias,
  saldosDiarios = [],
  today, colWidths, onStartColResize,
  onClickLancamento,
}) {
  // Dias expandidos — hoje começa expandido por padrão
  const [expandedDays, setExpandedDays] = useState(() => new Set([today]));

  const toggleDay = useCallback((dk) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(dk)) next.delete(dk);
      else next.add(dk);
      return next;
    });
  }, []);

  const grupos    = agruparPorData(contasPagar, contasReceber);
  const resumoDia = calcularResumoDia(grupos, empresas, contasBancarias, saldosDiarios);

  const empBancos = empresas.map(emp => contasBancarias.filter(cb => cb.empresa_id === emp.id));
  const allBanks  = empBancos.flat();
  const nBancos   = allBanks.length;
  const totalW    = colWidths.reduce((s, w) => s + w, 0);

  // Marca o primeiro banco de cada empresa (exceto a primeira) — para divisor visual
  const isBankSep = allBanks.map((cb, i) =>
    i > 0 && allBanks[i - 1].empresa_id !== cb.empresa_id,
  );

  const TOTAL_COLS = 3 + nBancos + 1; // Data | Tipo | Desc | Banks | Status

  const hasEntradas = Object.keys(grupos).length > 0;

  return (
    <table
      className="fagrup-tabela"
      style={{ tableLayout: 'fixed', width: totalW > 0 ? totalW : undefined }}
    >
      <colgroup>
        {colWidths.map((w, i) => <col key={i} style={{ width: w }} />)}
      </colgroup>

      <thead>
        <tr>
          <th rowSpan={2} className="th-data">
            Data<ColHandle colIdx={0} onStart={onStartColResize} />
          </th>
          <th rowSpan={2} className="th-tipo">
            Tipo<ColHandle colIdx={1} onStart={onStartColResize} />
          </th>
          <th rowSpan={2} className="th-desc">
            Descrição<ColHandle colIdx={2} onStart={onStartColResize} />
          </th>
          {empresas.map((emp, i) =>
            empBancos[i]?.length > 0 ? (
              <th
                key={emp.id}
                colSpan={empBancos[i].length}
                className={`th-empresa-group ${i > 0 ? 'th-empresa-group--sep' : ''}`}
              >
                {emp.nome}
              </th>
            ) : null
          )}
          <th rowSpan={2} className="th-status">
            Status<ColHandle colIdx={3 + nBancos} onStart={onStartColResize} />
          </th>
        </tr>
        <tr>
          {allBanks.map((cb, i) => (
            <th
              key={cb.id}
              className={`th-banco-sub ${isBankSep[i] ? 'th-banco-sub--sep' : ''}`}
            >
              {cb.banco}<ColHandle colIdx={3 + i} onStart={onStartColResize} />
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {!hasEntradas && (
          <tr>
            <td colSpan={TOTAL_COLS} className="fagrup-vazio">
              Nenhum lançamento encontrado
            </td>
          </tr>
        )}

        {Object.entries(grupos).map(([mk, { label: labelMes, dias }]) => (
          <React.Fragment key={mk}>
            {/* ── Cabeçalho do mês ── */}
            <tr className="row-mes">
              <td colSpan={TOTAL_COLS}>{labelMes}</td>
            </tr>

            {Object.entries(dias).map(([dk, { entradas }]) => {
              const res        = resumoDia[dk] || {};
              const isExpanded = expandedDays.has(dk);
              const isToday    = dk === today;

              return (
                <React.Fragment key={dk}>
                  {/* ── Linha de resumo do dia (sempre visível) ── */}
                  <DaySummaryRow
                    dk={dk}
                    entradas={entradas}
                    res={res}
                    empresas={empresas}
                    empBancos={empBancos}
                    isExpanded={isExpanded}
                    isToday={isToday}
                    onToggle={() => toggleDay(dk)}
                  />

                  {/* ── Lançamentos individuais (apenas quando expandido) ── */}
                  {isExpanded && entradas.map((c, idx) => {
                    const rowCls = [
                      classeLinha(c),
                      idx % 2 === 0 ? 'dia-base' : 'dia-alt',
                      isToday ? 'row-hoje' : '',
                    ].filter(Boolean).join(' ');

                    return (
                      <tr
                        key={`${c._tipo}-${c.id}`}
                        className={`row-lancamento ${rowCls}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => onClickLancamento(c)}
                      >
                        {/* Célula de data vazia — data já mostrada na linha de resumo */}
                        <td className="col-data-lancamento" />

                        <td className="col-tipo">
                          <span className={`tipo-badge tipo-${c._tipo === 'R' ? 'receber' : 'pagar'}`}>
                            {c._tipo}
                          </span>
                        </td>

                        <td className="col-desc" title={c.observacao}>{c.descricao}</td>

                        {allBanks.map((cb, i) =>
                          c.empresa_id === cb.empresa_id && c.conta_bancaria_id === cb.id
                            ? <td key={cb.id} className={`${classeValor(c)} ${isBankSep[i] ? 'col-empresa-sep' : ''}`}>{fmt(c.valor)}</td>
                            : <td key={cb.id} className={`celula-vazia ${isBankSep[i] ? 'col-empresa-sep' : ''}`}>—</td>
                        )}

                        <td><BadgeStatus conta={c} /></td>
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
}
