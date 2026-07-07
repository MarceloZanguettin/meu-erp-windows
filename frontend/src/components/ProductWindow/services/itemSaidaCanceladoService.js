const API = 'http://localhost:8050';

// Campos GENUS.SAILAN_CANCELADA do tipo inteiro/decimal — precisam virar Number antes de enviar
const NUMERICOS = [
  'produto_id', 'cod_empresa', 'cod_saida', 'cod_sailan',
  'qtde', 'unitario', 'total', 'desconto', 'per_desconto', 'frete',
  'perc_comissao', 'cal_comissao', 'val_comissao',
  'icms', 'reducao_icms', 'iva', 'ipi',
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
  throw new Error(err.detail || 'Erro ao salvar item de saída cancelado');
}

export async function listarItensSaidaCancelados(produtoId) {
  const r = await fetch(`${API}/itens-saida-cancelados?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarItemSaidaCancelado(dados) {
  const r = await fetch(`${API}/itens-saida-cancelados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarItemSaidaCancelado(id, dados) {
  const r = await fetch(`${API}/itens-saida-cancelados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarItemSaidaCancelado(id) {
  const r = await fetch(`${API}/itens-saida-cancelados/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
