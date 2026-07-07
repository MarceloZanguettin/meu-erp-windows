// Estado vazio do formulário de Banco Sicred — Retorno/Remessa (GENUS.BCOSICRED)
// — usado tanto pela janela de listagem/edição (BcoSicredWindow) quanto pela
// janela de criação (NovoBcoSicredWindow), para os dois ficarem sempre em
// sincronia com o schema do backend.
//
// No GENUS, BCOSICRED é uma tabela de layout de arquivo de retorno/remessa
// bancária (CNAB) específica do Banco Sicred — parâmetros de cobrança/
// boleto por empresa (agência, conta, carteira, convênio, instruções,
// juros/multa etc.). É análoga, dentro do GENUS, às tabelas irmãs
// BCOBRADESCO, BCOBRASIL, BCOCAIXA, BCOHSBC, BCOITAU, BCOSANTANDER e
// BCOSICOOB — ainda não modeladas neste ERP. Ver docstring do model
// BcoSicred em backend/models/tabelas.py para o detalhe completo de cada
// campo (inclui a nota sobre CODCEDENTE ser provavelmente, mas não
// confirmadamente, uma FK para CADASTRO).
export const FORM_VAZIO = {
  codigo: '',
  agencia: '',
  conta: '',
  juros_mora: '',
  sequencia: '',
  aceite: '',
  dias_protesto: '',
  instrucao1: '',
  instrucao2: '',
  cod_carteira: '',
  cod_empresa: '',
  cod_cedente: '',
  especie: '',
  observacao: '',
  seq_remessa: '',
  carteira: '',
  convenio: '',
  cnab: '',
  emitir_boleto: '',
  posto: '',
  postar: '',
  tipo_juros: '',
  caminho: '',
  multa: '',
  numero: '',
  carteira_banco: '',
};

// Campos numéricos inteiros (Integer no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'codigo', 'sequencia', 'dias_protesto', 'cod_carteira', 'cod_empresa',
  'cod_cedente', 'seq_remessa', 'numero', 'carteira_banco',
];

// Campos numéricos decimais (Float no model).
export const CAMPOS_FLOAT = ['juros_mora', 'multa'];
