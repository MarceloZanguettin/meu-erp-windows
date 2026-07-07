// Configuração declarativa dos campos de CotacaoItens (GENUS.COTACAOITENS —
// item de cotação de preço/RFQ: proposta de um fornecedor para um produto,
// dentro de uma mesma cotação). Agrupamento espelha os comentários de seção
// do model `CotacaoItens` em backend/models/tabelas.py — mesmo padrão já
// usado em ComprasWindow/compra/camposCompraGenus.js (GENUS.COMPRAS).
export const GRUPOS_CAMPOS_COTACAO_ITENS = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'cod_cotacao_preco', label: 'Cód. Cotação de Preço', tipo: 'int' },
      { nome: 'cotacao_preco_id', label: 'Cotação de Preço vinculada (ID interno)', tipo: 'int' },
      { nome: 'cod_produto', label: 'Cód. Produto', tipo: 'texto', maxLength: 15 },
      { nome: 'produto_id', label: 'Produto (id, já migrado)', tipo: 'int' },
      { nome: 'cod_fornecedor', label: 'Cód. Fornecedor', tipo: 'int' },
    ],
  },
  {
    titulo: 'Valores da Proposta Cotada',
    campos: [
      { nome: 'preco', label: 'Preço', tipo: 'float' },
      { nome: 'unitario', label: 'Unitário', tipo: 'float' },
      { nome: 'frete', label: 'Frete', tipo: 'float' },
      { nome: 'ipi', label: 'IPI', tipo: 'float' },
      { nome: 'st', label: 'ST', tipo: 'float' },
      { nome: 'cpr', label: 'CPR', tipo: 'float' },
      { nome: 'outros_valores', label: 'Outros Valores', tipo: 'float' },
      { nome: 'total', label: 'Total', tipo: 'float' },
    ],
  },
  {
    titulo: 'Observação',
    campos: [
      { nome: 'obs', label: 'Observação', tipo: 'textarea' },
    ],
  },
];

export const FORM_VAZIO_COTACAO_ITENS = GRUPOS_CAMPOS_COTACAO_ITENS
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_COTACAO_ITENS
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarCotacaoItens(form) {
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
