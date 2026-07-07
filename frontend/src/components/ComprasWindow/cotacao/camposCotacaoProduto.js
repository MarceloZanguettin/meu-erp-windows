// Configuração declarativa dos campos de CotacaoProduto (GENUS.COTACAOPRODUTO —
// produto + quantidade solicitados dentro de uma cotação de preço/RFQ, irmã
// de COTACAOITENS sob o mesmo cabeçalho COTACAOPRECO: COTACAOPRODUTO é a
// demanda, "o que estamos pedindo e de quanto"; COTACAOITENS é a oferta,
// "quem cotou cada produto e por qual preço"). Agrupamento espelha os
// comentários de seção do model `CotacaoProduto` em backend/models/tabelas.py
// — mesmo padrão já usado em ComprasWindow/cotacao/camposCotacaoItens.js.
export const GRUPOS_CAMPOS_COTACAO_PRODUTO = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'cod_cotacao', label: 'Cód. Cotação de Preço', tipo: 'int' },
      { nome: 'cotacao_preco_id', label: 'Cotação de Preço vinculada (ID interno)', tipo: 'int' },
      { nome: 'cod_produto', label: 'Cód. Produto', tipo: 'texto', maxLength: 15 },
      { nome: 'produto_id', label: 'Produto (id, já migrado)', tipo: 'int' },
    ],
  },
  {
    titulo: 'Quantidade Solicitada',
    campos: [
      { nome: 'qtde', label: 'Quantidade', tipo: 'float' },
    ],
  },
];

export const FORM_VAZIO_COTACAO_PRODUTO = GRUPOS_CAMPOS_COTACAO_PRODUTO
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_COTACAO_PRODUTO
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarCotacaoProduto(form) {
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
