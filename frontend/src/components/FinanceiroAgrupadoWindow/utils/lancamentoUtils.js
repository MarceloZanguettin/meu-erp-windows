import { mesKey, diaKey } from './dateUtils';
import { fmtMes, fmtDia } from './formatters';

/**
 * Retorna true quando o lançamento está pendente e com vencimento no passado.
 * @param {{ status: string, data_vencimento: string }} conta
 * @returns {boolean}
 */
export function isAtrasado(conta) {
  if (conta.status !== 'pendente') return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const venc = new Date(conta.data_vencimento);
  venc.setHours(0, 0, 0, 0);
  return venc < hoje;
}

/**
 * Retorna a classe CSS da linha de acordo com o status do lançamento.
 * @param {object} conta
 * @returns {string}
 */
export function classeLinha(conta) {
  return isAtrasado(conta) ? 'row-atrasado' : '';
}

/**
 * Retorna a classe CSS da célula de valor de acordo com o tipo (R/P).
 * @param {{ _tipo: 'R'|'P' }} conta
 * @returns {string}
 */
export function classeValor(conta) {
  return conta._tipo === 'R' ? 'col-valor valor-receber' : 'col-valor valor-pagar';
}

/**
 * Agrupa listas de contas a pagar e a receber por mês e depois por dia,
 * ordenadas por data de vencimento crescente.
 *
 * Retorna estrutura:
 * {
 *   "YYYY-MM": {
 *     label: "março de 2026",
 *     dias: {
 *       "YYYY-MM-DD": {
 *         label: "seg., 31/03",
 *         entradas: [...contas com _tipo: 'R'|'P']
 *       }
 *     }
 *   }
 * }
 *
 * @param {object[]} pagarList
 * @param {object[]} receberList
 * @returns {object}
 */
export function agruparPorData(pagarList, receberList) {
  const todos = [
    ...receberList.map(c => ({ ...c, _tipo: 'R' })),
    ...pagarList.map(c  => ({ ...c, _tipo: 'P' })),
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

/**
 * Calcula resumo do saldo corrido por dia, separado por empresa e consolidado.
 *
 * Entradas com importado_excel=true são exibidas na lista mas excluídas do
 * cálculo acumulado — o saldo real dessas datas vem de saldosDiarios.
 *
 * Retorna objeto keyed por "YYYY-MM-DD":
 * {
 *   porEmpresa: { [empresaId]: { recebido, pago, prevRec, prevPag, saldoAnterior, diferenca, saldoFinal } },
 *   porBanco:   { [contaBancariaId]: { ... } },
 *   consolidado: { ... }
 * }
 *
 * @param {object}   grupos          Resultado de agruparPorData()
 * @param {object[]} empresas        Array { id, nome }
 * @param {object[]} contasBancarias Array { id, empresa_id, banco }
 * @param {object[]} saldosDiarios   Array { conta_bancaria_id, data, saldo } — saldo real do Excel
 * @returns {object}
 */
export function calcularResumoDia(grupos, empresas = [], contasBancarias = [], saldosDiarios = []) {
  // Índice de saldos reais: "YYYY-MM-DD|conta_id" → saldo
  const saldoRealIdx = {};
  saldosDiarios.forEach(s => {
    const dk = s.data ? s.data.slice(0, 10) : null;
    if (dk) saldoRealIdx[`${dk}|${s.conta_bancaria_id}`] = s.saldo;
  });

  const saldoEmp   = {};
  const saldoBanco = {};
  empresas.forEach(e => { saldoEmp[e.id] = 0; });
  contasBancarias.forEach(cb => { saldoBanco[cb.id] = 0; });
  let saldoConsolidado = 0;

  const resumo = {};

  // Filtra entradas que devem participar do cálculo de saldo acumulado
  const paraCalculo = lista => lista.filter(c => !c.importado_excel);

  const somarValores = (lista, filtro) =>
    lista.filter(filtro).reduce((s, c) => s + c.valor, 0);

  const calcBloco = (ent, saldoAnt, saldoRealOverride = null) => {
    // Usa apenas lançamentos normais (não importados) para o cálculo
    const calc    = paraCalculo(ent);
    const recebido = somarValores(calc, c => c._tipo === 'R' && c.status === 'recebido');
    const pago     = somarValores(calc, c => c._tipo === 'P' && c.status === 'pago');
    const prevRec  = somarValores(calc, c => c._tipo === 'R' && c.status === 'pendente' && !isAtrasado(c));
    const prevPag  = somarValores(calc, c => c._tipo === 'P' && c.status === 'pendente' && !isAtrasado(c));
    const diferenca  = (recebido + prevRec) - (pago + prevPag);
    // Se existe saldo real do Excel para este dia/banco, ele prevalece sobre o acumulado
    const saldoFinal = saldoRealOverride !== null ? saldoRealOverride : saldoAnt + diferenca;
    return { recebido, pago, prevRec, prevPag, saldoAnterior: saldoAnt, diferenca, saldoFinal };
  };

  Object.values(grupos).forEach(({ dias }) => {
    Object.entries(dias).forEach(([dk, { entradas }]) => {
      // ── Por empresa ──────────────────────────────────────────────
      const porEmpresa = {};
      empresas.forEach(emp => {
        const ent = entradas.filter(c => c.empresa_id === emp.id);
        // Saldo real consolidado da empresa = soma dos saldos reais das contas dela neste dia
        const contasDaEmp = contasBancarias.filter(cb => cb.empresa_id === emp.id);
        const saldoRealEmp = contasDaEmp.reduce((acc, cb) => {
          const sr = saldoRealIdx[`${dk}|${cb.id}`];
          return sr !== undefined ? acc + sr : acc;
        }, null);
        const override = saldoRealEmp !== null && contasDaEmp.some(cb => saldoRealIdx[`${dk}|${cb.id}`] !== undefined)
          ? saldoRealEmp : null;
        porEmpresa[emp.id] = calcBloco(ent, saldoEmp[emp.id], override);
        saldoEmp[emp.id]   = porEmpresa[emp.id].saldoFinal;
      });

      // ── Por banco ─────────────────────────────────────────────────
      const porBanco = {};
      contasBancarias.forEach(cb => {
        const ent = entradas.filter(c => c.conta_bancaria_id === cb.id);
        const saldoReal = saldoRealIdx[`${dk}|${cb.id}`] ?? null;
        porBanco[cb.id]   = calcBloco(ent, saldoBanco[cb.id], saldoReal);
        saldoBanco[cb.id] = porBanco[cb.id].saldoFinal;
      });

      // ── Consolidado ───────────────────────────────────────────────
      // Saldo real consolidado = soma de todos os saldos reais disponíveis neste dia
      const saldosReaisDisponiveis = contasBancarias
        .map(cb => saldoRealIdx[`${dk}|${cb.id}`])
        .filter(v => v !== undefined);
      const saldoRealCons = saldosReaisDisponiveis.length > 0
        ? saldosReaisDisponiveis.reduce((a, b) => a + b, 0)
        : null;
      const consBloco = calcBloco(entradas, saldoConsolidado, saldoRealCons);
      saldoConsolidado = consBloco.saldoFinal;

      resumo[dk] = { porEmpresa, porBanco, consolidado: consBloco };
    });
  });

  return resumo;
}
