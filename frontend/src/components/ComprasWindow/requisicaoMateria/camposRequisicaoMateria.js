// Configuração declarativa dos campos de RequisicaoMateria (GENUS.
// REQUISICAOMATERIA — cabeçalho da requisição de material). Agrupamento
// espelha os comentários de seção do model `RequisicaoMateria` em
// backend/models/tabelas.py — mesmo padrão já usado em
// ComprasWindow/requisicaoMateriaEtapas/camposRequisicaoMateriaEtapas.js
// (GENUS.REQUISICAOMATERIAETAPAS) e em
// ComprasWindow/cotacao/camposCotacaoPreco.js (GENUS.COTACAOPRECO).
export const GRUPOS_CAMPOS_REQUISICAO_MATERIA = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
    ],
  },
  {
    titulo: 'Cabeçalho da Requisição',
    campos: [
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'tipo', label: 'Tipo', tipo: 'texto', maxLength: 1 },
      { nome: 'tipo_requisicao', label: 'Tipo de Requisição', tipo: 'texto', maxLength: 1 },
      { nome: 'status', label: 'Status', tipo: 'texto', maxLength: 12 },
      { nome: 'lote', label: 'Lote', tipo: 'texto', maxLength: 10 },
      { nome: 'obs', label: 'Observação', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Solicitante',
    campos: [
      { nome: 'cod_cliente', label: 'Cód. Cliente', tipo: 'int' },
      { nome: 'cod_funcionario', label: 'Cód. Funcionário', tipo: 'int' },
    ],
  },
  {
    titulo: 'Previsão de Entrega / Execução',
    campos: [
      { nome: 'dt_previsao', label: 'Data Previsão', tipo: 'data' },
      { nome: 'hora', label: 'Hora', tipo: 'texto', maxLength: 8 },
      { nome: 'hora_previsao', label: 'Hora Previsão', tipo: 'texto', maxLength: 8 },
      { nome: 'local_entrega', label: 'Local de Entrega', tipo: 'texto', maxLength: 50 },
      { nome: 'cod_transportador', label: 'Cód. Transportadora', tipo: 'int' },
    ],
  },
  {
    titulo: 'Equipamento / Tanque / Voltagem',
    campos: [
      { nome: 'cod_equipamento', label: 'Cód. Equipamento', tipo: 'texto', maxLength: 15 },
      { nome: 'cod_tanque', label: 'Cód. Tanque', tipo: 'int' },
      { nome: 'voltagem', label: 'Voltagem', tipo: 'float' },
    ],
  },
];

export const FORM_VAZIO_REQUISICAO_MATERIA = GRUPOS_CAMPOS_REQUISICAO_MATERIA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_REQUISICAO_MATERIA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarRequisicaoMateria(form) {
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
