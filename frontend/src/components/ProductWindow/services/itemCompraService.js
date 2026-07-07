const API = 'http://localhost:8050';

// Campos GENUS.COMPRASLAN do tipo inteiro/decimal — precisam virar Number antes de enviar
const NUMERICOS = [
  'produto_id', 'cod_compras', 'cod_empresa',
  'unitario', 'custo_real', 'desconto', 'outros_valores', 'taxa_fornecedor',
  'total', 'qtde', 'cpr',
  'kgmt', 'kgmt_total', 'unde',
  'ipi', 'ipi_valor', 'st',
];

function normalizar(dados) {
  const out = { ...dados };
  for (const campo of NUMERICOS) {
    if (out[campo] === '' || out[campo] === undefined || out[campo] === null) {
      delete out[campo];
    } else {
      out[campo] = Number(out[campo]);
    }
  }
  for (const campo of Object.keys(out)) {
    if (out[campo] === '') delete out[campo];
  }
  return out;
}

async function tratarErro(r) {
  const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
  throw new Error(err.detail || 'Erro ao salvar item de compra');
}

export async function listarItensCompra(produtoId) {
  const r = await fetch(`${API}/itens-compra?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarItemCompra(dados) {
  const r = await fetch(`${API}/itens-compra`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarItemCompra(id, dados) {
  const r = await fetch(`${API}/itens-compra/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarItemCompra(id) {
  const r = await fetch(`${API}/itens-compra/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
