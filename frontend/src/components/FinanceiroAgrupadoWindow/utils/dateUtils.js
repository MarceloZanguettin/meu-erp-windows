/**
 * Converte um objeto Date (ou string ISO) para "YYYY-MM-DD".
 * @param {Date|string} d
 * @returns {string}
 */
export function dateToStr(d) {
  const dd = new Date(d);
  return [
    dd.getFullYear(),
    String(dd.getMonth() + 1).padStart(2, '0'),
    String(dd.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * Retorna a data de hoje no formato "YYYY-MM-DD".
 * @returns {string}
 */
export function todayStr() {
  return dateToStr(new Date());
}

/**
 * Adiciona (ou subtrai, se n negativo) dias a uma data no formato "YYYY-MM-DD".
 * @param {string} ds  Data base no formato "YYYY-MM-DD"
 * @param {number} n   Número de dias a adicionar
 * @returns {string}
 */
export function addDays(ds, n) {
  const d = new Date(ds + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return dateToStr(d);
}

/**
 * Extrai a chave de mês "YYYY-MM" de uma string ISO.
 * @param {string} isoStr
 * @returns {string}
 */
export function mesKey(isoStr) {
  const d = new Date(isoStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Extrai a chave de dia "YYYY-MM-DD" de uma string ISO.
 * @param {string} isoStr
 * @returns {string}
 */
export function diaKey(isoStr) {
  const d = new Date(isoStr);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}
