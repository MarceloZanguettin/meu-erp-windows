const API = 'http://localhost:8050';

const NUMERICOS = ['fornecedor_id', 'codigo', 'cod_fornecedor'];

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
  throw new Error(err.detail || 'Erro ao salvar dado bancário do fornecedor');
}

export async function listarFornecedoresBanco(fornecedorId) {
  const r = await fetch(`${API}/fornecedores-banco?fornecedor_id=${encodeURIComponent(fornecedorId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarFornecedorBanco(dados) {
  const r = await fetch(`${API}/fornecedores-banco`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarFornecedorBanco(id, dados) {
  const r = await fetch(`${API}/fornecedores-banco/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarFornecedorBanco(id) {
  const r = await fetch(`${API}/fornecedores-banco/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
