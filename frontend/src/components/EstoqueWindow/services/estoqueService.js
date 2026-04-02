const BASE = 'http://localhost:8050/estoque';

export async function fetchPosicao(busca = '') {
  const qs = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  const r = await fetch(`${BASE}/posicao${qs}`);
  if (!r.ok) throw new Error('Erro ao carregar posição de estoque');
  return r.json();
}

export async function fetchMovimentos(filtros = {}) {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(filtros).filter(([, v]) => v !== '' && v != null))
  ).toString();
  const url = qs ? `${BASE}/movimentos?${qs}` : `${BASE}/movimentos`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('Erro ao carregar movimentos');
  return r.json();
}

export async function registrarMovimento(payload) {
  const r = await fetch(`${BASE}/movimentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(err.detail || 'Erro ao registrar movimento');
  }
  return r.json();
}

export async function fetchProdutos() {
  try {
    const r = await fetch('http://localhost:8050/produtos/');
    if (!r.ok) return [];
    return r.json();
  } catch {
    return [];
  }
}

export async function fetchDepositos() {
  try {
    const r = await fetch('http://localhost:8050/cadastros/depositos');
    if (!r.ok) return [];
    return r.json();
  } catch {
    return [];
  }
}
