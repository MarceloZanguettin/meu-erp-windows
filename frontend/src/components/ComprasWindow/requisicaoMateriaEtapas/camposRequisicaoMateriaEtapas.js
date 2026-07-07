// Configuração declarativa dos campos de RequisicaoMateriaEtapas (GENUS.
// REQUISICAOMATERIAETAPAS — etapa/apontamento parcial de um item de
// requisição de material). Agrupamento espelha os comentários de seção do
// model `RequisicaoMateriaEtapas` em backend/models/tabelas.py — mesmo
// padrão já usado em ComprasWindow/compra/camposCompraGenus.js (GENUS.
// COMPRAS).
export const GRUPOS_CAMPOS_REQUISICAO_MATERIA_ETAPAS = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      {
        nome: 'cod_req_produto',
        label: 'Cód. Item de Requisição (REQUISICAOPRODUTO)',
        tipo: 'int',
      },
    ],
  },
  {
    titulo: 'Etapa / Apontamento Parcial',
    campos: [
      { nome: 'qtde', label: 'Quantidade', tipo: 'float' },
      { nome: 'dt_entrada', label: 'Data de Entrada', tipo: 'data' },
      { nome: 'custo_total', label: 'Custo Total', tipo: 'float' },
    ],
  },
];

export const FORM_VAZIO_REQUISICAO_MATERIA_ETAPAS = GRUPOS_CAMPOS_REQUISICAO_MATERIA_ETAPAS
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_REQUISICAO_MATERIA_ETAPAS
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarRequisicaoMateriaEtapas(form) {
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
