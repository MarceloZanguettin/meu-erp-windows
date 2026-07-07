const API = 'http://localhost:8050';

const NUMERICOS = [
  'produto_id', 'cod_empresa', 'codigo',
  'cod_funcionario', 'cod_solicitante', 'cod_pedido_lan', 'cod_producao_etapas',
  'cod_funcionario_audita', 'cod_funcionario_fecha',
  'qtde_fisico', 'qtde_fisico_pedido', 'qtde', 'qtde_produzida',
  'total_produzido_real', 'porcentagem', 'aparas', 'estoque',
  'espessura', 'largura', 'comprimento', 'linear',
  'variacao_espessura', 'variacao_largura', 'variacao_comprimento',
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
  throw new Error(err.detail || 'Erro ao salvar registro de produção do produto');
}

export async function listarProdutoProducoes(produtoId) {
  const r = await fetch(`${API}/produto-producoes?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarProdutoProducao(dados) {
  const r = await fetch(`${API}/produto-producoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarProdutoProducao(id, dados) {
  const r = await fetch(`${API}/produto-producoes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarProdutoProducao(id) {
  const r = await fetch(`${API}/produto-producoes/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
