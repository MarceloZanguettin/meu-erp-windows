const API = 'http://localhost:8050';

// Campos GENUS.SAIDADEVOLUCAO do tipo inteiro — precisam virar Number antes de enviar
const NUMERICOS = [
  'saida_id', 'cod_empresa', 'cod_saida', 'codigo',
  'saida_codigo', 'saida_cod_empresa',
  'entrada_cod_empresa', 'entrada_doc', 'entrada_cod_fornecedor',
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
  throw new Error(err.detail || 'Erro ao salvar devolução de saída (GENUS)');
}

export async function listarSaidasDevolucao(saidaId) {
  const r = await fetch(`${API}/saidas-devolucao?saida_id=${encodeURIComponent(saidaId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarSaidaDevolucao(dados) {
  const r = await fetch(`${API}/saidas-devolucao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarSaidaDevolucao(id, dados) {
  const r = await fetch(`${API}/saidas-devolucao/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarSaidaDevolucao(id) {
  const r = await fetch(`${API}/saidas-devolucao/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
