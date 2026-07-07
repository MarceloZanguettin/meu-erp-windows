const API = 'http://localhost:8050';

const NUMERICOS = ['cliente_id', 'cod_cadastro', 'cod_empresa'];

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
  throw new Error(err.detail || 'Erro ao salvar vínculo cliente-empresa');
}

export async function listarClientesEmpresa(clienteId) {
  const r = await fetch(`${API}/clientes-empresa?cliente_id=${encodeURIComponent(clienteId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarClienteEmpresa(dados) {
  const r = await fetch(`${API}/clientes-empresa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarClienteEmpresa(id, dados) {
  const r = await fetch(`${API}/clientes-empresa/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarClienteEmpresa(id) {
  const r = await fetch(`${API}/clientes-empresa/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
