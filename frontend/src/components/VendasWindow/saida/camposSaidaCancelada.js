// Configuração declarativa dos campos de SaidaCancelada (GENUS.SAIDA_CANCELADA
// — histórico/snapshot de um cabeçalho de saída cancelado). Agrupamento
// espelha os comentários de seção do model `SaidaCancelada` em
// backend/models/tabelas.py — mesmo padrão já usado em
// camposSaidaExcluida.js (SaidaExcluida/GENUS.DELSAIDA), só que com o
// subconjunto ainda mais enxuto de campos que SAIDA_CANCELADA reconhece
// (sem Reforma Tributária, Ordem de Serviço, volumes transportados,
// descontos por faixa, PIS/COFINS, romaneio, carteira/classificação e sem
// nenhum timestamp de auditoria do cancelamento).
export const GRUPOS_CAMPOS_SAIDA_CANCELADA = [
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
    titulo: 'Fiscal: ICMS / IPI',
    campos: [
      { nome: 'cod_cfop', label: 'Cód. CFOP', tipo: 'texto', maxLength: 5 },
      { nome: 'icms_base', label: 'ICMS Base', tipo: 'float' },
      { nome: 'icms_valor', label: 'ICMS Valor', tipo: 'float' },
      { nome: 'icms_base_subst', label: 'ICMS Base Subst.', tipo: 'float' },
      { nome: 'icms_valor_subst', label: 'ICMS Valor Subst.', tipo: 'float' },
      { nome: 'ipi_valor', label: 'IPI Valor', tipo: 'float' },
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
    titulo: 'ECF / Cupom Fiscal / Estoque',
    campos: [
      { nome: 'cod_ecf', label: 'Cód. ECF', tipo: 'int' },
      { nome: 'ccf', label: 'CCF', tipo: 'int' },
      { nome: 'retirar_estoque', label: 'Retirar Estoque', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_tipo_venda', label: 'Cód. Tipo Venda', tipo: 'int' },
      { nome: 'chave_nfe', label: 'Chave NF-e', tipo: 'texto', maxLength: 70 },
    ],
  },
  {
    titulo: 'Transporte / Vínculos',
    campos: [
      { nome: 'cod_transportador', label: 'Cód. Transportador', tipo: 'int' },
      { nome: 'cod_agregado', label: 'Cód. Agregado', tipo: 'int' },
      { nome: 'avista_prazo', label: 'À Vista/Prazo', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_cupom_vinculado', label: 'Cód. Cupom Vinculado', tipo: 'int' },
    ],
  },
  {
    titulo: 'Liberação / Saída Física',
    campos: [
      { nome: 'dt_liberado', label: 'Data Liberado', tipo: 'data' },
      { nome: 'cod_adm', label: 'Cód. Adm.', tipo: 'int' },
      { nome: 'dt_saida', label: 'Data Saída', tipo: 'data' },
      { nome: 'hora_saida', label: 'Hora Saída', tipo: 'texto', maxLength: 8 },
    ],
  },
  {
    titulo: 'Auditoria de Origem',
    campos: [
      { nome: 'cod_digita', label: 'Cód. Digitação', tipo: 'int' },
    ],
  },
];

export const FORM_VAZIO_SAIDA_CANCELADA = GRUPOS_CAMPOS_SAIDA_CANCELADA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_SAIDA_CANCELADA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarSaidaCancelada(form) {
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
