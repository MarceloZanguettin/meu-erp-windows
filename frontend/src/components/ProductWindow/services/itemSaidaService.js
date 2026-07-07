const API = 'http://localhost:8050';

// Campos GENUS.SAILAN do tipo inteiro/decimal — precisam virar Number antes de enviar
const NUMERICOS = [
  'produto_id', 'codigo', 'cod_empresa', 'cod_saida', 'nitem',
  'qtde', 'qtde_controle', 'qtde_embal', 'qtde_embalagem', 'qtde_faturamento_parcial',
  'unitario', 'total', 'custo', 'desconto', 'per_desconto', 'frete', 'seguro', 'outras',
  'perc_comissao', 'cal_comissao', 'val_comissao', 'comissao_item',
  'icms', 'icms_base', 'icms_valor', 'icms_outras', 'icms_isento', 'reducao_icms', 'iva',
  'icmsst', 'reducao_icmsst', 'icms_base_subst', 'icms_valor_subst', 'icms_fcp',
  'aliq_uf_dest', 'vl_icms_uf_dest', 'vl_icms_uf_rem', 'vl_icms_fcp', 'credito',
  'ipi', 'ipi_valor', 'ipi_base_calculo',
  'pis_valor', 'pis_base', 'pis_aliquota', 'quantidade_pis', 'aliq_pis_reais',
  'cofins_valor', 'cofins_base', 'cofins_aliquota', 'quantidade_cofins', 'aliq_cofins_reais',
  'aliq_ibpt',
  'cod_romaneio', 'cod_classificacao2', 'cod_empresa_nao_fiscal', 'cod_pre_pedido', 'cod_empresa_pre_pedido', 'cod_cbenef',
  'reforma_vbc_ibscbs', 'reforma_vitem', 'reforma_nitem',
  'reforma_pibsuf_ibsuf', 'reforma_pdif_ibsuf', 'reforma_vdif_ibsuf', 'reforma_vdevtrib_ibsuf',
  'reforma_predaliq_ibsuf', 'reforma_paliqefet_ibsuf', 'reforma_vibsuf_ibsuf',
  'reforma_paliqefetregibsuf', 'reforma_vtribregibsuf', 'reforma_paliqibsuf_gov', 'reforma_vtribibsuf_gov',
  'reforma_vibs_transfcred', 'reforma_vibsestcred',
  'reforma_pibsmun_ibsmun', 'reforma_pdif_ibsmun', 'reforma_vdif_ibsmun', 'reforma_vdevtrib_ibsmun',
  'reforma_predaliq_ibsmun', 'reforma_paliqefet_ibsmun', 'reforma_vibsmun_ibsmun',
  'reforma_paliqefetregibsmun', 'reforma_vtribregibsmun', 'reforma_paliqibsmun_gov', 'reforma_vtribibsmun_gov',
  'reforma_vibs',
  'reforma_pcbs_cbs', 'reforma_pdif_cbs', 'reforma_vdif_cbs', 'reforma_vdevtrib_cbs',
  'reforma_predaliq_cbs', 'reforma_paliqefet_cbs', 'reforma_vcbs_cbs',
  'reforma_paliqefetregcbs', 'reforma_vtribregcbs', 'reforma_paliqcbs_gov', 'reforma_vtribcbs_gov',
  'reforma_vcbs_transfcred', 'reforma_vcbsestcred',
  'reforma_pcredpres_ibs', 'reforma_vcredpres_ibs', 'reforma_vcredprescondsus_ibs',
  'reforma_pcredpres_cbs', 'reforma_vcredpres_cbs', 'reforma_vcredprescondsus_cbs',
  'reforma_vcredpresibszfm',
  'reforma_vbcis_is', 'reforma_pis_is', 'reforma_pisespec_is', 'reforma_qtrib_is', 'reforma_vis_is',
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
  throw new Error(err.detail || 'Erro ao salvar item de saída');
}

export async function listarItensSaida(produtoId) {
  const r = await fetch(`${API}/itens-saida?produto_id=${encodeURIComponent(produtoId)}`);
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function criarItemSaida(dados) {
  const r = await fetch(`${API}/itens-saida`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function atualizarItemSaida(id, dados) {
  const r = await fetch(`${API}/itens-saida/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(normalizar(dados)),
  });
  if (!r.ok) await tratarErro(r);
  return r.json();
}

export async function deletarItemSaida(id) {
  const r = await fetch(`${API}/itens-saida/${id}`, { method: 'DELETE' });
  if (!r.ok) await tratarErro(r);
  return r.json();
}
