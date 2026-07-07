const API = 'http://localhost:8050';

// Campos GENUS.ENTLAN do tipo inteiro/decimal — precisam virar Number antes de enviar
const NUMERICOS = [
  'produto_id', 'cod_empresa', 'doc', 'cod_fornecedor', 'nitem_fornec',
  'unitario', 'total', 'qtde', 'qtde_estq', 'frete', 'perc_a_prazo', 'vl_venda',
  'taxa_fornecedor', 'credito_fornecedor', 'cpr',
  'custo_item', 'custo_real', 'preco_custo', 'outros_custo', 'icms_custo',
  'cod_empresa_nao_fiscal', 'cod_saida_vinculada', 'cod_empresa_saida_vinculada', 'doc_saida_vinculada',
  'icms', 'iva', 'icms_valor', 'icms_base_calculo', 'icms_reducao', 'icms_isento', 'icms_outras',
  'icms_percentual_st', 'icms_reducao_st', 'icms_subst_tributaria', 'icms_base_subst_tributaria',
  'ipi', 'ipi_valor', 'ipi_base_calculo',
  'pis_valor', 'pis_base', 'pis_aliquota', 'quantidade_pis', 'aliq_pis_reais',
  'cofins_valor', 'cofins_base', 'cofins_aliquota', 'quantidade_cofins', 'aliq_cofins_reais',
  'reforma_vbc_ibscbs', 'reforma_vitem',
  'reforma_pibsuf_ibsuf', 'reforma_pdif_ibsuf', 'reforma_vdif_ibsuf', 'reforma_vdevtrib_ibsuf',
  'reforma_predaliq_ibsuf', 'reforma_paliqefet_ibsuf', 'reforma_vibsuf_ibsuf',
  'reforma_paliqefetregibsuf', 'reforma_vtribregibsuf', 'reforma_vtribibsuf_gov', 'reforma_vibs_transfcred',
  'reforma_pibsmun_ibsmun', 'reforma_pdif_ibsmun', 'reforma_vdif_ibsmun', 'reforma_vdevtrib_ibsmun',
  'reforma_predaliq_ibsmun', 'reforma_paliqefet_ibsmun', 'reforma_vibsmun_ibsmun',
  'reforma_paliqefetregibsmun', 'reforma_vtribregibsmun', 'reforma_vtribibsmun_gov',
  'reforma_vibs',
  'reforma_pcbs_cbs', 'reforma_pdif_cbs', 'reforma_vdif_cbs', 'reforma_vdevtrib_cbs',
  'reforma_predaliq_cbs', 'reforma_paliqefet_cbs', 'reforma_vcbs_cbs',
  'reforma_paliqefetregcbs', 'reforma_vtribregcbs', 'reforma_vtribcbs_gov', 'reforma_vcbs_transfcred',
  'reforma_pcredpres_ibs', 'reforma_vcredpres_ibs', 'reforma_vcredprescondsus_ibs',
  'reforma_pcredpres_cbs', 'reforma_vcredpres_cbs', 'reforma_vcredprescondsus_cbs',
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
  throw new Error(err.detail || 'Erro ao salvar item de entrada');
}

export async function listarItensEntrada(produtoId) {
  const r = await fetch(`${API}/itens-entrada?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarItemEntrada(dados) {
  const r = await fetch(`${API}/itens-entrada`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarItemEntrada(id, dados) {
  const r = await fetch(`${API}/itens-entrada/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarItemEntrada(id) {
  const r = await fetch(`${API}/itens-entrada/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
