/**
 * Formata um número como moeda BRL (R$ 1.234,56).
 * @param {number} v
 * @returns {string}
 */
export function fmt(v) {
  return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Formata uma string ISO como "março de 2026".
 * @param {string} isoStr
 * @returns {string}
 */
export function fmtMes(isoStr) {
  return new Date(isoStr).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

/**
 * Formata uma string ISO como "seg., 31/03".
 * @param {string} isoStr
 * @returns {string}
 */
export function fmtDia(isoStr) {
  return new Date(isoStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    weekday: 'short',
  });
}
