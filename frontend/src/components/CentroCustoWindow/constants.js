// Estado vazio do formulário de Centro de Custo (GENUS.CENTROCUSTO) — usado
// tanto pela janela de listagem/edição (CentroCustoWindow) quanto pela janela
// de criação (NovoCentroCustoWindow), para os dois ficarem sempre em
// sincronia com o schema do backend.
//
// Atenção: apesar do nome, a tabela GENUS.CENTROCUSTO não é um "centro de
// custo" contábil — é uma extensão de PRODUTO por empresa/filial (chave real
// CODPRODUTO + CODEMPRESA), com preços, tributos e, quando o "produto" é um
// bem patrimonial, dados de patrimônio/depreciação/veículo. Os três campos
// originais do ERP (codigo, nome, ativo) continuam sendo a identidade do
// centro de custo contábil usada em Solicitação de Compra — veja o
// docstring do model CentroCusto em backend/models/tabelas.py.
export const FORM_VAZIO = {
  // Identidade do centro de custo (ERP)
  codigo: '',
  nome: '',
  ativo: true,

  // Identificação (chave real da tabela GENUS: CODPRODUTO + CODEMPRESA)
  cod_produto: '',
  cod_empresa: '',
  pertence_empresa: '',

  // Preço / comercial
  ecf_aliquota: '',
  custo: '',
  venda: '',
  frete: '',
  minimo: '',
  maximo: '',
  qtde: '',
  consignacao: '',
  valor_promocao: '',
  inicio_promocao: '',
  fim_promocao: '',
  estoque_cliente: '',
  custo_fixo: '',
  margem_lucro: '',
  comissao: '',
  avista: '',
  comissao_avista: '',
  percentual_avista: '',
  preco_minimo: '',
  percentual_a_prazo: '',
  percentual_minimo: '',
  ultimo_custo: '',
  custo_medio: '',
  preco_sugerido: '',
  unitario_compra: '',
  fornecedor_compra: '',
  mao_de_obra: '',
  custo_materia: '',
  localizacao_produto: '',

  // Estoque
  estoque_reservado: '',
  fisico: '',

  // Fiscal
  reducao_icms: '',
  diferenca_subst: '',
  diferenca_icms: '',
  ipi_entrada: '',
  ipi_cst_entrada: '',
  ipi_cst_saida: '',
  pis_cst: '',
  pis_aliquota: '',
  pis_reais: '',
  pis_cst_entrada: '',
  pis_aliquota_entrada: '',
  pis_reais_entrada: '',
  cofins_cst: '',
  cofins_aliquota: '',
  cofins_reais: '',
  cofins_cst_entrada: '',
  cofins_aliquota_entrada: '',
  cofins_reais_entrada: '',

  // Balança
  tecla_balanca: '',
  tipo_balanca: '',
  cod_balanca: '',
  validade: '',

  // Patrimônio / bem (veículo, equipamento etc.)
  data_aquisicao: '',
  nota_patrimonio: '',
  cod_patrimonio: '',
  valor_patrimonio: '',
  data_garantia: '',
  data_depreciacao: '',
  taxa_depreciacao: '',
  valor_depreciacao: '',
  data_revisao: '',
  placa: '',
  chassi: '',
  capacidade: '',
  troca_oleo_km: '',
  data_troca_oleo: '',

  // Auditoria de origem (GENUS)
  data_alteracao_genus: '',
  data_hora_alterado_genus: '',
};

// Campos numéricos (Integer/Float no model) — usados pelo service para
// converter os valores de texto dos <input> antes de enviar ao backend.
export const CAMPOS_INTEIROS = [
  'cod_empresa', 'fornecedor_compra', 'tecla_balanca', 'cod_balanca',
  'validade', 'nota_patrimonio', 'cod_patrimonio', 'troca_oleo_km',
];

export const CAMPOS_FLOAT = [
  'custo', 'venda', 'frete', 'minimo', 'maximo', 'qtde', 'consignacao',
  'valor_promocao', 'estoque_cliente', 'custo_fixo', 'margem_lucro',
  'comissao', 'avista', 'comissao_avista', 'percentual_avista',
  'preco_minimo', 'percentual_a_prazo', 'percentual_minimo', 'ultimo_custo',
  'custo_medio', 'preco_sugerido', 'unitario_compra', 'mao_de_obra',
  'custo_materia', 'estoque_reservado', 'fisico', 'reducao_icms',
  'diferenca_subst', 'diferenca_icms', 'ipi_entrada', 'pis_aliquota',
  'pis_reais', 'pis_aliquota_entrada', 'pis_reais_entrada', 'cofins_aliquota',
  'cofins_reais', 'cofins_aliquota_entrada', 'cofins_reais_entrada',
  'valor_patrimonio', 'taxa_depreciacao', 'valor_depreciacao', 'capacidade',
];

export const CAMPOS_DATA = [
  'inicio_promocao', 'fim_promocao', 'data_aquisicao', 'data_garantia',
  'data_depreciacao', 'data_revisao', 'data_troca_oleo',
  'data_alteracao_genus', 'data_hora_alterado_genus',
];
