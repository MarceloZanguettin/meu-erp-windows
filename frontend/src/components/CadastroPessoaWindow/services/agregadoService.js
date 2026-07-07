const API = 'http://localhost:8050';

// Campos numéricos de GENUS.AGREGADOS — convertidos para Number antes de
// enviar ao backend (ou removidos do payload quando vazios).
const NUMERICOS = ['cadastro_pessoa_id', 'cod_cadastro', 'codigo', 'cod_cidade'];

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
  throw new Error(err.detail || 'Erro ao salvar agregado');
}

/**
 * Agregados (GENUS.AGREGADOS) de um cadastro (CadastroPessoa) já cadastrado
 * — tabela filha 1:N via cadastro_pessoa_id.
 */
export async function listarAgregados(cadastroPessoaId) {
  const r = await fetch(`${API}/agregados?cadastro_pessoa_id=${encodeURIComponent(cadastroPessoaId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarAgregado(dados) {
  const r = await fetch(`${API}/agregados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarAgregado(id, dados) {
  const r = await fetch(`${API}/agregados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarAgregado(id) {
  const r = await fetch(`${API}/agregados/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
