// Estado vazio do formulário de Fixo a Pagar (GENUS.FIXOPAGAR) — usado tanto
// pela janela de listagem/edição (FixoPagarWindow) quanto pela janela de
// criação (NovoFixoPagarWindow), para os dois ficarem sempre em sincronia
// com o schema do backend.
//
// No GENUS, FIXOPAGAR é o cadastro mestre de um título fixo/recorrente a
// pagar (mensalidade, aluguel, despesa fixa mensal etc.) — valor, dia de
// vencimento, período de vigência (INICIO/TERMINO) e quantidade de
// parcelas. É referenciado por MOVTOFIXO.CODFIXOPAGAR (ver model
// MovimentoFixo em backend/models/tabelas.py) para controlar, mês a mês,
// se o movimento do título já foi gerado/baixado para a competência.
export const FORM_VAZIO = {
  codigo: '',
  cod_empresa: '',
  cod_cadastro: '',
  cod_contas: '',
  inicio: '',
  termino: '',
  valor: '',
  dia: '',
  obs: '',
  qtde_parcela: '',
  cod_carteira: '',
  cod_historico: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'codigo', 'cod_empresa', 'cod_cadastro', 'cod_contas', 'dia',
  'qtde_parcela', 'cod_carteira',
];

// Campos numéricos decimais (Float no model).
export const CAMPOS_FLOAT = ['valor'];
