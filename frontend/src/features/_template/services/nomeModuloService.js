/**
 * Service — chamadas de API puras (sem estado React).
 * Usado pelo hook via TanStack Query.
 */
const BASE = 'http://localhost:8050/nome-modulo';

export async function fetchItens() {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error('Erro ao carregar');
  return r.json();
}

export async function criarItem(dados) {
  const r = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(err.detail);
  }
  return r.json();
}

export async function editarItem(id, dados) {
  const r = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(err.detail);
  }
  return r.json();
}

export async function excluirItem(id) {
  await fetch(`${BASE}/${id}`, { method: 'DELETE' });
}
