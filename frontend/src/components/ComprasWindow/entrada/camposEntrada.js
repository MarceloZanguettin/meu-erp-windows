// Configuração declarativa dos campos de Entrada (GENUS.ENTRADA — cabeçalho
// de nota fiscal de entrada/compra). Agrupamento espelha os comentários de
// seção do model `Entrada` em backend/models/tabelas.py — análogo, no lado
// de compras, ao já usado em VendasWindow/saida/camposSaida.js.
export const GRUPOS_CAMPOS_ENTRADA = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
      { nome: 'tipo_doc', label: 'Tipo Doc', tipo: 'texto', maxLength: 1 },
      { nome: 'doc', label: 'Doc', tipo: 'int' },
      { nome: 'serie', label: 'Série', tipo: 'texto', maxLength: 4 },
      { nome: 'cod_fornecedor', label: 'Cód. Fornecedor', tipo: 'int' },
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'dt_entrada', label: 'Data Entrada', tipo: 'data' },
      { nome: 'modelo', label: 'Modelo', tipo: 'texto', maxLength: 2 },
      { nome: 'subserie', label: 'Subsérie', tipo: 'texto', maxLength: 4 },
      { nome: 'cod_funcionario', label: 'Cód. Funcionário', tipo: 'int' },
    ],
  },
  {
    titulo: 'Compra / Condição de Pagamento',
    campos: [
      { nome: 'cod_compra', label: 'Cód. Compra', tipo: 'int' },
      { nome: 'cod_cond_pagto', label: 'Cód. Cond. Pagto', tipo: 'texto', maxLength: 5 },
      { nome: 'cod_tipo_compra', label: 'Cód. Tipo Compra', tipo: 'int' },
    ],
  },
  {
    titulo: 'Documento Vinculado / Complementar (2ª Nota)',
    campos: [
      { nome: 'cod_empresa2', label: 'Cód. Empresa 2', tipo: 'int' },
      { nome: 'tipo_doc2', label: 'Tipo Doc 2', tipo: 'texto', maxLength: 1 },
      { nome: 'doc2', label: 'Doc 2', tipo: 'int' },
      { nome: 'serie2', label: 'Série 2', tipo: 'texto', maxLength: 4 },
      { nome: 'cod_fornecedor2', label: 'Cód. Fornecedor 2', tipo: 'int' },
      { nome: 'transfere', label: 'Transfere', tipo: 'texto', maxLength: 1 },
    ],
  },
  {
    titulo: 'NF-e / Chave de Acesso',
    campos: [
      { nome: 'chave_nfe', label: 'Chave NF-e', tipo: 'texto', maxLength: 70 },
      { nome: 'msg_chave', label: 'Mensagem Chave', tipo: 'texto', maxLength: 25 },
      { nome: 'arq_xml', label: 'Arquivo XML', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Fiscal: ICMS / ICMS-ST / IPI / PIS / COFINS',
    campos: [
      { nome: 'cod_cfop', label: 'Cód. CFOP', tipo: 'texto', maxLength: 5 },
      { nome: 'icms_base', label: 'ICMS Base', tipo: 'float' },
      { nome: 'icms_valor', label: 'ICMS Valor', tipo: 'float' },
      { nome: 'icms_base_subst', label: 'ICMS Base Subst.', tipo: 'float' },
      { nome: 'icms_valor_subst', label: 'ICMS Valor Subst.', tipo: 'float' },
      { nome: 'icms_reducao', label: 'ICMS Redução', tipo: 'float' },
      { nome: 'aliquota', label: 'Alíquota', tipo: 'texto', maxLength: 5 },
      { nome: 'aliquota_subs', label: 'Alíquota Subst.', tipo: 'texto', maxLength: 5 },
      { nome: 'cst', label: 'CST', tipo: 'texto', maxLength: 3 },
      { nome: 'ipi_valor', label: 'IPI Valor', tipo: 'float' },
      { nome: 'pis_cst', label: 'PIS CST', tipo: 'texto', maxLength: 3 },
      { nome: 'pis_valor', label: 'PIS Valor', tipo: 'float' },
      { nome: 'pis_base', label: 'PIS Base', tipo: 'float' },
      { nome: 'pis_aliquota', label: 'PIS Alíquota', tipo: 'float' },
      { nome: 'cofins_cst', label: 'COFINS CST', tipo: 'texto', maxLength: 3 },
      { nome: 'cofins_valor', label: 'COFINS Valor', tipo: 'float' },
      { nome: 'cofins_base', label: 'COFINS Base', tipo: 'float' },
      { nome: 'cofins_aliquota', label: 'COFINS Alíquota', tipo: 'float' },
      { nome: 'simples', label: 'Simples Nacional', tipo: 'texto', maxLength: 1 },
      { nome: 'reter_imposto', label: 'Reter Imposto', tipo: 'texto', maxLength: 1 },
    ],
  },
  {
    titulo: 'Valores Comerciais',
    campos: [
      { nome: 'valor_produtos', label: 'Valor Produtos', tipo: 'float' },
      { nome: 'frete', label: 'Frete', tipo: 'float' },
      { nome: 'seguro', label: 'Seguro', tipo: 'float' },
      { nome: 'outras', label: 'Outras Despesas', tipo: 'float' },
      { nome: 'total_nf', label: 'Total NF', tipo: 'float' },
      { nome: 'desc_acres', label: 'Desconto/Acréscimo', tipo: 'float' },
      { nome: 'outros_custo', label: 'Outros Custos', tipo: 'float' },
      { nome: 'valor_credito_fornecedor', label: 'Valor Crédito Fornecedor', tipo: 'float' },
    ],
  },
  {
    titulo: 'Observações',
    campos: [
      { nome: 'observacao', label: 'Observação', tipo: 'textarea' },
      { nome: 'obs_fisco', label: 'Obs. Fisco', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Volumes Transportados',
    campos: [
      { nome: 'quantidade_volumes', label: 'Quantidade', tipo: 'texto', maxLength: 10 },
      { nome: 'especie_volumes', label: 'Espécie', tipo: 'texto', maxLength: 15 },
      { nome: 'peso_bruto_volumes', label: 'Peso Bruto', tipo: 'texto', maxLength: 15 },
      { nome: 'peso_liquido_volumes', label: 'Peso Líquido', tipo: 'texto', maxLength: 15 },
    ],
  },
  {
    titulo: 'Transporte',
    campos: [
      { nome: 'mod_frete', label: 'Modalidade Frete', tipo: 'texto', maxLength: 3 },
      { nome: 'mod_transporte', label: 'Modalidade Transporte', tipo: 'texto', maxLength: 20 },
      { nome: 'indicador_nat_frete', label: 'Indicador Nat. Frete', tipo: 'texto', maxLength: 1 },
      { nome: 'placa1', label: 'Placa 1', tipo: 'texto', maxLength: 8 },
      { nome: 'placa2', label: 'Placa 2', tipo: 'texto', maxLength: 8 },
      { nome: 'placa3', label: 'Placa 3', tipo: 'texto', maxLength: 8 },
      { nome: 'uf_placa1', label: 'UF Placa 1', tipo: 'texto', maxLength: 2 },
      { nome: 'uf_placa2', label: 'UF Placa 2', tipo: 'texto', maxLength: 2 },
      { nome: 'uf_placa3', label: 'UF Placa 3', tipo: 'texto', maxLength: 2 },
    ],
  },
  {
    titulo: 'Auditoria de Origem (GENUS)',
    campos: [
      { nome: 'cod_alteracao', label: 'Cód. Alteração', tipo: 'int' },
      { nome: 'hora_alteracao_genus', label: 'Hora Alteração', tipo: 'texto', maxLength: 8 },
      { nome: 'data_alteracao_genus', label: 'Data Alteração', tipo: 'data' },
    ],
  },
  {
    titulo: 'Histórico / Controle',
    campos: [
      { nome: 'cod_historico', label: 'Cód. Histórico', tipo: 'texto', maxLength: 12 },
      { nome: 'cod_controle', label: 'Cód. Controle', tipo: 'int' },
      { nome: 'cod_controle_empresa', label: 'Cód. Controle Empresa', tipo: 'int' },
      { nome: 'cod_controle_tipo', label: 'Cód. Controle Tipo', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_empresa_nao_fiscal', label: 'Cód. Empresa Não Fiscal', tipo: 'int' },
    ],
  },
  {
    titulo: 'Saída Vinculada (Devolução)',
    campos: [
      { nome: 'cod_saida_vinculada', label: 'Cód. Saída Vinculada', tipo: 'int' },
      { nome: 'cod_empresa_saida_vinculada', label: 'Cód. Empresa Saída Vinculada', tipo: 'int' },
      { nome: 'doc_saida_vinculada', label: 'Doc Saída Vinculada', tipo: 'int' },
    ],
  },
  {
    titulo: 'Produção',
    campos: [
      { nome: 'cod_empresa_producao', label: 'Cód. Empresa Produção', tipo: 'int' },
      { nome: 'codigo_producao', label: 'Código Produção', tipo: 'int' },
      { nome: 'lote_producao', label: 'Lote Produção', tipo: 'texto', maxLength: 10 },
      { nome: 'cod_empresa_saida_prod', label: 'Cód. Empresa Saída Prod.', tipo: 'int' },
      { nome: 'codigo_saida_prod', label: 'Código Saída Prod.', tipo: 'int' },
      { nome: 'doc_saida_prod', label: 'Doc Saída Prod.', tipo: 'texto', maxLength: 20 },
    ],
  },
  {
    titulo: 'Reforma Tributária: Gerais / Governo',
    campos: [
      { nome: 'reforma_totvbcibscbs', label: 'Total BC IBS/CBS', tipo: 'float' },
      { nome: 'reforma_vnftot', label: 'Total NF (Reforma)', tipo: 'float' },
      { nome: 'reforma_tpentegov', label: 'Tipo Ente Governo', tipo: 'texto', maxLength: 1 },
      { nome: 'reforma_tpopergov', label: 'Tipo Operação Governo', tipo: 'texto', maxLength: 1 },
      { nome: 'reforma_predutorgov', label: 'Perc. Redutor Governo', tipo: 'float' },
    ],
  },
  {
    titulo: 'Reforma Tributária: Totais IBS-UF / IBS-Município / IBS Geral',
    campos: [
      { nome: 'reforma_totvibsuf_ibsuf', label: 'Total IBS-UF', tipo: 'float' },
      { nome: 'reforma_totvdif_ibsuf', label: 'Total Dif. IBS-UF', tipo: 'float' },
      { nome: 'reforma_totvdevtrib_ibsuf', label: 'Total Dev. Trib. IBS-UF', tipo: 'float' },
      { nome: 'reforma_totvibsmun_ibsmun', label: 'Total IBS-Mun.', tipo: 'float' },
      { nome: 'reforma_totvdif_ibsmun', label: 'Total Dif. IBS-Mun.', tipo: 'float' },
      { nome: 'reforma_totvdevtrib_ibsmun', label: 'Total Dev. Trib. IBS-Mun.', tipo: 'float' },
      { nome: 'reforma_totvibs_ibs', label: 'Total IBS', tipo: 'float' },
      { nome: 'reforma_totvcredpres_ibs', label: 'Total Créd. Presumido IBS', tipo: 'float' },
      { nome: 'reforma_totvcredprescondsus_ibs', label: 'Total Créd. Pres. Cond. Susp. IBS', tipo: 'float' },
    ],
  },
  {
    titulo: 'Reforma Tributária: Totais CBS',
    campos: [
      { nome: 'reforma_totvcbs_cbs', label: 'Total CBS', tipo: 'float' },
      { nome: 'reforma_totvdevtrib_cbs', label: 'Total Dev. Trib. CBS', tipo: 'float' },
      { nome: 'reforma_totvdif_cbs', label: 'Total Dif. CBS', tipo: 'float' },
      { nome: 'reforma_totvcredpres_cbs', label: 'Total Créd. Presumido CBS', tipo: 'float' },
      { nome: 'reforma_totvcredprescondsus_cbs', label: 'Total Créd. Pres. Cond. Susp. CBS', tipo: 'float' },
    ],
  },
];

export const FORM_VAZIO_ENTRADA = GRUPOS_CAMPOS_ENTRADA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_ENTRADA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarEntrada(form) {
  const out = { ...form };
  for (const campo of CAMPOS_NUMERICOS) {
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
