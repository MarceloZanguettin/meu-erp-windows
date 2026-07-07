// Estado vazio do formulário de Cheque Emitido (GENUS.CHEQUE_EMITIDO) — usado
// tanto pela janela de listagem/edição (ChequeEmitidoWindow) quanto pela
// janela de criação (NovoChequeEmitidoWindow), para os dois ficarem sempre em
// sincronia com o schema do backend.
//
// No GENUS, CHEQUE_EMITIDO é o cheque próprio emitido pela empresa para
// pagar um fornecedor/título — o contraponto, no lado de contas a pagar, de
// GENUS.CHEQUE (cheque de terceiro recebido, ainda não modelado neste ERP).
// Ver docstring do model ChequeEmitido em backend/models/tabelas.py.
export const FORM_VAZIO = {
  conta_pagar_id: '',
  cod_empresa: '',
  cod_contas: '',
  cheque: '',
  valor: '',
  para: '',
  devolve: '',
  dt_baixa: '',
  obs: '',
  cod_pagar: '',
  digitado: '',
  cod_historico: '',
  nominal: '',
  cod_alteracao: '',
  hora_alteracao_genus: '',
  data_alteracao_genus: '',
  emissao: '',
  cod_empresa_pagar: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input>/<select> antes de enviar ao
// backend.
export const CAMPOS_INTEIROS = [
  'conta_pagar_id', 'cod_empresa', 'cod_contas', 'cheque',
  'cod_pagar', 'cod_alteracao', 'cod_empresa_pagar',
];

// Campos numéricos decimais (Float no model).
export const CAMPOS_FLOAT = ['valor'];
