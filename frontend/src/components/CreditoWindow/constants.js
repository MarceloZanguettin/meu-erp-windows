// Estado vazio do formulário de Crédito de Cliente (GENUS.CREDITO) — usado
// tanto pela janela de listagem/edição (CreditoWindow) quanto pela janela de
// criação (NovoCreditoWindow), para os dois ficarem sempre em sincronia com o
// schema do backend.
//
// GENUS.CREDITO é o registro de saldo credor disponível do cliente (crédito
// que o cliente tem para abater em compras futuras) — distinto de
// `Movto`/GENUS.MOVTO (livro-razão de movimentos de crédito de cadastro) e
// de CREDITOFORNECEDOR/CREDITOICMS (ainda não modeladas). Ver docstring do
// model Credito em backend/models/tabelas.py para o detalhe completo.
export const FORM_VAZIO = {
  codigo: '',
  cod_empresa: '',
  cod_cliente: '',
  emissao: '',
  valor: '',
  obs: '',
  cod_alteracao: '',
  hora_alteracao_genus: '',
  data_alteracao_genus: '',
  cod_conta: '',
  cod_historico: '',
  cod_saida: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'codigo', 'cod_empresa', 'cod_cliente', 'cod_alteracao', 'cod_conta', 'cod_saida',
];

// Campos numéricos decimais (Float no model).
export const CAMPOS_FLOAT = ['valor'];
