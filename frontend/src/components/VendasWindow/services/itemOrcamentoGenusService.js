const API = 'http://localhost:8050';

// Campos GENUS.ORCAMENTO2 do tipo inteiro/decimal — precisam virar Number antes de enviar
const NUMERICOS = [
  'orcamento_id', 'produto_id', 'codigo', 'cod_empresa', 'cod_orcamento',
  'qtde', 'unitario', 'custo', 'desconto', 'per_desconto', 'frete', 'total', 'ipi',
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
  throw new Error(err.detail || 'Erro ao salvar item de orçamento (GENUS)');
}

export async function listarItensOrcamentoGenus(orcamentoId) {
  const r = await fetch(`${API}/itens-orcamento-genus?orcamento_id=${encodeURIComponent(orcamentoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarItemOrcamentoGenus(dados) {
  const r = await fetch(`${API}/itens-orcamento-genus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarItemOrcamentoGenus(id, dados) {
  const r = await fetch(`${API}/itens-orcamento-genus/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarItemOrcamentoGenus(id) {
  const r = await fetch(`${API}/itens-orcamento-genus/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
