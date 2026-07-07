const API = 'http://localhost:8050';

// Campos numéricos de GENUS.CADASTROCONTATO — convertidos para Number antes
// de enviar ao backend (ou removidos do payload quando vazios).
const NUMERICOS = ['cadastro_pessoa_id', 'codigo', 'cod_setor'];

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
  throw new Error(err.detail || 'Erro ao salvar contato de cadastro');
}

/**
 * Contatos adicionais (GENUS.CADASTROCONTATO) de um cadastro (CadastroPessoa)
 * já cadastrado — tabela filha 1:N via cadastro_pessoa_id.
 */
export async function listarContatosCadastro(cadastroPessoaId) {
  const r = await fetch(`${API}/cadastro-contatos?cadastro_pessoa_id=${encodeURIComponent(cadastroPessoaId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarContatoCadastro(dados) {
  const r = await fetch(`${API}/cadastro-contatos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarContatoCadastro(id, dados) {
  const r = await fetch(`${API}/cadastro-contatos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarContatoCadastro(id) {
  const r = await fetch(`${API}/cadastro-contatos/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
