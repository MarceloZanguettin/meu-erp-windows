// Configuração declarativa dos campos de NotaDestinada (GENUS.NOTASDESTINADAS
// — manifesto do destinatário / NF-e recebida de terceiros, ainda pendente de
// manifestação e/ou lançamento como Entrada). Agrupamento espelha os
// comentários de seção do model `NotaDestinada` em backend/models/tabelas.py
// — mesmo padrão declarativo já usado em
// ComprasWindow/entrada/camposEntrada.js.
export const GRUPOS_CAMPOS_NOTA_DESTINADA = [
  {
    titulo: 'Identificação',
    campos: [
      { nome: 'cod_empresa', label: 'Cód. Empresa', tipo: 'int' },
      { nome: 'codigo', label: 'Código (GENUS)', tipo: 'int' },
      { nome: 'emissao', label: 'Emissão', tipo: 'data' },
      { nome: 'doc', label: 'Doc', tipo: 'int' },
    ],
  },
  {
    titulo: 'Emitente da NF-e Destinada',
    campos: [
      { nome: 'cnpj', label: 'CNPJ', tipo: 'texto', maxLength: 14 },
      { nome: 'insc', label: 'Inscrição Estadual', tipo: 'texto', maxLength: 15 },
      { nome: 'fornecedor', label: 'Fornecedor (nome)', tipo: 'texto', maxLength: 60 },
    ],
  },
  {
    titulo: 'Valores e Status da Manifestação',
    campos: [
      { nome: 'total_nfe', label: 'Total NF-e', tipo: 'float' },
      { nome: 'situacao', label: 'Situação (SEFAZ)', tipo: 'texto', maxLength: 20 },
      { nome: 'status_genus', label: 'Status (GENUS)', tipo: 'texto', maxLength: 30 },
      { nome: 'resumo', label: 'Resumo', tipo: 'int' },
    ],
  },
  {
    titulo: 'NF-e (Chave de Acesso e XML)',
    campos: [
      { nome: 'chave_nfe', label: 'Chave NF-e', tipo: 'texto', maxLength: 70 },
      { nome: 'arq_xml', label: 'Arquivo XML', tipo: 'textarea' },
    ],
  },
  {
    titulo: 'Vínculo com a Entrada (quando já lançada)',
    campos: [
      { nome: 'entrada_id', label: 'ID da Entrada (ERP)', tipo: 'int' },
      { nome: 'tipo_doc_entrada', label: 'Tipo Doc. Entrada', tipo: 'texto', maxLength: 1 },
      { nome: 'doc_entrada', label: 'Doc. Entrada', tipo: 'int' },
      { nome: 'serie_entrada', label: 'Série Entrada', tipo: 'texto', maxLength: 4 },
      { nome: 'cod_fornecedor_entrada', label: 'Cód. Fornecedor Entrada', tipo: 'int' },
      { nome: 'cod_empresa_entrada', label: 'Cód. Empresa Entrada', tipo: 'int' },
    ],
  },
  {
    titulo: 'Vínculo com uma Saída (ex.: devolução)',
    campos: [
      { nome: 'cod_saida', label: 'Cód. Saída', tipo: 'int' },
      { nome: 'cod_empresa_saida', label: 'Cód. Empresa Saída', tipo: 'int' },
      { nome: 'doc_saida', label: 'Doc. Saída', tipo: 'int' },
    ],
  },
];

export const FORM_VAZIO_NOTA_DESTINADA = GRUPOS_CAMPOS_NOTA_DESTINADA
  .flatMap(g => g.campos)
  .reduce((acc, campo) => {
    acc[campo.nome] = '';
    return acc;
  }, {});

const CAMPOS_NUMERICOS = GRUPOS_CAMPOS_NOTA_DESTINADA
  .flatMap(g => g.campos)
  .filter(c => c.tipo === 'int' || c.tipo === 'float')
  .map(c => c.nome);

export function normalizarNotaDestinada(form) {
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
