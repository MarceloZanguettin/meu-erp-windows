const API = 'http://localhost:8050';

const NUMERICOS = ['cliente_id', 'cod_cliente'];

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
  throw new Error(err.detail || 'Erro ao salvar CNAE do cliente');
}

export async function listarClientesCnae(clienteId) {
  const r = await fetch(`${API}/clientes-cnae?cliente_id=${encodeURIComponent(clienteId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarClienteCnae(dados) {
  const r = await fetch(`${API}/clientes-cnae`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarClienteCnae(id, dados) {
  const r = await fetch(`${API}/clientes-cnae/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarClienteCnae(id) {
  const r = await fetch(`${API}/clientes-cnae/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
