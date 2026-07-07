const API = 'http://localhost:8050';

async function tratarErro(r) {
  const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
  throw new Error(err.detail || 'Erro ao salvar saída');
}

export async function listarSaidas(busca) {
  const qs = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  const r = await fetch(`${API}/saidas${qs}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function buscarSaida(id) {
  const r = await fetch(`${API}/saidas/${id}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarSaida(dados) {
  const r = await fetch(`${API}/saidas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarSaida(id, dados) {
  const r = await fetch(`${API}/saidas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarSaida(id) {
  const r = await fetch(`${API}/saidas/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
