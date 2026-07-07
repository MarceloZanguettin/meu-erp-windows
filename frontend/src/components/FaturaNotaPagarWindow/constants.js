// Estado vazio do formulário de Vínculo Fatura-Nota Pagar (GENUS.FATURANOTAPAGAR) —
// usado tanto pela janela de listagem/edição (FaturaNotaPagarWindow) quanto
// pela janela de criação (NovoFaturaNotaPagarWindow), para os dois ficarem
// sempre em sincronia com o schema do backend.
//
// No GENUS, FATURANOTAPAGAR é o vínculo entre uma fatura a pagar (agrupamento
// de título(s) a pagar num boleto/pagamento só — GENUS.FATURAPAGAR, ainda não
// modelada neste ERP) e a(s) nota(s) fiscal(is) de compra/entrada que a
// compõem — o análogo, no lado de contas a pagar, de FaturaNota/GENUS.FATURANOTA
// (lado de contas a receber). Ver docstring do model FaturaNotaPagar em
// backend/models/tabelas.py para o detalhe completo.
export const FORM_VAZIO = {
  // Vínculo resolvível do ERP (ContaPagar já reconhecida como GENUS.PAGAR)
  conta_pagar_id: '',

  // Identificação própria da linha em GENUS.FATURANOTAPAGAR
  cod_empresa: '',
  codigo: '',

  // Campos espelhados de GENUS.PAGAR (título a pagar original)
  tipo_doc: '',
  doc: '',
  serie: '',
  cod_fornecedor: '',
  emissao: '',
  vencimento: '',
  valor: '',
  parcela: '',
  dt_pago: '',
  valor_pago: '',
  cod_conta: '',
  cod_historico: '',
  obs: '',
  cod_empresa_pag: '',
  duplicata: '',

  // Auditoria de origem (GENUS)
  cod_alteracao: '',
  hora_alteracao_genus: '',
  data_alteracao_genus: '',

  // Boleto / controle
  linha_digitavel: '',
  previsao: '',
  cod_controle: '',
  cod_controle_empresa: '',
  cod_controle_tipo: '',
  num_doc: '',
  valor_documento: '',
  conta_cheque: '',
  doc_cheque: '',
  cod_frete: '',
  parc_real: '',
  cod_empresa_entrada: '',
  doc_parcela: '',
  cod_carteira: '',
  cod_fixo: '',
  valor_credito_fornecedor: '',

  // Vínculo com a fatura a pagar (GENUS.FATURAPAGAR, ainda não modelada)
  cod_fatura_pagar: '',
  cod_fatura_pagar_ant: '',
  cod_empresa_fat_ant: '',

  // Vínculo com a nota fiscal de compra/entrada de origem
  tipo_doc_entrada: '',
  doc_entrada: '',
  serie_entrada: '',
  cod_fornecedor_entrada: '',

  // Vínculo de volta com o título original em PAGAR (ver conta_pagar_id)
  cod_pagar: '',
  cod_empresa_pagar: '',
};

// Campos inteiros (Integer no model) — usados pelo service para converter os
// valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'conta_pagar_id', 'cod_empresa', 'codigo', 'doc', 'cod_fornecedor', 'cod_conta',
  'cod_empresa_pag', 'cod_alteracao', 'cod_controle', 'cod_controle_empresa',
  'conta_cheque', 'doc_cheque', 'cod_frete', 'cod_empresa_entrada', 'cod_carteira',
  'cod_fixo', 'cod_fatura_pagar', 'cod_fatura_pagar_ant', 'cod_empresa_fat_ant',
  'doc_entrada', 'cod_fornecedor_entrada', 'cod_pagar', 'cod_empresa_pagar',
];

// Campos numéricos decimais (Float no model)
export const CAMPOS_FLOAT = ['valor', 'valor_pago', 'valor_documento', 'valor_credito_fornecedor'];
