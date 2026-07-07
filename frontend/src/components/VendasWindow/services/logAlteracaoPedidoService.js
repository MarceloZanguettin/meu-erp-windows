const API = 'http://localhost:8050';

// Campos GENUS.LOGALTERACAOPEDIDO do tipo inteiro — precisam virar Number antes de enviar
const NUMERICOS = ['pedido_id', 'cod_empresa', 'cod_pedido', 'cod_funcionario_logado'];

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
  throw new Error(err.detail || 'Erro ao salvar log de alteração de pedido (GENUS)');
}

export async function listarLogsAlteracaoPedido(pedidoId) {
  const r = await fetch(`${API}/logs-alteracao-pedido?pedido_id=${encodeURIComponent(pedidoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarLogAlteracaoPedido(dados) {
  const r = await fetch(`${API}/logs-alteracao-pedido`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarLogAlteracaoPedido(id, dados) {
  const r = await fetch(`${API}/logs-alteracao-pedido/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarLogAlteracaoPedido(id) {
  const r = await fetch(`${API}/logs-alteracao-pedido/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
