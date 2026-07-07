/**
 * Configuração declarativa dos campos migrados da tabela PAGAR do GENUS
 * (GENUS_ZANGUETTIN.FDB), exibidos na aba "GENUS" do LancamentoDetalheWindow
 * quando o lançamento é do tipo "pagar".
 *
 * Cada campo: { key, label, type }
 *   type: 'int' | 'float' | 'text' | 'date'
 * `key` corresponde 1:1 ao nome do campo no model ContaPagar / schema
 * ContaPagarOut (backend/models/tabelas.py, backend/schemas/financeiro.py).
 */
export const GENUS_PAGAR_SECOES = [
  {
    titulo: 'Identificação (GENUS)',
    campos: [
      { key: 'cod_empresa',     label: 'Cód. Empresa',     type: 'int' },
      { key: 'codigo',          label: 'Código (título)',  type: 'int' },
      { key: 'tipo_doc',        label: 'Tipo Doc.',        type: 'text', maxLength: 1 },
      { key: 'doc',             label: 'Doc.',             type: 'int' },
      { key: 'serie',           label: 'Série',            type: 'text', maxLength: 4 },
      { key: 'cod_fornecedor',  label: 'Cód. Fornecedor',  type: 'int' },
      { key: 'emissao',         label: 'Emissão',          type: 'date' },
      { key: 'parcela',         label: 'Parcela',          type: 'text', maxLength: 7 },
      { key: 'valor_pago',      label: 'Valor Pago',       type: 'float' },
      { key: 'cod_conta',       label: 'Cód. Conta',       type: 'int' },
      { key: 'cod_historico',   label: 'Cód. Histórico',   type: 'text', maxLength: 12 },
      { key: 'cod_empresa_pag', label: 'Cód. Empresa Pag.',type: 'int' },
      { key: 'duplicata',       label: 'Duplicata',        type: 'text', maxLength: 15 },
    ],
  },
  {
    titulo: 'Boleto / Controle',
    campos: [
      { key: 'linha_digitavel',      label: 'Linha Digitável',    type: 'text', maxLength: 60 },
      { key: 'previsao',             label: 'Previsão',           type: 'text', maxLength: 1 },
      { key: 'cod_controle',         label: 'Cód. Controle',      type: 'int' },
      { key: 'cod_controle_empresa', label: 'Cód. Controle Emp.', type: 'int' },
      { key: 'cod_controle_tipo',    label: 'Cód. Controle Tipo', type: 'text', maxLength: 1 },
      { key: 'num_doc',              label: 'Núm. Documento',     type: 'text', maxLength: 20 },
      { key: 'valor_documento',      label: 'Valor Documento',    type: 'float' },
      { key: 'conta_cheque',         label: 'Conta Cheque',       type: 'int' },
      { key: 'doc_cheque',           label: 'Doc. Cheque',        type: 'int' },
      { key: 'cod_frete',            label: 'Cód. Frete',         type: 'int' },
      { key: 'parc_real',            label: 'Parc. Real',         type: 'text', maxLength: 1 },
      { key: 'cod_empresa_entrada',  label: 'Cód. Empresa Entrada', type: 'int' },
      { key: 'doc_parcela',          label: 'Doc. Parcela',       type: 'text', maxLength: 15 },
      { key: 'cod_carteira',         label: 'Cód. Carteira',      type: 'int' },
      { key: 'cod_fixo',             label: 'Cód. Fixo',          type: 'int' },
      { key: 'valor_credito_fornecedor', label: 'Valor Crédito Fornecedor', type: 'float' },
      { key: 'cod_fatura_pagar',     label: 'Cód. Fatura Pagar',  type: 'int' },
    ],
  },
  {
    titulo: 'Auditoria de Origem (GENUS)',
    campos: [
      { key: 'cod_alteracao',        label: 'Cód. Alteração', type: 'int' },
      { key: 'hora_alteracao_genus', label: 'Hora Alteração', type: 'text', maxLength: 8 },
      { key: 'data_alteracao_genus', label: 'Data Alteração', type: 'date' },
    ],
  },
];

/** Lista plana de todas as chaves GENUS, útil para inicializar/serializar o form. */
export const GENUS_PAGAR_CAMPOS = GENUS_PAGAR_SECOES.flatMap(s => s.campos);

/** Constrói o pedaço do form correspondente aos campos GENUS a partir de uma conta. */
export function buildGenusPagarFormFromConta(conta) {
  const out = {};
  for (const { key, type } of GENUS_PAGAR_CAMPOS) {
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
export function serializeGenusPagarForm(form) {
  const out = {};
  for (const { key, type } of GENUS_PAGAR_CAMPOS) {
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
