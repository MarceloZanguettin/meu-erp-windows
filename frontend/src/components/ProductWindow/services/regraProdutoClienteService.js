const API = 'http://localhost:8050';

const NUMERICOS = ['produto_id', 'cod_regras', 'cod_cliente'];

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
  throw new Error(err.detail || 'Erro ao salvar regra de produto por cliente');
}

export async function listarRegrasProdutoCliente(produtoId) {
  const r = await fetch(`${API}/regras-produto-cliente?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarRegraProdutoCliente(dados) {
  const r = await fetch(`${API}/regras-produto-cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarRegraProdutoCliente(id, dados) {
  const r = await fetch(`${API}/regras-produto-cliente/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarRegraProdutoCliente(id) {
  const r = await fetch(`${API}/regras-produto-cliente/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
