const API = 'http://localhost:8050';

// Campos GENUS.NOTAXML do tipo inteiro — precisam virar Number antes de enviar
const NUMERICOS = ['saida_id', 'cod_empresa', 'cod_saida'];

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
  throw new Error(err.detail || 'Erro ao salvar XML de NF-e (GENUS)');
}

export async function listarNotasXml(saidaId) {
  const r = await fetch(`${API}/notas-xml?saida_id=${encodeURIComponent(saidaId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarNotaXml(dados) {
  const r = await fetch(`${API}/notas-xml`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarNotaXml(id, dados) {
  const r = await fetch(`${API}/notas-xml/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarNotaXml(id) {
  const r = await fetch(`${API}/notas-xml/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
