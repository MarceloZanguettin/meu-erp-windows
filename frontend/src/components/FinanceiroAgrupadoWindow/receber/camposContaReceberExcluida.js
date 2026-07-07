// Configuração declarativa dos campos de ContaReceberExcluida (GENUS.DELRECEBER
// — histórico/snapshot de um título de contas a receber excluído).
// Agrupamento espelha os comentários de seção do model `ContaReceberExcluida`
// em backend/models/tabelas.py — mesmo padrão já usado em
// camposSaidaExcluida.js (SaidaExcluida/GENUS.DELSAIDA), só que para o
// título de contas a receber (ContaReceber/GENUS.RECEBER).
export const GRUPOS_CAMPOS_CONTA_RECEBER_EXCLUIDA = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'cod_saida', label: 'Cód. Saída', tipo: 'int' },
      { nome: 'parcela', label: 'Parcela', tipo: 'texto', maxLength: 5 },
      { nome: 'cod_cliente', label: 'Cód. Cliente', tipo: 'int' },
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'data_vencimento', label: 'Vencimento', tipo: 'data' },
      { nome: 'valor', label: 'Valor', tipo: 'float' },
      { nome: 'data_recebimento', label: 'Data Pagamento', tipo: 'data' },
      { nome: 'valor_pago', label: 'Valor Pago', tipo: 'float' },
      { nome: 'cod_historico', label: 'Cód. Histórico', tipo: 'texto', maxLength: 12 },
      { nome: 'cod_contas', label: 'Cód. Contas', tipo: 'int' },
      { nome: 'dt_digitacao', label: 'Data Digitação', tipo: 'data' },
      { nome: 'tipo_doc', label: 'Tipo Doc', tipo: 'texto', maxLength: 1 },
      { nome: 'doc', label: 'Doc', tipo: 'int' },
      { nome: 'cod_empresa_rec', label: 'Cód. Empresa Rec.', tipo: 'int' },
    ],
  },
  {
    titulo: 'Observação',
    campos: [
      { nome: 'observacao', label: 'Observação', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Boleto / Carteira / Cobrança',
    campos: [
      { nome: 'imp_boleto', label: 'Imp. Boleto', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_movto', label: 'Cód. Movto', tipo: 'int' },
      { nome: 'nosso_numero', label: 'Nosso Número', tipo: 'texto', maxLength: 20 },
      { nome: 'cod_carteira', label: 'Cód. Carteira', tipo: 'int' },
      { nome: 'cod_fatura', label: 'Cód. Fatura', tipo: 'int' },
      { nome: 'comissao', label: 'Comissão', tipo: 'float' },
      { nome: 'processamento', label: 'Processamento', tipo: 'data' },
    ],
  },
  {
    titulo: 'SCPC / Cartório / Protesto',
    campos: [
      { nome: 'scpc_enviado', label: 'SCPC Enviado', tipo: 'data' },
      { nome: 'scpc_retirado', label: 'SCPC Retirado', tipo: 'data' },
      { nome: 'carta_cobranca', label: 'Carta Cobrança', tipo: 'data' },
      { nome: 'carta_scpc', label: 'Carta SCPC', tipo: 'data' },
    ],
  },
  {
    titulo: 'Auditoria de Origem (GENUS)',
    campos: [
      { nome: 'cod_alteracao', label: 'Cód. Alteração', tipo: 'int' },
      { nome: 'hora_alteracao_genus', label: 'Hora Alteração', tipo: 'texto', maxLength: 8 },
      { nome: 'data_alteracao_genus', label: 'Data Alteração', tipo: 'data' },
      { nome: 'valor_credito', label: 'Valor Crédito', tipo: 'float' },
      { nome: 'remessa', label: 'Remessa', tipo: 'int' },
    ],
  },
  {
    titulo: 'Auditoria da Exclusão',
    campos: [
      { nome: 'dt_exclusao', label: 'Data Exclusão', tipo: 'data' },
    ],
  },
];

export const FORM_VAZIO_CONTA_RECEBER_EXCLUIDA = GRUPOS_CAMPOS_CONTA_RECEBER_EXCLUIDA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_CONTA_RECEBER_EXCLUIDA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarContaReceberExcluida(form) {
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
