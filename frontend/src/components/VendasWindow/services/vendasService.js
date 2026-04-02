const BASE = 'http://localhost:8050/vendas';

export async function fetchOrcamentos() {
  const r = await fetch(`${BASE}/orcamentos`);
  if (!r.ok) throw new Error('Erro ao carregar orçamentos');
  return r.json();
}

export async function fetchPedidosVenda() {
  const r = await fetch(`${BASE}/pedidos`);
  if (!r.ok) throw new Error('Erro ao carregar pedidos de venda');
  return r.json();
}

export async function salvarOrcamento(payload, id = null) {
  const url = id ? `${BASE}/orcamentos/${id}` : `${BASE}/orcamentos`;
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

export async function aprovarOrcamento(id) {
  const r = await fetch(`${BASE}/orcamentos/${id}/aprovar`, { method: 'PATCH' });
  if (!r.ok) throw new Error('Erro ao aprovar orçamento');
  return r.json();
}

export async function converterOrcamento(id) {
  const r = await fetch(`${BASE}/orcamentos/${id}/converter`, { method: 'PATCH' });
  if (!r.ok) throw new Error('Erro ao converter orçamento');
  return r.json();
}

export async function excluirOrcamento(id) {
  await fetch(`${BASE}/orcamentos/${id}`, { method: 'DELETE' });
}

export async function salvarPedidoVenda(payload, id = null) {
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

export async function faturarPedidoVenda(id) {
  const r = await fetch(`${BASE}/pedidos/${id}/faturar`, { method: 'PATCH' });
  if (!r.ok) throw new Error('Erro ao faturar pedido');
  return r.json();
}

export async function excluirPedidoVenda(id) {
  await fetch(`${BASE}/pedidos/${id}`, { method: 'DELETE' });
}

export async function fetchRepresentantes() {
  try {
    const r = await fetch('http://localhost:8050/cadastros/representantes');
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
