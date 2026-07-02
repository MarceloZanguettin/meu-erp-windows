const BASE_URL = 'http://localhost:8050/financeiro';

/**
 * Busca empresas cadastradas.
 * @returns {Promise<object[]>}
 */
export async function fetchEmpresas() {
  const r = await fetch(`${BASE_URL}/empresas`);
  return r.json();
}

/**
 * Busca contas bancárias. Filtrável por empresa.
 * @param {number|null} empresaId
 * @returns {Promise<object[]>}
 */
export async function fetchContasBancarias(empresaId = null) {
  const url = empresaId
    ? `${BASE_URL}/contas-bancarias?empresa_id=${empresaId}`
    : `${BASE_URL}/contas-bancarias`;
  const r = await fetch(url);
  return r.json();
}

/**
 * Busca contas a pagar e a receber dentro de um intervalo de datas de vencimento.
 * @param {string} inicio  "YYYY-MM-DD"
 * @param {string} fim     "YYYY-MM-DD"
 * @returns {Promise<{ pagar: object[], receber: object[] }>}
 */
export async function fetchLancamentosIntervalo(inicio, fim) {
  const params = `data_inicio=${inicio}&data_fim=${fim}`;
  const [pagar, receber] = await Promise.all([
    fetch(`${BASE_URL}/contas-pagar?${params}`).then(r => r.json()),
    fetch(`${BASE_URL}/contas-receber?${params}`).then(r => r.json()),
  ]);
  return { pagar, receber };
}

/**
 * Cria ou atualiza um lançamento.
 * @param {'pagar'|'receber'} tipo
 * @param {object}            body
 * @param {number|null}       id   null para criação
 * @returns {Promise<object>}
 */
export async function salvarLancamento(tipo, body, id = null) {
  const endpoint = tipo === 'pagar' ? 'contas-pagar' : 'contas-receber';
  const url    = id ? `${BASE_URL}/${endpoint}/${id}` : `${BASE_URL}/${endpoint}`;
  const method = id ? 'PUT' : 'POST';
  const r = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

/**
 * Registra a baixa de uma conta a pagar (status → "pago").
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function marcarContaPago(id) {
  const r = await fetch(`${BASE_URL}/contas-pagar/${id}/pagar`, { method: 'PATCH' });
  return r.json();
}

/**
 * Registra o recebimento de uma conta a receber (status → "recebido").
 * @param {number} id
 * @returns {Promise<object>}
 */
export async function marcarContaRecebido(id) {
  const r = await fetch(`${BASE_URL}/contas-receber/${id}/receber`, { method: 'PATCH' });
  return r.json();
}

/**
 * Estorna o status de uma conta para "pendente" (desfaz pago/recebido).
 * @param {'P'|'R'} tipo
 * @param {number}  id
 * @returns {Promise<object>}
 */
export async function estornarLancamento(tipo, id) {
  const endpoint = tipo === 'P' ? 'contas-pagar' : 'contas-receber';
  const r = await fetch(`${BASE_URL}/${endpoint}/${id}/estornar`, { method: 'PATCH' });
  return r.json();
}

/**
 * Exclui um lançamento.
 * @param {'P'|'R'} tipo
 * @param {number}  id
 * @returns {Promise<object>}
 */
export async function excluirLancamento(tipo, id) {
  const endpoint = tipo === 'P' ? 'contas-pagar' : 'contas-receber';
  const r = await fetch(`${BASE_URL}/${endpoint}/${id}`, { method: 'DELETE' });
  return r.json();
}

/**
 * Busca saldos diários reais por conta bancária (importados do Excel).
 * @param {string} inicio  "YYYY-MM-DD"
 * @param {string} fim     "YYYY-MM-DD"
 * @returns {Promise<object[]>}  [{conta_bancaria_id, data, saldo, coluna_excel}]
 */
export async function fetchSaldosDiarios(inicio, fim) {
  const params = `data_inicio=${inicio}&data_fim=${fim}`;
  const r = await fetch(`${BASE_URL}/saldos-diarios?${params}`);
  return r.json();
}
