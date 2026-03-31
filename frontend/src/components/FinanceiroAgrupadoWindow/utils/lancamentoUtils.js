import { mesKey, diaKey } from './dateUtils';
import { fmtMes, fmtDia } from './formatters';

/**
 * Retorna true quando o lançamento está pendente e com vencimento no passado.
 * @param {{ status: string, data_vencimento: string }} conta
 * @returns {boolean}
 */
export function isAtrasado(conta) {
  return conta.status === 'pendente' && new Date(conta.data_vencimento) < new Date();
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
 * Calcula o resumo de saldo corrido por dia a partir de um mapa de grupos.
 * Retorna um objeto keyed por "YYYY-MM-DD" com:
 *   recebido, pago, prevRec, prevPag, saldoAnterior, diferenca, saldoFinal
 *
 * @param {object} grupos  Resultado de agruparPorData()
 * @returns {object}
 */
export function calcularResumoDia(grupos) {
  let saldoCorrido = 0;
  const resumo = {};

  Object.values(grupos).forEach(({ dias }) => {
    Object.entries(dias).forEach(([dk, { entradas }]) => {
      const recebido = entradas
        .filter(c => c._tipo === 'R' && c.status === 'recebido')
        .reduce((s, c) => s + c.valor, 0);

      const pago = entradas
        .filter(c => c._tipo === 'P' && c.status === 'pago')
        .reduce((s, c) => s + c.valor, 0);

      const prevRec = entradas
        .filter(c => c._tipo === 'R' && c.status === 'pendente' && !isAtrasado(c))
        .reduce((s, c) => s + c.valor, 0);

      const prevPag = entradas
        .filter(c => c._tipo === 'P' && c.status === 'pendente' && !isAtrasado(c))
        .reduce((s, c) => s + c.valor, 0);

      const saldoAnterior = saldoCorrido;
      const diferenca     = (recebido + prevRec) - (pago + prevPag);
      saldoCorrido       += diferenca;

      resumo[dk] = { recebido, pago, prevRec, prevPag, saldoAnterior, diferenca, saldoFinal: saldoCorrido };
    });
  });

  return resumo;
}
