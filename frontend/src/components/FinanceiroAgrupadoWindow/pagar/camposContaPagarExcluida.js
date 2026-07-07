// Configuração declarativa dos campos de ContaPagarExcluida (GENUS.DELPAGAR
// — histórico/snapshot de um título de contas a pagar excluído).
// Agrupamento espelha os comentários de seção do model `ContaPagarExcluida`
// em backend/models/tabelas.py — mesmo padrão já usado em
// camposContaReceberExcluida.js (ContaReceberExcluida/GENUS.DELRECEBER), só
// que para o título de contas a pagar (ContaPagar/GENUS.PAGAR).
export const GRUPOS_CAMPOS_CONTA_PAGAR_EXCLUIDA = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'tipo_doc', label: 'Tipo Doc', tipo: 'texto', maxLength: 1 },
      { nome: 'doc', label: 'Doc', tipo: 'int' },
      { nome: 'serie', label: 'Série', tipo: 'texto', maxLength: 4 },
      { nome: 'cod_fornecedor', label: 'Cód. Fornecedor', tipo: 'int' },
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'data_vencimento', label: 'Vencimento', tipo: 'data' },
      { nome: 'valor', label: 'Valor', tipo: 'float' },
      { nome: 'parcela', label: 'Parcela', tipo: 'texto', maxLength: 7 },
      { nome: 'data_pagamento', label: 'Data Pagamento', tipo: 'data' },
      { nome: 'valor_pago', label: 'Valor Pago', tipo: 'float' },
      { nome: 'cod_conta', label: 'Cód. Conta', tipo: 'int' },
      { nome: 'cod_historico', label: 'Cód. Histórico', tipo: 'texto', maxLength: 12 },
      { nome: 'cod_empresa_pag', label: 'Cód. Empresa Pag.', tipo: 'int' },
      { nome: 'duplicata', label: 'Duplicata', tipo: 'texto', maxLength: 15 },
    ],
  },
  {
    titulo: 'Observação',
    campos: [
      { nome: 'observacao', label: 'Observação', tipo: 'textarea', maxLength: 70 },
    ],
  },
  {
    titulo: 'Auditoria de Origem (GENUS)',
    campos: [
      { nome: 'cod_alteracao', label: 'Cód. Alteração', tipo: 'int' },
      { nome: 'hora_alteracao_genus', label: 'Hora Alteração', tipo: 'texto', maxLength: 8 },
      { nome: 'data_alteracao_genus', label: 'Data Alteração', tipo: 'data' },
      { nome: 'linha_digitavel', label: 'Linha Digitável', tipo: 'texto', maxLength: 60 },
    ],
  },
  {
    titulo: 'Auditoria da Exclusão',
    campos: [
      { nome: 'dt_exclusao', label: 'Data Exclusão', tipo: 'data' },
      { nome: 'valor_documento', label: 'Valor Documento', tipo: 'float' },
      { nome: 'doc_parcela', label: 'Doc. Parcela', tipo: 'texto', maxLength: 15 },
    ],
  },
];

export const FORM_VAZIO_CONTA_PAGAR_EXCLUIDA = GRUPOS_CAMPOS_CONTA_PAGAR_EXCLUIDA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_CONTA_PAGAR_EXCLUIDA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarContaPagarExcluida(form) {
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
