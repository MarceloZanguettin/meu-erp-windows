// Configuração declarativa dos campos de CompraGenus (GENUS.COMPRAS —
// cabeçalho de solicitação/pedido de compra). Agrupamento espelha os
// comentários de seção do model `CompraGenus` em backend/models/tabelas.py —
// análogo, no lado de compras, ao já usado em
// ComprasWindow/entrada/camposEntrada.js (GENUS.ENTRADA).
export const GRUPOS_CAMPOS_COMPRA_GENUS = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'cod_funcionario', label: 'Cód. Funcionário (solicitante)', tipo: 'int' },
      { nome: 'cod_fornecedor', label: 'Cód. Fornecedor', tipo: 'int' },
      { nome: 'cod_transporte', label: 'Cód. Transportadora', tipo: 'int' },
      { nome: 'cod_destino', label: 'Cód. Destino (empresa/filial)', tipo: 'int' },
    ],
  },
  {
    titulo: 'Condição de Pagamento / Transporte',
    campos: [
      { nome: 'cod_cond_pagto', label: 'Cód. Cond. Pagto', tipo: 'texto', maxLength: 5 },
      { nome: 'placa', label: 'Placa', tipo: 'texto', maxLength: 8 },
      { nome: 'placa2', label: 'Placa 2', tipo: 'texto', maxLength: 8 },
      { nome: 'tipo_frete', label: 'Tipo Frete', tipo: 'texto', maxLength: 1 },
      { nome: 'frete', label: 'Frete', tipo: 'float' },
      { nome: 'conhecimento', label: 'Conhecimento', tipo: 'texto', maxLength: 15 },
    ],
  },
  {
    titulo: 'Valores Comerciais',
    campos: [
      { nome: 'total', label: 'Total', tipo: 'float' },
      { nome: 'desc_acres', label: 'Desconto/Acréscimo', tipo: 'float' },
    ],
  },
  {
    titulo: 'Fluxo de Aprovação / Compra',
    campos: [
      { nome: 'cod_aprovador', label: 'Cód. Aprovador', tipo: 'int' },
      { nome: 'cod_comprador', label: 'Cód. Comprador', tipo: 'int' },
      { nome: 'dt_compra', label: 'Data Compra', tipo: 'data' },
      { nome: 'dt_aprovacao', label: 'Data Aprovação', tipo: 'data' },
      { nome: 'dt_entrega', label: 'Data Entrega', tipo: 'data' },
    ],
  },
  {
    titulo: 'Recebimento',
    campos: [
      { nome: 'cod_recebedor', label: 'Cód. Recebedor', tipo: 'int' },
      { nome: 'dt_recebimento', label: 'Data Recebimento', tipo: 'data' },
    ],
  },
  {
    titulo: 'Cotação / Agregação',
    campos: [
      { nome: 'cod_cotacao', label: 'Cód. Cotação', tipo: 'int' },
      { nome: 'cod_agregado', label: 'Cód. Agregado', tipo: 'int' },
    ],
  },
  {
    titulo: 'Histórico / Observações / Status',
    campos: [
      { nome: 'cod_historico', label: 'Cód. Histórico', tipo: 'texto', maxLength: 12 },
      { nome: 'os', label: 'OS', tipo: 'texto', maxLength: 20 },
      { nome: 'status', label: 'Status', tipo: 'texto', maxLength: 50 },
      { nome: 'obs', label: 'Observação', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'E-mail',
    campos: [
      { nome: 'email_enviado', label: 'E-mail Enviado em', tipo: 'data' },
      { nome: 'email_cod_funcionario', label: 'Cód. Funcionário (e-mail)', tipo: 'int' },
    ],
  },
];

export const FORM_VAZIO_COMPRA_GENUS = GRUPOS_CAMPOS_COMPRA_GENUS
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_COMPRA_GENUS
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarCompraGenus(form) {
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
