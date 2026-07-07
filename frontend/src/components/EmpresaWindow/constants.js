// Estado vazio do formulário de Empresa (GENUS.EMPRESA) — usado tanto pela
// janela de listagem/edição (EmpresaWindow) quanto pela janela de criação
// (NovoEmpresaWindow), para os dois ficarem sempre em sincronia com o schema
// do backend.
//
// O campo original do ERP (`nome`) continua sendo a identidade da empresa
// usada por ContaBancaria/ContaPagar/ContaReceber — veja o docstring do
// model Empresa em backend/models/tabelas.py. Diferente de outras entidades
// GENUS já migradas nesta sessão (Cliente/Fornecedor/Representante/
// Funcionario/Transportadora), EMPRESA não tem CODCADASTRO — não exige JOIN
// com CADASTRO para ficar completa.
export const FORM_VAZIO = {
  // Identidade (ERP)
  nome: '',

  // Identificação (GENUS)
  codigo: '',
  razao: '',
  fantasia: '',
  cod_cidade: '',
  endereco: '',
  numero: '',
  bairro: '',
  cep: '',
  cnpj: '',
  insc: '',
  fone: '',
  fax: '',
  email: '',
  www: '',
  simples: '',
  serie: '',
  credito_icms: '',
  tipo_comercio: '',
  cnae: '',
  insc_municipal: '',
  arq_banco: '',

  // Tributação / percentuais
  pis: '',
  cofins: '',
  ir: '',
  contrib_social: '',
  propaganda: '',
  comissao: '',
  fretes: '',
  outros: '',
  simples_percento: '',
  iss: '',
  embalagens: '',
  juros: '',

  // E-mail / SMTP
  smtp_porta: '',
  smtp_host: '',
  smtp_password: '',
  smtp_username: '',
  from_address: '',
  from_name: '',
  autenticar_email_ssl: '',

  // Contador
  cnpj_cont: '',
  nome_cont: '',
  cpf_cnpj_cont: '',
  crc_cont: '',
  cep_cont: '',
  endereco_cont: '',
  num_cont: '',
  bairro_cont: '',
  fone_cont: '',
  fax_cont: '',
  email_cont: '',
  cod_cidade_cont: '',

  // Regime tributário / atividade
  regime_apuracao: '',
  regime_tributacao: '',
  atividade_municipal: '',
  atividade_federal: '',
  aliq_municipal: '',
  classif_comercial: '',
  cod_gare_icms: '',
  icms_pis_cofins_entrada: '',
  icms_pis_cofins_saida: '',
  calcular_icms_dentro_estado: '',
  reforma_tributaria: '',

  // Financeiro / cobrança
  dias_vencimento: '',
  mora: '',
  multa: '',
  inss: '',
  fundo_garantia: '',

  // Certificado digital / arquivos / integrações
  num_certificado: '',
  caminho_logo: '',
  caminho_xml: '',
  salvar_xml: '',
  senha_padrao: '',
  rntrc: '',
  foto_logo: '',
  situacao: '',

  // NFe / NSU (SEFAZ)
  ult_nsu: '',
  max_nsu: '',
  data_ultima_consulta_nsu: '',
  hora_ultima_consulta_nsu: '',

  // CTe / NSU (SEFAZ)
  ult_nsu_cte: '',
  max_nsu_cte: '',
  data_ultima_consulta_nsu_cte: '',
  hora_ultima_consulta_nsu_cte: '',

  // Integração Gmail
  client_id_gmail: '',
  client_secret_gmail: '',
  token_gmail: '',
  refresh_token_gmail: '',
  codigo_gmail: '',
};

// Campos numéricos (Integer/Float no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'codigo', 'cod_cidade', 'smtp_porta', 'cod_cidade_cont', 'dias_vencimento',
];

export const CAMPOS_FLOAT = [
  'credito_icms', 'pis', 'cofins', 'ir', 'contrib_social', 'propaganda',
  'comissao', 'fretes', 'outros', 'simples_percento', 'iss', 'embalagens',
  'juros', 'aliq_municipal', 'mora', 'multa', 'inss', 'fundo_garantia',
];

export const CAMPOS_DATA = [
  'data_ultima_consulta_nsu', 'data_ultima_consulta_nsu_cte',
];
