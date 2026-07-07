// Estado vazio do formulário de Movimento de Crédito (GENUS.MOVTO) — usado
// tanto pela janela de listagem/edição (MovtoWindow) quanto pela janela de
// criação (NovoMovtoWindow), para os dois ficarem sempre em sincronia com o
// schema do backend.
//
// No GENUS, MOVTO parece ser um livro-razão de crédito de cadastro (ex.:
// crédito de devolução, "vale-troca"), e não um extrato bancário — não tem
// nenhuma coluna CODCONTAS. Ver docstring do model Movto em
// backend/models/tabelas.py para o detalhe completo, incluindo a nota sobre
// essa hipótese inicial descartada.
export const FORM_VAZIO = {
  codigo: '',
  cod_empresa: '',
  cod_cadastro: '',
  emissao: '',
  cod_funcionario: '',
  tipo: '',
  cod_saida: '',
  credito: '',
  obs: '',
  dt_credito: '',
  cod_alteracao: '',
  hora_alteracao_genus: '',
  data_alteracao_genus: '',
  cod_cadastro_credito: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'codigo', 'cod_empresa', 'cod_cadastro', 'cod_funcionario',
  'cod_saida', 'cod_alteracao', 'cod_cadastro_credito',
];

// Campos numéricos decimais (Float no model).
export const CAMPOS_FLOAT = ['credito'];
