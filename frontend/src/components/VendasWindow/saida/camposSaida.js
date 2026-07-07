// Configuração declarativa dos campos de Saida (GENUS.SAIDA — cabeçalho de
// nota fiscal de saída/venda). Agrupamento espelha os comentários de seção
// do model `Saida` em backend/models/tabelas.py.
export const GRUPOS_CAMPOS_SAIDA = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'tipo_doc', label: 'Tipo Doc', tipo: 'texto', maxLength: 1 },
      { nome: 'doc', label: 'Doc', tipo: 'int' },
      { nome: 'serie', label: 'Série', tipo: 'texto', maxLength: 4 },
      { nome: 'cod_cliente', label: 'Cód. Cliente', tipo: 'int' },
      { nome: 'cod_funcionario', label: 'Cód. Funcionário', tipo: 'int' },
      { nome: 'cod_cond_pagto', label: 'Cód. Cond. Pagto', tipo: 'texto', maxLength: 5 },
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'modelo', label: 'Modelo', tipo: 'texto', maxLength: 2 },
      { nome: 'status_genus', label: 'Status', tipo: 'texto', maxLength: 30 },
      { nome: 'cancelado', label: 'Cancelado', tipo: 'texto', maxLength: 1 },
    ],
  },
  {
    titulo: 'Fiscal: ICMS / ICMS-ST / IPI / PIS / COFINS',
    campos: [
      { nome: 'cod_cfop', label: 'Cód. CFOP', tipo: 'texto', maxLength: 5 },
      { nome: 'cod_cfop2', label: 'Cód. CFOP 2', tipo: 'texto', maxLength: 5 },
      { nome: 'icms_base', label: 'ICMS Base', tipo: 'float' },
      { nome: 'icms_valor', label: 'ICMS Valor', tipo: 'float' },
      { nome: 'icms_base_subst', label: 'ICMS Base Subst.', tipo: 'float' },
      { nome: 'icms_valor_subst', label: 'ICMS Valor Subst.', tipo: 'float' },
      { nome: 'ipi_valor', label: 'IPI Valor', tipo: 'float' },
      { nome: 'pis_valor', label: 'PIS Valor', tipo: 'float' },
      { nome: 'cofins_valor', label: 'COFINS Valor', tipo: 'float' },
      { nome: 'credito_icms', label: 'Crédito ICMS', tipo: 'float' },
      { nome: 'total_icms_uf_dest', label: 'Total ICMS UF Dest.', tipo: 'float' },
      { nome: 'total_icms_uf_rem', label: 'Total ICMS UF Rem.', tipo: 'float' },
      { nome: 'total_icms_fcp', label: 'Total ICMS FCP', tipo: 'float' },
    ],
  },
  {
    titulo: 'Valores Comerciais',
    campos: [
      { nome: 'valor_produtos', label: 'Valor Produtos', tipo: 'float' },
      { nome: 'frete', label: 'Frete', tipo: 'float' },
      { nome: 'seguro', label: 'Seguro', tipo: 'float' },
      { nome: 'outras', label: 'Outras Despesas', tipo: 'float' },
      { nome: 'total', label: 'Total', tipo: 'float' },
      { nome: 'desc_acres', label: 'Desconto/Acréscimo', tipo: 'float' },
      { nome: 'descto1', label: 'Desconto 1', tipo: 'float' },
      { nome: 'descto2', label: 'Desconto 2', tipo: 'float' },
      { nome: 'descto3', label: 'Desconto 3', tipo: 'float' },
      { nome: 'descto4', label: 'Desconto 4', tipo: 'float' },
      { nome: 'descto5', label: 'Desconto 5', tipo: 'float' },
      { nome: 'perc_divisao', label: 'Perc. Divisão', tipo: 'float' },
      { nome: 'comissao', label: 'Comissão', tipo: 'float' },
      { nome: 'valor_credito', label: 'Valor Crédito', tipo: 'float' },
    ],
  },
  {
    titulo: 'Observações',
    campos: [
      { nome: 'observacao', label: 'Observação', tipo: 'textarea' },
      { nome: 'obs_interna', label: 'Obs. Interna', tipo: 'textarea' },
      { nome: 'obs_fisco', label: 'Obs. Fisco', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Transferência / Outros',
    campos: [
      { nome: 'transfere', label: 'Transfere', tipo: 'texto', maxLength: 1 },
      { nome: 'cpf_cnpj', label: 'CPF/CNPJ', tipo: 'texto', maxLength: 18 },
      { nome: 'hora', label: 'Hora', tipo: 'texto', maxLength: 8 },
      { nome: 'cod_transfere', label: 'Cód. Transfere', tipo: 'int' },
      { nome: 'fechar', label: 'Fechar', tipo: 'texto', maxLength: 1 },
    ],
  },
  {
    titulo: 'Volumes Transportados',
    campos: [
      { nome: 'quantidade_volumes', label: 'Quantidade', tipo: 'texto', maxLength: 10 },
      { nome: 'especie_volumes', label: 'Espécie', tipo: 'texto', maxLength: 15 },
      { nome: 'marca_volumes', label: 'Marca', tipo: 'texto', maxLength: 15 },
      { nome: 'numero_volumes', label: 'Número', tipo: 'texto', maxLength: 10 },
      { nome: 'peso_bruto_volumes', label: 'Peso Bruto', tipo: 'texto', maxLength: 15 },
      { nome: 'peso_liquido_volumes', label: 'Peso Líquido', tipo: 'texto', maxLength: 15 },
    ],
  },
  {
    titulo: 'Transporte',
    campos: [
      { nome: 'cod_transportador', label: 'Cód. Transportador', tipo: 'int' },
      { nome: 'frete_conta', label: 'Frete por Conta', tipo: 'texto', maxLength: 1 },
      { nome: 'placa', label: 'Placa', tipo: 'texto', maxLength: 8 },
      { nome: 'entregue', label: 'Entregue', tipo: 'texto', maxLength: 1 },
      { nome: 'dt_previsao', label: 'Data Previsão', tipo: 'data' },
    ],
  },
  {
    titulo: 'ECF / Estoque',
    campos: [
      { nome: 'cod_ecf', label: 'Cód. ECF', tipo: 'int' },
      { nome: 'ccf', label: 'CCF', tipo: 'int' },
      { nome: 'retirar_estoque', label: 'Retirar Estoque', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_tipo_venda', label: 'Cód. Tipo Venda', tipo: 'int' },
    ],
  },
  {
    titulo: 'Romaneio / NF-e',
    campos: [
      { nome: 'romaneio', label: 'Romaneio', tipo: 'int' },
      { nome: 'romaneio_lote', label: 'Romaneio Lote', tipo: 'texto', maxLength: 10 },
      { nome: 'chave_nfe', label: 'Chave NF-e', tipo: 'texto', maxLength: 70 },
    ],
  },
  {
    titulo: 'Vínculos / Liberação',
    campos: [
      { nome: 'cod_agregado', label: 'Cód. Agregado', tipo: 'int' },
      { nome: 'avista_prazo', label: 'À Vista/Prazo', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_cupom_vinculado', label: 'Cód. Cupom Vinculado', tipo: 'int' },
      { nome: 'dt_liberado', label: 'Data Liberado', tipo: 'data' },
      { nome: 'cod_adm', label: 'Cód. Adm.', tipo: 'int' },
      { nome: 'dt_saida', label: 'Data Saída', tipo: 'data' },
      { nome: 'hora_saida', label: 'Hora Saída', tipo: 'texto', maxLength: 8 },
      { nome: 'liberado', label: 'Liberado', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_alteracao', label: 'Cód. Alteração', tipo: 'int' },
      { nome: 'hora_alteracao_genus', label: 'Hora Alteração', tipo: 'texto', maxLength: 8 },
      { nome: 'data_alteracao_genus', label: 'Data Alteração', tipo: 'data' },
    ],
  },
  {
    titulo: 'E-mail',
    campos: [
      { nome: 'email_enviado', label: 'E-mail Enviado', tipo: 'data' },
      { nome: 'email_cod_funcionario', label: 'Cód. Funcionário (e-mail)', tipo: 'int' },
    ],
  },
  {
    titulo: 'Carteira / Cliente / Tabela de Preço',
    campos: [
      { nome: 'cod_carteira', label: 'Cód. Carteira', tipo: 'int' },
      { nome: 'discriminacao', label: 'Discriminação', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_cliente_entrega', label: 'Cód. Cliente Entrega', tipo: 'int' },
      { nome: 'tipo_comercio', label: 'Tipo Comércio', tipo: 'texto', maxLength: 1 },
      { nome: 'tipo_nf', label: 'Tipo NF', tipo: 'texto', maxLength: 1 },
      { nome: 'tipo_cliente', label: 'Tipo Cliente', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_tabela_preco', label: 'Cód. Tabela Preço', tipo: 'int' },
      { nome: 'cod_orcamento', label: 'Cód. Orçamento', tipo: 'int' },
      { nome: 'devop_simples', label: 'Devolução Simples', tipo: 'texto', maxLength: 1 },
    ],
  },
  {
    titulo: 'Ordem de Serviço',
    campos: [
      { nome: 'cod_ordem_servico', label: 'Cód. Ordem Serviço', tipo: 'int' },
      { nome: 'cod_empresa_ordem_servico', label: 'Cód. Empresa (O.S.)', tipo: 'int' },
      { nome: 'tipo_ordem_servico', label: 'Tipo O.S.', tipo: 'texto', maxLength: 1 },
      { nome: 'vl_base_calculo', label: 'Valor Base Cálculo', tipo: 'float' },
      { nome: 'vl_deducao', label: 'Valor Dedução', tipo: 'float' },
      { nome: 'vl_aliquota', label: 'Valor Alíquota', tipo: 'float' },
      { nome: 'vl_inss', label: 'Valor INSS', tipo: 'float' },
      { nome: 'al_inss', label: 'Alíquota INSS', tipo: 'float' },
      { nome: 'al_ir', label: 'Alíquota IR', tipo: 'float' },
      { nome: 'vl_ir', label: 'Valor IR', tipo: 'float' },
      { nome: 'al_csll', label: 'Alíquota CSLL', tipo: 'float' },
      { nome: 'vl_csll', label: 'Valor CSLL', tipo: 'float' },
      { nome: 'al_pis', label: 'Alíquota PIS', tipo: 'float' },
      { nome: 'al_cofins', label: 'Alíquota COFINS', tipo: 'float' },
      { nome: 'vl_iss', label: 'Valor ISS', tipo: 'float' },
      { nome: 'vl_iss_retido', label: 'Valor ISS Retido', tipo: 'float' },
      { nome: 'vl_servico', label: 'Valor Serviço', tipo: 'float' },
    ],
  },
  {
    titulo: 'Referências',
    campos: [
      { nome: 'cod_empresa_ref', label: 'Cód. Empresa Ref.', tipo: 'int' },
      { nome: 'cod_saida_ref', label: 'Cód. Saída Ref.', tipo: 'int' },
      { nome: 'cod_pedido', label: 'Cód. Pedido', tipo: 'int' },
      { nome: 'cod_empresa_vinculado', label: 'Cód. Empresa Vinculado', tipo: 'int' },
      { nome: 'cod_saida_vinculado', label: 'Cód. Saída Vinculado', tipo: 'int' },
      { nome: 'cod_empresa_nao_fiscal', label: 'Cód. Empresa Não Fiscal', tipo: 'int' },
    ],
  },
  {
    titulo: 'Entrada Vinculada (Devolução)',
    campos: [
      { nome: 'entrada_cod_empresa', label: 'Cód. Empresa (Entrada)', tipo: 'int' },
      { nome: 'entrada_tipo_doc', label: 'Tipo Doc (Entrada)', tipo: 'texto', maxLength: 1 },
      { nome: 'entrada_doc', label: 'Doc (Entrada)', tipo: 'int' },
      { nome: 'entrada_serie', label: 'Série (Entrada)', tipo: 'texto', maxLength: 4 },
      { nome: 'entrada_cod_fornecedor', label: 'Cód. Fornecedor (Entrada)', tipo: 'int' },
    ],
  },
  {
    titulo: 'Retorno CFOP (Fechamento Fiscal)',
    campos: [
      { nome: 'data_retorno_cfop', label: 'Data Retorno CFOP', tipo: 'data' },
      { nome: 'retorno_fechado_cfop', label: 'Retorno Fechado', tipo: 'texto', maxLength: 1 },
      { nome: 'data_retorno_fechado_cfop', label: 'Data Retorno Fechado', tipo: 'data' },
    ],
  },
  {
    titulo: 'Códigos Antigos / Transferência entre Empresas',
    campos: [
      { nome: 'cod_antigo_transfere1', label: 'Cód. Antigo Transfere 1', tipo: 'int' },
      { nome: 'cod_antigo_transfere2', label: 'Cód. Antigo Transfere 2', tipo: 'int' },
      { nome: 'cod_empresa_transf1', label: 'Cód. Empresa Transf. 1', tipo: 'int' },
      { nome: 'cod_empresa_transf2', label: 'Cód. Empresa Transf. 2', tipo: 'int' },
      { nome: 'cod_saida_antigo', label: 'Cód. Saída Antigo', tipo: 'int' },
      { nome: 'pedido_representante', label: 'Pedido Representante', tipo: 'texto', maxLength: 15 },
    ],
  },
  {
    titulo: 'Reforma Tributária: Gerais / Governo',
    campos: [
      { nome: 'reforma_tpnfdebito', label: 'Tipo NF Débito', tipo: 'texto', maxLength: 2 },
      { nome: 'reforma_tpnfcredito', label: 'Tipo NF Crédito', tipo: 'texto', maxLength: 2 },
      { nome: 'reforma_tpentegov', label: 'Tipo Ente Governo', tipo: 'texto', maxLength: 1 },
      { nome: 'reforma_predutorgov', label: 'Perc. Redutor Governo', tipo: 'float' },
      { nome: 'reforma_tpopergov', label: 'Tipo Operação Governo', tipo: 'texto', maxLength: 1 },
      { nome: 'reforma_refnfeant', label: 'Ref. NF-e Anterior', tipo: 'texto', maxLength: 44 },
      { nome: 'reforma_cod_saida_ant', label: 'Cód. Saída Anterior', tipo: 'int' },
      { nome: 'reforma_cod_empresa_ant', label: 'Cód. Empresa Anterior', tipo: 'int' },
    ],
  },
  {
    titulo: 'Reforma Tributária: Totais IBS-UF',
    campos: [
      { nome: 'reforma_totvbcibscbs', label: 'Total BC IBS/CBS', tipo: 'float' },
      { nome: 'reforma_totvdif_ibsuf', label: 'Total Dif. IBS-UF', tipo: 'float' },
      { nome: 'reforma_totvdevtrib_ibsuf', label: 'Total Dev. Trib. IBS-UF', tipo: 'float' },
      { nome: 'reforma_totvibsuf_ibsuf', label: 'Total IBS-UF', tipo: 'float' },
    ],
  },
  {
    titulo: 'Reforma Tributária: Totais IBS-Município',
    campos: [
      { nome: 'reforma_totvdif_ibsmun', label: 'Total Dif. IBS-Mun.', tipo: 'float' },
      { nome: 'reforma_totvdevtrib_ibsmun', label: 'Total Dev. Trib. IBS-Mun.', tipo: 'float' },
      { nome: 'reforma_totvibsmun_ibsmun', label: 'Total IBS-Mun.', tipo: 'float' },
    ],
  },
  {
    titulo: 'Reforma Tributária: Totais IBS Geral / Crédito Presumido',
    campos: [
      { nome: 'reforma_totvibs_ibs', label: 'Total IBS', tipo: 'float' },
      { nome: 'reforma_totvcredpres_ibs', label: 'Total Créd. Presumido IBS', tipo: 'float' },
      { nome: 'reforma_totvcredprescondsus_ibs', label: 'Total Créd. Pres. Cond. Susp. IBS', tipo: 'float' },
      { nome: 'reforma_totvibsestcred', label: 'Total IBS Est. Créd.', tipo: 'float' },
    ],
  },
  {
    titulo: 'Reforma Tributária: Totais CBS',
    campos: [
      { nome: 'reforma_totvdif_cbs', label: 'Total Dif. CBS', tipo: 'float' },
      { nome: 'reforma_totvdevtrib_cbs', label: 'Total Dev. Trib. CBS', tipo: 'float' },
      { nome: 'reforma_totvcbs_cbs', label: 'Total CBS', tipo: 'float' },
      { nome: 'reforma_totvcredpres_cbs', label: 'Total Créd. Presumido CBS', tipo: 'float' },
      { nome: 'reforma_totvcredprescondsus_cbs', label: 'Total Créd. Pres. Cond. Susp. CBS', tipo: 'float' },
      { nome: 'reforma_totvcbsestcred', label: 'Total CBS Est. Créd.', tipo: 'float' },
    ],
  },
  {
    titulo: 'Reforma Tributária: Total Geral / Exceção',
    campos: [
      { nome: 'reforma_vnftot', label: 'Total NF (Reforma)', tipo: 'float' },
      { nome: 'reforma_excecao', label: 'Exceção', tipo: 'texto', maxLength: 1 },
      { nome: 'reforma_excecao_descricao', label: 'Descrição da Exceção', tipo: 'textarea' },
      { nome: 'reforma_excecao_responsaveis', label: 'Responsáveis pela Exceção', tipo: 'textarea' },
    ],
  },
];

export const FORM_VAZIO_SAIDA = GRUPOS_CAMPOS_SAIDA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_SAIDA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarSaida(form) {
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
