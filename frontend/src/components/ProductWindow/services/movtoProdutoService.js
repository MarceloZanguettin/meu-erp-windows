const API = 'http://localhost:8050';

const NUMERICOS = [
  'produto_id', 'cod_movto', 'cod_empresa',
  'qtde', 'valor', 'total', 'perc_comissao', 'cal_comissao', 'val_comissao',
  'cod_empresa_producao', 'codigo_producao',
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
  throw new Error(err.detail || 'Erro ao salvar movimento do produto');
}

export async function listarMovtoProdutos(produtoId) {
  const r = await fetch(`${API}/movto-produtos?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarMovtoProduto(dados) {
  const r = await fetch(`${API}/movto-produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarMovtoProduto(id, dados) {
  const r = await fetch(`${API}/movto-produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarMovtoProduto(id) {
  const r = await fetch(`${API}/movto-produtos/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
