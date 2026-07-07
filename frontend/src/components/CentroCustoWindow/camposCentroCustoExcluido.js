// Configuração declarativa dos campos de CentroCustoExcluido (GENUS.DEL_CENTROCUSTO
// — histórico/snapshot de uma linha de CentroCusto/GENUS.CENTROCUSTO excluída).
// Agrupamento espelha os comentários de seção do model `CentroCustoExcluido`
// em backend/models/tabelas.py — mesmo padrão já usado em
// camposContaPagarExcluida.js (ContaPagarExcluida/GENUS.DELPAGAR), só que
// para a extensão de produto por empresa/filial (CentroCusto/GENUS.CENTROCUSTO).
export const GRUPOS_CAMPOS_CENTRO_CUSTO_EXCLUIDO = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'cod_produto', label: 'Cód. Produto (GENUS)', tipo: 'texto', maxLength: 15 },
      { nome: 'cod_empresa', label: 'Cód. Empresa (GENUS)', tipo: 'int' },
      { nome: 'pertence_empresa', label: 'Pertence à Empresa', tipo: 'texto', maxLength: 1 },
    ],
  },
  {
    titulo: 'Preço / Venda',
    campos: [
      { nome: 'ecf_aliquota', label: 'ECF Alíquota', tipo: 'texto', maxLength: 5 },
      { nome: 'custo', label: 'Custo', tipo: 'float' },
      { nome: 'venda', label: 'Venda', tipo: 'float' },
      { nome: 'frete', label: 'Frete', tipo: 'float' },
      { nome: 'minimo', label: 'Mínimo', tipo: 'float' },
      { nome: 'maximo', label: 'Máximo', tipo: 'float' },
      { nome: 'qtde', label: 'Quantidade', tipo: 'float' },
      { nome: 'consignacao', label: 'Consignação', tipo: 'float' },
      { nome: 'valor_promocao', label: 'Valor Promoção', tipo: 'float' },
      { nome: 'inicio_promocao', label: 'Início Promoção', tipo: 'data' },
      { nome: 'fim_promocao', label: 'Fim Promoção', tipo: 'data' },
      { nome: 'estoque_cliente', label: 'Estoque Cliente', tipo: 'float' },
      { nome: 'custo_fixo', label: 'Custo Fixo', tipo: 'float' },
      { nome: 'margem_lucro', label: 'Margem de Lucro (%)', tipo: 'float' },
      { nome: 'comissao', label: 'Comissão (%)', tipo: 'float' },
      { nome: 'avista', label: 'À Vista', tipo: 'float' },
      { nome: 'comissao_avista', label: 'Comissão À Vista (%)', tipo: 'float' },
      { nome: 'percentual_avista', label: 'Percentual À Vista', tipo: 'float' },
      { nome: 'preco_minimo', label: 'Preço Mínimo', tipo: 'float' },
      { nome: 'percentual_a_prazo', label: 'Percentual a Prazo', tipo: 'float' },
      { nome: 'percentual_minimo', label: 'Percentual Mínimo', tipo: 'float' },
      { nome: 'ultimo_custo', label: 'Último Custo', tipo: 'float' },
      { nome: 'mao_de_obra', label: 'Mão de Obra', tipo: 'float' },
      { nome: 'custo_materia', label: 'Custo Matéria', tipo: 'float' },
    ],
  },
  {
    titulo: 'Estoque',
    campos: [
      { nome: 'fisico', label: 'Físico', tipo: 'float' },
    ],
  },
  {
    titulo: 'Fiscal — ICMS / IPI',
    campos: [
      { nome: 'reducao_icms', label: 'Redução ICMS', tipo: 'float' },
      { nome: 'diferenca_subst', label: 'Diferença Subst. Tributária', tipo: 'float' },
      { nome: 'diferenca_icms', label: 'Diferença ICMS', tipo: 'float' },
      { nome: 'ipi_entrada', label: 'IPI Entrada', tipo: 'float' },
    ],
  },
  {
    titulo: 'Fiscal — PIS / COFINS',
    campos: [
      { nome: 'pis_cst', label: 'PIS CST', tipo: 'texto', maxLength: 3 },
      { nome: 'pis_aliquota', label: 'PIS Alíquota', tipo: 'float' },
      { nome: 'pis_reais', label: 'PIS Reais', tipo: 'float' },
      { nome: 'cofins_cst', label: 'COFINS CST', tipo: 'texto', maxLength: 3 },
      { nome: 'cofins_aliquota', label: 'COFINS Alíquota', tipo: 'float' },
      { nome: 'cofins_reais', label: 'COFINS Reais', tipo: 'float' },
    ],
  },
  {
    titulo: 'Balança',
    campos: [
      { nome: 'tecla_balanca', label: 'Tecla Balança', tipo: 'int' },
      { nome: 'tipo_balanca', label: 'Tipo Balança', tipo: 'texto', maxLength: 1 },
      { nome: 'cod_balanca', label: 'Cód. Balança', tipo: 'int' },
      { nome: 'validade', label: 'Validade (dias)', tipo: 'int' },
    ],
  },
  {
    titulo: 'Patrimônio / Bem (veículo, equipamento etc.)',
    campos: [
      { nome: 'data_aquisicao', label: 'Data de Aquisição', tipo: 'data' },
      { nome: 'nota_patrimonio', label: 'Nota Patrimônio', tipo: 'int' },
      { nome: 'cod_patrimonio', label: 'Cód. Patrimônio', tipo: 'int' },
      { nome: 'valor_patrimonio', label: 'Valor Patrimônio', tipo: 'float' },
      { nome: 'data_garantia', label: 'Data de Garantia', tipo: 'data' },
      { nome: 'data_depreciacao', label: 'Data de Depreciação', tipo: 'data' },
      { nome: 'taxa_depreciacao', label: 'Taxa de Depreciação (%)', tipo: 'float' },
      { nome: 'valor_depreciacao', label: 'Valor de Depreciação', tipo: 'float' },
      { nome: 'data_revisao', label: 'Data de Revisão', tipo: 'data' },
      { nome: 'placa', label: 'Placa', tipo: 'texto', maxLength: 10 },
      { nome: 'chassi', label: 'Chassi', tipo: 'texto', maxLength: 20 },
      { nome: 'capacidade', label: 'Capacidade', tipo: 'float' },
      { nome: 'troca_oleo_km', label: 'Troca de Óleo (km)', tipo: 'int' },
      { nome: 'data_troca_oleo', label: 'Data Troca de Óleo', tipo: 'data' },
    ],
  },
];

export const FORM_VAZIO_CENTRO_CUSTO_EXCLUIDO = GRUPOS_CAMPOS_CENTRO_CUSTO_EXCLUIDO
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_CENTRO_CUSTO_EXCLUIDO
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarCentroCustoExcluido(form) {
  const out = { ...form };
  for (const campo of CAMPOS_NUMERICOS) {
    if (out[campo] === '' || out[campo] === undefined || out[campo] === null) {
      delete out[campo];
    } else {
      out[campo] = Number(out[campo]);
    }
  }
  for (const campo of Object.keys(out)) {
    if (out[campo] === '') delete out[campo];
  }
  return out;
}
