// Configuração declarativa dos campos de SaidaExcluida (GENUS.DELSAIDA —
// histórico/snapshot de um cabeçalho de saída excluído). Agrupamento espelha
// os comentários de seção do model `SaidaExcluida` em
// backend/models/tabelas.py — mesmo padrão já usado em camposSaida.js
// (Saida/GENUS.SAIDA), só que sem os campos que DELSAIDA não reconhece
// (Reforma Tributária, Ordem de Serviço/retenções, transporte/entrega
// detalhado, referências de saída vinculada etc.).
export const GRUPOS_CAMPOS_SAIDA_EXCLUIDA = [
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
    titulo: 'Observação',
    campos: [
      { nome: 'observacao', label: 'Observação', tipo: 'textarea' },
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
    titulo: 'Carteira / Cliente / Classificação',
    campos: [
      { nome: 'cod_carteira', label: 'Cód. Carteira', tipo: 'int' },
      { nome: 'discriminacao', label: 'Discriminação', tipo: 'texto', maxLength: 1 },
      { nome: 'pedido_representante', label: 'Pedido Representante', tipo: 'texto', maxLength: 15 },
      { nome: 'cod_cliente_entrega', label: 'Cód. Cliente Entrega', tipo: 'int' },
      { nome: 'tipo_comercio', label: 'Tipo Comércio', tipo: 'texto', maxLength: 1 },
      { nome: 'tipo_nf', label: 'Tipo NF', tipo: 'texto', maxLength: 1 },
      { nome: 'tipo_cliente', label: 'Tipo Cliente', tipo: 'texto', maxLength: 1 },
    ],
  },
  {
    titulo: 'Auditoria da Exclusão',
    campos: [
      { nome: 'dt_exclusao', label: 'Data Exclusão', tipo: 'data' },
    ],
  },
];

export const FORM_VAZIO_SAIDA_EXCLUIDA = GRUPOS_CAMPOS_SAIDA_EXCLUIDA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_SAIDA_EXCLUIDA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarSaidaExcluida(form) {
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
