const BASE = 'http://localhost:8050/compras';

export async function fetchSolicitacoes() {
  const r = await fetch(`${BASE}/solicitacoes`);
  if (!r.ok) throw new Error('Erro ao carregar solicitações');
  return r.json();
}

export async function fetchPedidos() {
  const r = await fetch(`${BASE}/pedidos`);
  if (!r.ok) throw new Error('Erro ao carregar pedidos de compra');
  return r.json();
}

export async function salvarSolicitacao(payload, id = null) {
  const url = id ? `${BASE}/solicitacoes/${id}` : `${BASE}/solicitacoes`;
  const r = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(err.detail || 'Erro ao salvar');
  }
  return r.json();
}

export async function aprovarSolicitacao(id) {
  const r = await fetch(`${BASE}/solicitacoes/${id}/aprovar`, { method: 'PATCH' });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: 'Erro ao aprovar' }));
    throw new Error(err.detail);
  }
  return r.json();
}

export async function excluirSolicitacao(id) {
  await fetch(`${BASE}/solicitacoes/${id}`, { method: 'DELETE' });
}

export async function salvarPedido(payload, id = null) {
  const url = id ? `${BASE}/pedidos/${id}` : `${BASE}/pedidos`;
  const r = await fetch(url, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(err.detail || 'Erro ao salvar');
  }
  return r.json();
}

export async function receberPedido(id) {
  const r = await fetch(`${BASE}/pedidos/${id}/receber`, { method: 'PATCH' });
  if (!r.ok) {
    const err = await r.json().catch(() => ({ detail: 'Erro ao receber' }));
    throw new Error(err.detail);
  }
  return r.json();
}

export async function excluirPedido(id) {
  await fetch(`${BASE}/pedidos/${id}`, { method: 'DELETE' });
}

export async function fetchFornecedores() {
  try {
    const r = await fetch('http://localhost:8050/cadastros/fornecedores');
    if (!r.ok) return [];
    return r.json();
  } catch { return []; }
}

export async function fetchFormasPagamento() {
  try {
    const r = await fetch('http://localhost:8050/cadastros/formas-pagamento');
    if (!r.ok) return [];
    return r.json();
  } catch { return []; }
}
