const API = 'http://localhost:8050';

// Campos GENUS.DELSAILAN do tipo inteiro/decimal — precisam virar Number antes de enviar
const NUMERICOS = [
  'produto_id', 'cod_empresa', 'cod_saida',
  'qtde', 'unitario', 'total', 'custo', 'desconto', 'per_desconto', 'frete', 'seguro', 'outras',
  'perc_comissao', 'cal_comissao', 'val_comissao',
  'icms', 'icms_base', 'icms_valor', 'icms_outras', 'icms_isento', 'reducao_icms', 'iva',
  'icmsst', 'reducao_icmsst', 'icms_base_subst', 'icms_valor_subst',
  'ipi', 'ipi_valor', 'ipi_base_calculo',
  'pis_valor', 'pis_base', 'pis_aliquota', 'quantidade_pis', 'aliq_pis_reais',
  'cofins_valor', 'cofins_base', 'cofins_aliquota', 'quantidade_cofins', 'aliq_cofins_reais',
  'cod_romaneio',
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
  throw new Error(err.detail || 'Erro ao salvar item de saída excluído');
}

export async function listarItensSaidaExcluidos(produtoId) {
  const r = await fetch(`${API}/itens-saida-excluidos?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarItemSaidaExcluido(dados) {
  const r = await fetch(`${API}/itens-saida-excluidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarItemSaidaExcluido(id, dados) {
  const r = await fetch(`${API}/itens-saida-excluidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarItemSaidaExcluido(id) {
  const r = await fetch(`${API}/itens-saida-excluidos/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
