// Estado vazio do formulário de Lançamento Contábil (GENUS.LANCAMENTO) — usado
// tanto pela janela de listagem/edição (LancamentoContabilWindow) quanto pela
// janela de criação (NovoLancamentoContabilWindow), para os dois ficarem
// sempre em sincronia com o schema do backend.
//
// Atenção: este NÃO é o mesmo conceito de "lançamento financeiro" já existente
// no ERP (título de ContaPagar/ContaReceber, exibido em FinanceiroAgrupadoWindow
// / LancamentoDetalheWindow). No GENUS, LANCAMENTO é o livro-razão contábil —
// cada linha é uma partida (dobrada ou não) num plano de contas — ver
// docstring do model LancamentoContabil em backend/models/tabelas.py.
export const FORM_VAZIO = {
  // Identificação / origem
  cod_empresa: '',
  codigo: '',
  cod_contas: '',
  cod_historico: '',
  valor: '',
  doc: '',
  obs: '',
  dt_movto: '',
  usuario: '',
  dt_digitacao: '',
  cod_centro_custo: '',

  // Auditoria de alteração (GENUS)
  cod_alteracao: '',
  hora_alteracao_genus: '',
  data_alteracao_genus: '',

  // Partida dobrada / contrapartida
  partida_dobrada: '',
  cod_partida_dobrada: '',
  cod_lanc_credito: '',

  // Origem do lançamento (baixa de título, comissão, crédito, depósito)
  cod_comissao_representante: '',
  cod_receber: '',
  cod_empresa_receber: '',
  cod_credito_fornecedor: '',
  cod_deposito: '',
};

// Campos numéricos (Integer no model) — usados pelo service para converter os
// valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'cod_empresa', 'codigo', 'cod_contas', 'cod_centro_custo', 'cod_alteracao',
  'cod_comissao_representante', 'cod_lanc_credito', 'cod_partida_dobrada',
  'cod_receber', 'cod_empresa_receber', 'cod_credito_fornecedor', 'cod_deposito',
];

export const CAMPOS_FLOAT = ['valor'];

export const CAMPOS_DATA = ['dt_movto', 'dt_digitacao', 'data_alteracao_genus'];
