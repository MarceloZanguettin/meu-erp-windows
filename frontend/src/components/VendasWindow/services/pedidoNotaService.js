const API = 'http://localhost:8050';

// Campos GENUS.PEDIDONOTA do tipo inteiro — precisam virar Number antes de enviar
const NUMERICOS = ['pedido_id', 'saida_id', 'cod_empresa', 'cod_pedido', 'cod_saida', 'cod_empresa_saida'];

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
  throw new Error(err.detail || 'Erro ao salvar vínculo pedido-nota fiscal (GENUS)');
}

export async function listarPedidosNota(pedidoId) {
  const r = await fetch(`${API}/pedidos-nota?pedido_id=${encodeURIComponent(pedidoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarPedidoNota(dados) {
  const r = await fetch(`${API}/pedidos-nota`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarPedidoNota(id, dados) {
  const r = await fetch(`${API}/pedidos-nota/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarPedidoNota(id) {
  const r = await fetch(`${API}/pedidos-nota/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
