/**
 * Configuração declarativa dos campos migrados da tabela RECEBER do GENUS
 * (GENUS_ZANGUETTIN.FDB), exibidos na aba "GENUS" do LancamentoDetalheWindow
 * quando o lançamento é do tipo "receber".
 *
 * Cada campo: { key, label, type }
 *   type: 'int' | 'float' | 'text' | 'date'
 * `key` corresponde 1:1 ao nome do campo no model ContaReceber / schema
 * ContaReceberOut (backend/models/tabelas.py, backend/schemas/financeiro.py).
 */
export const GENUS_RECEBER_SECOES = [
  {
    titulo: 'Identificação (GENUS)',
    campos: [
      { key: 'cod_empresa',     label: 'Cód. Empresa',     type: 'int' },
      { key: 'codigo',          label: 'Código (título)',  type: 'int' },
      { key: 'cod_saida',       label: 'Cód. Saída',       type: 'int' },
      { key: 'parcela',         label: 'Parcela',          type: 'text', maxLength: 5 },
      { key: 'cod_cliente',     label: 'Cód. Cliente',     type: 'int' },
      { key: 'emissao',         label: 'Emissão',          type: 'date' },
      { key: 'valor_pago',      label: 'Valor Pago',       type: 'float' },
      { key: 'cod_historico',   label: 'Cód. Histórico',   type: 'text', maxLength: 12 },
      { key: 'cod_contas',      label: 'Cód. Contas',      type: 'int' },
      { key: 'tipo_doc',        label: 'Tipo Doc.',        type: 'text', maxLength: 1 },
      { key: 'doc',             label: 'Doc.',             type: 'int' },
      { key: 'cod_empresa_rec', label: 'Cód. Empresa Rec.',type: 'int' },
      { key: 'imp_boleto',      label: 'Imp. Boleto',      type: 'text', maxLength: 1 },
      { key: 'cod_movto',       label: 'Cód. Movto.',      type: 'int' },
    ],
  },
  {
    titulo: 'Boleto / Cobrança',
    campos: [
      { key: 'nosso_numero',      label: 'Nosso Número',        type: 'text', maxLength: 20 },
      { key: 'cod_carteira',      label: 'Cód. Carteira',       type: 'int' },
      { key: 'cod_fatura',        label: 'Cód. Fatura',         type: 'int' },
      { key: 'comissao',          label: 'Comissão',            type: 'float' },
      { key: 'processamento',     label: 'Processamento',       type: 'date' },
      { key: 'remessa',           label: 'Remessa',              type: 'int' },
      { key: 'lote',              label: 'Lote',                 type: 'int' },
      { key: 'cod_retorno',       label: 'Cód. Retorno',        type: 'int' },
      { key: 'banco_remessa',     label: 'Banco Remessa',       type: 'text', maxLength: 20 },
      { key: 'num_transacao',     label: 'Núm. Transação',      type: 'text', maxLength: 15 },
      { key: 'valor_financeiro',  label: 'Valor Financeiro',    type: 'float' },
      { key: 'obs_boleto',        label: 'Obs. Boleto',         type: 'text', maxLength: 160 },
      { key: 'valor_deposito',    label: 'Valor Depósito',      type: 'float' },
    ],
  },
  {
    titulo: 'SCPC / Protesto / Cartório',
    campos: [
      { key: 'scpc_enviado',         label: 'SCPC Enviado',          type: 'date' },
      { key: 'scpc_retirado',        label: 'SCPC Retirado',         type: 'date' },
      { key: 'carta_cobranca',       label: 'Carta Cobrança',        type: 'date' },
      { key: 'carta_scpc',           label: 'Carta SCPC',            type: 'date' },
      { key: 'data_protesto',        label: 'Data Protesto',         type: 'date' },
      { key: 'protocolo_protesto',   label: 'Protocolo Protesto',    type: 'text', maxLength: 30 },
      { key: 'obs_protesto',         label: 'Obs. Protesto',         type: 'text', maxLength: 80 },
      { key: 'obs_retira_protesto',  label: 'Obs. Retira Protesto',  type: 'text', maxLength: 80 },
      { key: 'valor_cartorio',       label: 'Valor Cartório',        type: 'float' },
    ],
  },
  {
    titulo: 'Multa / Mora / Desconto',
    campos: [
      { key: 'data_multa',      label: 'Data Multa',      type: 'date' },
      { key: 'multa',           label: 'Multa (%)',       type: 'float' },
      { key: 'mora',            label: 'Mora (%)',        type: 'float' },
      { key: 'desconto',        label: 'Desconto (%)',    type: 'float' },
      { key: 'data_desconto',   label: 'Data Desconto',   type: 'date' },
      { key: 'valor_multa',     label: 'Valor Multa',     type: 'float' },
      { key: 'valor_mora',      label: 'Valor Mora',      type: 'float' },
      { key: 'valor_desconto',  label: 'Valor Desconto',  type: 'float' },
    ],
  },
  {
    titulo: 'Fiscal',
    campos: [
      { key: 'pis_cofins', label: 'PIS/COFINS', type: 'float' },
      { key: 'iss',        label: 'ISS',        type: 'float' },
    ],
  },
  {
    titulo: 'Ocorrência / Responsáveis',
    campos: [
      { key: 'ocorrencia',         label: 'Ocorrência',          type: 'text', maxLength: 80 },
      { key: 'funcionario_baixa',  label: 'Funcionário Baixa',   type: 'int' },
      { key: 'cod_frete',          label: 'Cód. Frete',          type: 'int' },
      { key: 'cod_representante',  label: 'Cód. Representante',  type: 'int' },
      { key: 'cod_locacao',        label: 'Cód. Locação',        type: 'int' },
      { key: 'cod_empresa_saida',  label: 'Cód. Empresa Saída',  type: 'int' },
      { key: 'cod_fixo',           label: 'Cód. Fixo',           type: 'int' },
    ],
  },
  {
    titulo: 'Auditoria de Origem (GENUS)',
    campos: [
      { key: 'cod_alteracao',        label: 'Cód. Alteração',        type: 'int' },
      { key: 'hora_alteracao_genus', label: 'Hora Alteração',        type: 'text', maxLength: 8 },
      { key: 'data_alteracao_genus', label: 'Data Alteração',        type: 'date' },
      { key: 'valor_credito',        label: 'Valor Crédito',         type: 'float' },
      { key: 'cod_antigo_receber',   label: 'Cód. Antigo (Receber)', type: 'int' },
    ],
  },
];

/** Lista plana de todas as chaves GENUS, útil para inicializar/serializar o form. */
export const GENUS_RECEBER_CAMPOS = GENUS_RECEBER_SECOES.flatMap(s => s.campos);

/** Constrói o pedaço do form correspondente aos campos GENUS a partir de uma conta. */
export function buildGenusFormFromConta(conta) {
  const out = {};
  for (const { key, type } of GENUS_RECEBER_CAMPOS) {
    const valor = conta?.[key];
    if (type === 'date') {
      out[key] = valor ? String(valor).slice(0, 10) : '';
    } else {
      out[key] = valor ?? '';
    }
  }
  return out;
}

/** Converte o pedaço GENUS do form de volta para o formato esperado pela API. */
export function serializeGenusForm(form) {
  const out = {};
  for (const { key, type } of GENUS_RECEBER_CAMPOS) {
    const valor = form[key];
    if (valor === '' || valor === null || valor === undefined) {
      out[key] = null;
      continue;
    }
    if (type === 'int') out[key] = parseInt(valor, 10);
    else if (type === 'float') out[key] = parseFloat(valor);
    else if (type === 'date') out[key] = valor + 'T12:00:00';
    else out[key] = valor;
  }
  return out;
}
