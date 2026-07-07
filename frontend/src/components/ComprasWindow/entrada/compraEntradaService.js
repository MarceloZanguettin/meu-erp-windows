const API = 'http://localhost:8050';

// Campos GENUS.COMPRAENTRADA do tipo inteiro — precisam virar Number antes de enviar
const NUMERICOS = [
  'entrada_id', 'compra_id', 'cod_empresa', 'doc', 'cod_fornecedor', 'cod_compras',
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
  throw new Error(err.detail || 'Erro ao salvar vínculo compra-entrada');
}

export async function listarComprasEntrada(entradaId) {
  const r = await fetch(`${API}/compras-entrada?entrada_id=${encodeURIComponent(entradaId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarCompraEntrada(dados) {
  const r = await fetch(`${API}/compras-entrada`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarCompraEntrada(id, dados) {
  const r = await fetch(`${API}/compras-entrada/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarCompraEntrada(id) {
  const r = await fetch(`${API}/compras-entrada/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
