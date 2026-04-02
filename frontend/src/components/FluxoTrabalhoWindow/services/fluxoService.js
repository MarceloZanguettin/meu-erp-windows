const BASE = 'http://localhost:8050/financeiro';

/**
 * Busca todos os lançamentos de um tipo.
 * @param {'pagar'|'receber'} tipo
 * @returns {Promise<object[]>}
 */
export async function fetchContas(tipo) {
  const endpoint = tipo === 'receber' ? 'contas-receber' : 'contas-pagar';
  const r = await fetch(`${BASE}/${endpoint}`);
  if (!r.ok) throw new Error('Erro ao carregar contas');
  return r.json();
}

/**
 * Cria ou atualiza um lançamento.
 * @param {'pagar'|'receber'} tipo
 * @param {object}            payload
 * @param {number|null}       editandoId  null para criação
 */
export async function salvarConta(tipo, payload, editandoId) {
  const endpoint = tipo === 'receber' ? 'contas-receber' : 'contas-pagar';
  const url      = editandoId ? `${BASE}/${endpoint}/${editandoId}` : `${BASE}/${endpoint}`;
  const method   = editandoId ? 'PUT' : 'POST';
  const r = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail ?? 'Erro ao salvar');
  }
  return r.json();
}

/**
 * Baixa um lançamento (marca como pago ou recebido).
 * @param {'pagar'|'receber'} tipo
 * @param {number}            id
 */
export async function baixarConta(tipo, id) {
  const acao     = tipo === 'receber' ? 'receber' : 'pagar';
  const endpoint = tipo === 'receber' ? 'contas-receber' : 'contas-pagar';
  const r = await fetch(`${BASE}/${endpoint}/${id}/${acao}`, { method: 'PATCH' });
  return r.json();
}

/**
 * Exclui um lançamento.
 * @param {'pagar'|'receber'} tipo
 * @param {number}            id
 */
export async function excluirConta(tipo, id) {
  const endpoint = tipo === 'receber' ? 'contas-receber' : 'contas-pagar';
  const r = await fetch(`${BASE}/${endpoint}/${id}`, { method: 'DELETE' });
  return r.json();
}
