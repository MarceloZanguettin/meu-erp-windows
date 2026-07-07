const API = 'http://localhost:8050';

const NUMERICOS = ['cliente_id', 'codigo', 'cod_cliente', 'cod_funcionario'];

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
  throw new Error(err.detail || 'Erro ao salvar atendimento do cliente');
}

export async function listarClientesAtendimento(clienteId) {
  const r = await fetch(`${API}/clientes-atendimento?cliente_id=${encodeURIComponent(clienteId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarClienteAtendimento(dados) {
  const r = await fetch(`${API}/clientes-atendimento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarClienteAtendimento(id, dados) {
  const r = await fetch(`${API}/clientes-atendimento/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarClienteAtendimento(id) {
  const r = await fetch(`${API}/clientes-atendimento/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
