/**
 * Configuração declarativa dos campos migrados da tabela FORNECEDOR do GENUS
 * (GENUS_ZANGUETTIN.FDB), exibidos na aba "GENUS" do FornecedorWindow /
 * NovoFornecedorWindow.
 *
 * No GENUS, FORNECEDOR não guarda identidade própria (nome, documento,
 * endereço) — ela referencia a tabela mestre CADASTRO através de
 * CODCADASTRO. Estes são apenas os campos específicos de FORNECEDOR; ver
 * docstring do model Fornecedor em backend/models/tabelas.py.
 *
 * Cada campo: { key, label, type }
 *   type: 'int' | 'float' | 'text' | 'date'
 * `key` corresponde 1:1 ao nome do campo no model Fornecedor / schema
 * FornecedorOut (backend/models/tabelas.py, backend/schemas/cadastro.py).
 */
export const GENUS_FORNECEDOR_SECOES = [
  {
    titulo: 'Identificação / Vínculo (GENUS)',
    campos: [
      { key: 'cod_cadastro',        label: 'Cód. Cadastro (GENUS)', type: 'int' },
      { key: 'filial',              label: 'Filial',                type: 'int' },
      { key: 'empresa_fornecedor',  label: 'Empresa Fornecedor',    type: 'text', maxLength: 10 },
    ],
  },
  {
    titulo: 'Contato / Fiscal',
    campos: [
      { key: 'contato',        label: 'Contato',                 type: 'text', maxLength: 20 },
      { key: 'cnae',           label: 'CNAE',                     type: 'text', maxLength: 10 },
      { key: 'cod_historico',  label: 'Cód. Histórico',           type: 'text', maxLength: 12 },
      { key: 'cod_cfop',       label: 'Cód. CFOP',                type: 'text', maxLength: 5 },
      { key: 'cod_cond_pagto', label: 'Cód. Cond. Pagamento',     type: 'text', maxLength: 5 },
      { key: 'cod_transporte', label: 'Cód. Transporte',          type: 'int' },
      { key: 'taxa_compra',    label: 'Taxa de Compra',           type: 'float' },
    ],
  },
];

/** Lista plana de todas as chaves GENUS, útil para inicializar/serializar o form. */
export const GENUS_FORNECEDOR_CAMPOS = GENUS_FORNECEDOR_SECOES.flatMap(s => s.campos);

/** Estado vazio dos campos GENUS — usado para inicializar o FORM_VAZIO do módulo. */
export const GENUS_FORNECEDOR_FORM_VAZIO = Object.fromEntries(
  GENUS_FORNECEDOR_CAMPOS.map(({ key }) => [key, ''])
);

/** Constrói o pedaço do form correspondente aos campos GENUS a partir de um fornecedor. */
export function buildGenusFornecedorFormFromFornecedor(fornecedor) {
  const out = {};
  for (const { key, type } of GENUS_FORNECEDOR_CAMPOS) {
    const valor = fornecedor?.[key];
    if (type === 'date') {
      out[key] = valor ? String(valor).slice(0, 10) : '';
    } else {
      out[key] = valor ?? '';
    }
  }
  return out;
}

/** Converte o pedaço GENUS do form de volta para o formato esperado pela API. */
export function serializeGenusFornecedorForm(form) {
  const out = {};
  for (const { key, type } of GENUS_FORNECEDOR_CAMPOS) {
    const valor = form[key];
    if (valor === '' || valor === null || valor === undefined) {
      out[key] = null;
      continue;
    }
    if (type === 'int') out[key] = parseInt(valor, 10);
    else if (type === 'float') out[key] = parseFloat(valor);
    else if (type === 'date') out[key] = valor + 'T12:00:00';
    else out[key] = valor;
  }
  return out;
}

const GENUS_FORNECEDOR_KEYS = new Set(GENUS_FORNECEDOR_CAMPOS.map(c => c.key));

/**
 * Normaliza o form completo do fornecedor antes de enviar ao backend: mantém
 * os campos originais do ERP como estavam (sem alterar o comportamento já
 * existente) e serializa apenas os campos migrados de GENUS.FORNECEDOR (int,
 * float e date) via `serializeGenusFornecedorForm`.
 *
 * Usado tanto pelo hook useCrud (lista/edição em FornecedorWindow) quanto
 * pela janela de criação NovoFornecedorWindow.
 */
export function normalizarFornecedor(form) {
  const base = {};
  const genus = {};
  for (const [chave, valor] of Object.entries(form)) {
    if (GENUS_FORNECEDOR_KEYS.has(chave)) genus[chave] = valor;
    else base[chave] = valor;
  }
  return { ...base, ...serializeGenusFornecedorForm(genus) };
}
