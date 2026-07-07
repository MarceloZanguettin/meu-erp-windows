const API = 'http://localhost:8050';

// Campos GENUS.ENTRADAFRETE do tipo inteiro — precisam virar Number antes de enviar
const NUMERICOS = [
  'entrada_id', 'cod_empresa', 'doc', 'cod_fornecedor',
  'cod_empresa2', 'doc2', 'cod_fornecedor2',
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
  throw new Error(err.detail || 'Erro ao salvar frete de entrada');
}

export async function listarEntradasFrete(entradaId) {
  const r = await fetch(`${API}/entradas-frete?entrada_id=${encodeURIComponent(entradaId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarEntradaFrete(dados) {
  const r = await fetch(`${API}/entradas-frete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarEntradaFrete(id, dados) {
  const r = await fetch(`${API}/entradas-frete/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarEntradaFrete(id) {
  const r = await fetch(`${API}/entradas-frete/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
