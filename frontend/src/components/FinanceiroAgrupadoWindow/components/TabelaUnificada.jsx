import React from 'react';
import BadgeStatus from './BadgeStatus';
import { agruparPorData, calcularResumoDia, classeLinha, classeValor } from '../utils/lancamentoUtils';
import { fmtDia, fmt } from '../utils/formatters';

/**
 * Handle de redimensionamento de coluna.
 */
function ColHandle({ colIdx, onStart }) {
  return (
    <div
      className="col-resize-handle"
      onMouseDown={e => onStart(e, colIdx)}
    />
  );
}

/**
 * Células de resumo do dia (saldo corrido).
 */
function ResumoDia({ res }) {
  return (
    <>
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
        <span className={`resumo-val ${res.diferenca >= 0 ? 'val-pos' : 'val-neg'}`}>
          {fmt(res.diferenca)}
        </span>
      </div>
      <div className="resumo-linha resumo-sal">
        <span className="resumo-label">Sal</span>
        <span className={`resumo-val resumo-saldo-final ${res.saldoFinal >= 0 ? 'val-pos' : 'val-neg'}`}>
          {fmt(res.saldoFinal)}
        </span>
      </div>
    </>
  );
}

/**
 * Tabela unificada de lançamentos agrupados por mês e dia.
 * Todas as empresas aparecem em colunas de banco lado a lado.
 *
 * @param {{
 *   contasPagar:     object[],
 *   contasReceber:   object[],
 *   empresas:        object[],
 *   contasBancarias: object[],
 *   today:           string,
 *   colWidths:       number[],
 *   onStartColResize: Function,
 *   onMarcarPago:     Function,
 *   onMarcarRecebido: Function,
 *   onEditar:         Function,
 *   onExcluir:        Function,
 * }} props
 */
export default function TabelaUnificada({
  contasPagar, contasReceber,
  empresas, contasBancarias,
  today, colWidths, onStartColResize,
  onMarcarPago, onMarcarRecebido, onEditar, onExcluir,
}) {
  const grupos    = agruparPorData(contasPagar, contasReceber);
  const resumoDia = calcularResumoDia(grupos);

  const empBancos  = empresas.map(emp => contasBancarias.filter(cb => cb.empresa_id === emp.id));
  const allBanks   = empBancos.flat();
  const TOTAL_COLS = 3 + allBanks.length + 3;
  const nBancos    = allBanks.length;
  const totalW     = colWidths.reduce((s, w) => s + w, 0);

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
            empBancos[i]?.length > 0
              ? <th key={emp.id} colSpan={empBancos[i].length} className="th-empresa-group">{emp.nome}</th>
              : null
          )}
          <th rowSpan={2} className="th-status">
            Status<ColHandle colIdx={3 + nBancos} onStart={onStartColResize} />
          </th>
          <th rowSpan={2} className="th-acoes">
            Ações<ColHandle colIdx={4 + nBancos} onStart={onStartColResize} />
          </th>
          <th rowSpan={2} className="th-resumo">
            Resumo do Dia<ColHandle colIdx={5 + nBancos} onStart={onStartColResize} />
          </th>
        </tr>
        <tr>
          {allBanks.map((cb, i) => (
            <th key={cb.id} className="th-banco-sub">
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
                      classeLinha(c),
                      diaBase,
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
                            {c._tipo}
                          </span>
                        </td>

                        <td className="col-desc" title={c.observacao}>{c.descricao}</td>

                        {allBanks.map(cb =>
                          c.empresa_id === cb.empresa_id && c.conta_bancaria_id === cb.id
                            ? <td key={cb.id} className={classeValor(c)}>{fmt(c.valor)}</td>
                            : <td key={cb.id} className="celula-vazia">—</td>
                        )}

                        <td><BadgeStatus conta={c} /></td>

                        <td className="col-acoes">
                          {c.status === 'pendente' && c._tipo === 'R' && (
                            <button className="act-ok" title="Marcar recebido" onClick={() => onMarcarRecebido(c.id)}>✓</button>
                          )}
                          {c.status === 'pendente' && c._tipo === 'P' && (
                            <button className="act-ok" title="Marcar pago" onClick={() => onMarcarPago(c.id)}>✓</button>
                          )}
                          <button className="act-edit" title="Editar"  onClick={() => onEditar(c._tipo === 'R' ? 'receber' : 'pagar', c)}>✎</button>
                          <button className="act-del"  title="Excluir" onClick={() => onExcluir(c._tipo, c.id)}>✕</button>
                        </td>

                        {isFirst && (
                          <td rowSpan={entradas.length} className="col-resumo-dia">
                            <ResumoDia res={res} />
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
}
