const API = 'http://localhost:8050';

const NUMERICOS = [
  'estoque', 'preco', 'custo', 'margem_lucro', 'preco_minimo', 'preco_atacado',
  'peso_bruto', 'peso_liquido', 'cod_grupo', 'cod_subgrupo',
];

function normalizar(form) {
  const dados = { ...form };
  for (const campo of NUMERICOS) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    } else {
      dados[campo] = Number(dados[campo]);
    }
  }
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '') delete dados[campo];
  }
  return dados;
}

async function tratarErro(r) {
  const err = await r.json().catch(() => ({ detail: 'Erro desconhecido' }));
  throw new Error(err.detail || 'Erro ao salvar produto');
}

export async function criarProduto(form) {
  const r = await fetch(`${API}/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(form)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarProduto(id, form) {
  const r = await fetch(`${API}/produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(form)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function listarProdutos(busca) {
  const query = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  const r = await fetch(`${API}/produtos${query}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}
