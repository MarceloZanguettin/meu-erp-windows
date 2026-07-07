// Estado vazio do formulário de Cadastro (GENUS.CADASTRO) — usado tanto pela
// janela de listagem/edição (CadastroPessoaWindow) quanto pela janela de
// criação (NovoCadastroPessoaWindow), para manter os dois formulários em
// sincronia com o schema do backend.
export const FORM_VAZIO = {
  // Identificação
  codigo: '',
  cpf_cnpj: '',
  data_cadastro: '',
  nome: '',
  fantasia: '',
  pessoa: 'J',
  situacao: 'A',

  // Endereço
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cod_cidade: '',
  cep: '',

  // Contato
  site: '',
  email: '',
  email_financeiro: '',
  fone: '',
  fone2: '',
  celular: '',
  mobile: '',
  referencia_comercial: '',
  observacao: '',

  // Dados pessoais (pessoa física)
  data_nascimento: '',
  local_nascimento: '',
  pais_nacionalidade: '',
  nome_pai: '',
  nome_mae: '',
  rg_insc: '',
  orgao_uf_rg: '',
  data_emissao_rg: '',
  passaporte: '',
  escolaridade: '',
  cor: '',
  deficiencia: '',
  estado_civil: '',
  sexo: '',
  reter_ir: '',

  // Fiscal
  insc_suframa: '',
  zona_franca: '',
  apuracao: '',

  // Transferência entre empresas / código antigo (multi-empresa GENUS)
  cod_empresa_transferencia: '',
  cod_empresa_transf1: '',
  cod_empresa_transf2: '',
  cod_antigo_transfere: '',
  cod_antigo_transfere1: '',
  cod_antigo_transfere2: '',

  // Auditoria de origem (GENUS)
  cod_alteracao: '',
  hora_alteracao_genus: '',
  data_alteracao_genus: '',
};
