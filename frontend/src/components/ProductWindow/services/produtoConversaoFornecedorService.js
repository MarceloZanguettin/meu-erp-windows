const API = 'http://localhost:8050';

const NUMERICOS = ['produto_id', 'cod_fornecedor', 'fator_conversao'];

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
  throw new Error(err.detail || 'Erro ao salvar conversão de fornecedor do produto');
}

export async function listarProdutoConversoesFornecedor(produtoId) {
  const r = await fetch(`${API}/produto-conversoes-fornecedor?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarProdutoConversaoFornecedor(dados) {
  const r = await fetch(`${API}/produto-conversoes-fornecedor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarProdutoConversaoFornecedor(id, dados) {
  const r = await fetch(`${API}/produto-conversoes-fornecedor/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarProdutoConversaoFornecedor(id) {
  const r = await fetch(`${API}/produto-conversoes-fornecedor/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
