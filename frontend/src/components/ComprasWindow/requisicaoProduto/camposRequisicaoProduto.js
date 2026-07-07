// Configuração declarativa dos campos de RequisicaoProduto (GENUS.
// REQUISICAOPRODUTO — item da requisição de material, elo do meio entre
// REQUISICAOMATERIA/RequisicaoMateria (cabeçalho) e
// REQUISICAOMATERIAETAPAS/RequisicaoMateriaEtapas (etapas de entrega, via
// requisicao_produto_id/cod_req_produto)). Agrupamento espelha os
// comentários de seção do model `RequisicaoProduto` em
// backend/models/tabelas.py — mesmo padrão já usado em
// ComprasWindow/requisicaoMateria/camposRequisicaoMateria.js (GENUS.
// REQUISICAOMATERIA) e em ComprasWindow/cotacao/camposCotacaoProduto.js
// (GENUS.COTACAOPRODUTO, mesmo raciocínio de produto_id + cod_produto).
export const GRUPOS_CAMPOS_REQUISICAO_PRODUTO = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'requisicao_materia_id', label: 'ID Requisição (interno)', tipo: 'int' },
      { nome: 'cod_requisicao', label: 'Cód. Requisição (REQUISICAOMATERIA)', tipo: 'int' },
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
    ],
  },
  {
    titulo: 'Produto',
    campos: [
      { nome: 'produto_id', label: 'ID Produto (interno)', tipo: 'int' },
      { nome: 'cod_produto', label: 'Cód. Produto (GENUS)', tipo: 'texto', maxLength: 15 },
    ],
  },
  {
    titulo: 'Quantidade',
    campos: [
      { nome: 'qtde', label: 'Quantidade Solicitada', tipo: 'float' },
      { nome: 'qtde_produzida', label: 'Quantidade Produzida', tipo: 'float' },
    ],
  },
  {
    titulo: 'Entrada / Responsável / Custo',
    campos: [
      { nome: 'dt_entrada', label: 'Data de Entrada', tipo: 'data' },
      { nome: 'cod_funcionario', label: 'Cód. Funcionário', tipo: 'int' },
      { nome: 'custo_total', label: 'Custo Total', tipo: 'float' },
      { nome: 'diferenca', label: 'Diferença', tipo: 'float' },
    ],
  },
  {
    titulo: 'Observação / Status',
    campos: [
      { nome: 'obs', label: 'Observação', tipo: 'textarea' },
      { nome: 'status', label: 'Status', tipo: 'texto', maxLength: 12 },
    ],
  },
];

export const FORM_VAZIO_REQUISICAO_PRODUTO = GRUPOS_CAMPOS_REQUISICAO_PRODUTO
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_REQUISICAO_PRODUTO
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarRequisicaoProduto(form) {
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
