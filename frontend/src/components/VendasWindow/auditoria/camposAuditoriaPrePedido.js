// Configuração declarativa dos campos de AuditoriaPrePedido (GENUS.AUDITORIA_
// PREPEDIDO — log de auditoria de um pré-pedido). Agrupamento espelha os
// comentários de seção do model `AuditoriaPrePedido` em
// backend/models/tabelas.py.
export const GRUPOS_CAMPOS_AUDITORIA_PRE_PEDIDO = [
  {
    titulo: 'Identificação / Vínculos já migrados neste ERP',
    campos: [
      { nome: 'produto_id', label: 'ID Produto (ERP)', tipo: 'int' },
      { nome: 'produto_producao_id', label: 'ID Produto Produção (ERP)', tipo: 'int' },
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
      { nome: 'cod_pre_pedido', label: 'Cód. Pré-Pedido (GENUS)', tipo: 'int' },
    ],
  },
  {
    titulo: 'Evento de Auditoria',
    campos: [
      { nome: 'data', label: 'Data', tipo: 'data' },
      { nome: 'hora', label: 'Hora', tipo: 'texto', maxLength: 5 },
      { nome: 'operacao', label: 'Operação', tipo: 'texto', maxLength: 10 },
      { nome: 'cod_funcionario', label: 'Cód. Funcionário', tipo: 'int' },
      { nome: 'texto', label: 'Texto', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Documento / Cliente',
    campos: [
      { nome: 'doc', label: 'Doc.', tipo: 'int' },
      { nome: 'emissao_doc', label: 'Emissão do Doc.', tipo: 'data' },
      { nome: 'cod_cliente', label: 'Cód. Cliente (GENUS)', tipo: 'int' },
    ],
  },
  {
    titulo: 'Produto / Produção',
    campos: [
      { nome: 'cod_produto', label: 'Cód. Produto (GENUS)', tipo: 'texto', maxLength: 15 },
      { nome: 'cod_produto_producao', label: 'Cód. Produto Produção (GENUS)', tipo: 'int' },
      { nome: 'lote', label: 'Lote', tipo: 'texto', maxLength: 10 },
    ],
  },
];

export const FORM_VAZIO_AUDITORIA_PRE_PEDIDO = GRUPOS_CAMPOS_AUDITORIA_PRE_PEDIDO
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_AUDITORIA_PRE_PEDIDO
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarAuditoriaPrePedido(form) {
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
