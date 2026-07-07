const API = 'http://localhost:8050';

const NUMERICOS = [
  'produto_id', 'cod_grupo', 'cod_subgrupo', 'cod_marca', 'qtde_embalagem',
  'cod_classificacao', 'margem_lucro', 'peso_liquido', 'peso_bruto',
  'validade_dias', 'cubicagem', 'multiplo_producao', 'cod_cor',
  'cod_alteracao', 'cod_funcionario_inclusao', 'cod_funcionario_alteracao',
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
  throw new Error(err.detail || 'Erro ao salvar registro de produto excluído');
}

export async function listarProdutosExcluidos(produtoId) {
  const r = await fetch(`${API}/produtos-excluidos?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarProdutoExcluido(dados) {
  const r = await fetch(`${API}/produtos-excluidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarProdutoExcluido(id, dados) {
  const r = await fetch(`${API}/produtos-excluidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarProdutoExcluido(id) {
  const r = await fetch(`${API}/produtos-excluidos/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
