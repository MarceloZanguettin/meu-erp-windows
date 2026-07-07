const API = 'http://localhost:8050';

const NUMERICOS = ['produto_id', 'codigo', 'cod_cliente', 'cod_classificacao'];

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
  throw new Error(err.detail || 'Erro ao salvar regra de cliente');
}

export async function listarRegrasCliente(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.codClassificacao) params.set('cod_classificacao', filtros.codClassificacao);
  if (filtros.codCliente) params.set('cod_cliente', filtros.codCliente);
  if (filtros.busca) params.set('busca', filtros.busca);
  const query = params.toString();
  const r = await fetch(`${API}/regras-cliente${query ? `?${query}` : ''}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarRegraCliente(dados) {
  const r = await fetch(`${API}/regras-cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarRegraCliente(id, dados) {
  const r = await fetch(`${API}/regras-cliente/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarRegraCliente(id) {
  const r = await fetch(`${API}/regras-cliente/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
