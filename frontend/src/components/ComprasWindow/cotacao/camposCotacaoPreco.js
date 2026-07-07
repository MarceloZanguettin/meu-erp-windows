// Configuração declarativa dos campos de CotacaoPreco (GENUS.COTACAOPRECO —
// cabeçalho da cotação de preço/RFQ: empresa, emissão, descrição, status,
// validade, funcionário solicitante e aprovador). Agrupamento espelha os
// comentários de seção do model `CotacaoPreco` em backend/models/tabelas.py
// — mesmo padrão já usado em
// ComprasWindow/cotacao/camposCotacaoItens.js (GENUS.COTACAOITENS).
export const GRUPOS_CAMPOS_COTACAO_PRECO = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
    ],
  },
  {
    titulo: 'Cabeçalho da Cotação',
    campos: [
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'descricao', label: 'Descrição', tipo: 'texto', maxLength: 50 },
      { nome: 'status', label: 'Status', tipo: 'texto', maxLength: 1 },
      { nome: 'validade', label: 'Validade', tipo: 'data' },
    ],
  },
  {
    titulo: 'Solicitante e Aprovação',
    campos: [
      { nome: 'cod_funcionario', label: 'Cód. Funcionário (solicitante)', tipo: 'int' },
      { nome: 'cod_aprovador', label: 'Cód. Aprovador', tipo: 'int' },
      { nome: 'data_aprovado', label: 'Data Aprovado', tipo: 'data' },
      { nome: 'hora_aprovado', label: 'Hora Aprovado', tipo: 'texto', maxLength: 8 },
    ],
  },
];

export const FORM_VAZIO_COTACAO_PRECO = GRUPOS_CAMPOS_COTACAO_PRECO
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_COTACAO_PRECO
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarCotacaoPreco(form) {
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
