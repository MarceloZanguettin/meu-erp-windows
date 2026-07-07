// Estado vazio do formulário de Comissão (GENUS.COMISSAO) — usado tanto pela
// janela de listagem/edição (ComissaoWindow) quanto pela janela de criação
// (NovoComissaoWindow), para os dois ficarem sempre em sincronia com o schema
// do backend.
//
// No GENUS, COMISSAO registra o cálculo/lançamento de comissão de um
// representante sobre uma saída/nota fiscal — ver docstring do model
// Comissao em backend/models/tabelas.py.
export const FORM_VAZIO = {
  representante_id: '',
  codigo: '',
  cod_empresa: '',
  cod_representante: '',
  cod_saida: '',
  nota_fiscal: '',
  cod_prospeccao: '',
  cod_pedido: '',
  cod_receber: '',
  cod_deposito: '',
  cod_pagar: '',
  emissao: '',
  vencimento: '',
  dt_processamento: '',
  valor_comissao: '',
  percentual_comissao: '',
  total: '',
  deducao: '',
  tipo_comissao: '',
  tipo_func: '',
};

// Campos inteiros (Integer no model) — usados pelo service para converter os
// valores de texto dos <input>/<select> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'representante_id', 'codigo', 'cod_empresa', 'cod_representante', 'cod_saida',
  'nota_fiscal', 'cod_prospeccao', 'cod_pedido', 'cod_receber', 'cod_deposito', 'cod_pagar',
];

// Campos numéricos decimais (Float no model)
export const CAMPOS_FLOAT = ['valor_comissao', 'percentual_comissao', 'total', 'deducao'];
