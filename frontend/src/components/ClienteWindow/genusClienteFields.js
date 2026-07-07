/**
 * Configuração declarativa dos campos migrados da tabela CLIENTE do GENUS
 * (GENUS_ZANGUETTIN.FDB), exibidos na aba "GENUS" do ClienteWindow /
 * NovoClienteWindow.
 *
 * No GENUS, CLIENTE não guarda identidade própria (nome, documento,
 * endereço) — ela referencia a tabela mestre CADASTRO através de
 * CODCADASTRO. Estes são apenas os campos específicos de CLIENTE; ver
 * docstring do model ClienteCompleto em backend/models/tabelas.py.
 *
 * Cada campo: { key, label, type }
 *   type: 'int' | 'float' | 'text' | 'date'
 * `key` corresponde 1:1 ao nome do campo no model ClienteCompleto / schema
 * ClienteCompletoOut (backend/models/tabelas.py, backend/schemas/cadastro.py).
 */
export const GENUS_CLIENTE_SECOES = [
  {
    titulo: 'Identificação / Vínculo (GENUS)',
    campos: [
      { key: 'cod_cadastro',     label: 'Cód. Cadastro (GENUS)', type: 'int' },
      { key: 'cod_naturalidade', label: 'Cód. Naturalidade',     type: 'int' },
    ],
  },
  {
    titulo: 'Crédito / Cobrança',
    campos: [
      { key: 'limite',    label: 'Limite',    type: 'float' },
      { key: 'cobranca',  label: 'Cobrança',  type: 'int' },
      { key: 'bloqueado', label: 'Bloqueado', type: 'text', maxLength: 30 },
    ],
  },
  {
    titulo: 'Dependentes / Contato',
    campos: [
      { key: 'dependente', label: 'Dependentes', type: 'int' },
      { key: 'contato',    label: 'Contato',      type: 'text', maxLength: 40 },
    ],
  },
  {
    titulo: 'Renda / Trabalho',
    campos: [
      { key: 'renda',            label: 'Renda',            type: 'float' },
      { key: 'trabalho',         label: 'Trabalho',         type: 'text', maxLength: 30 },
      { key: 'fone_trabalho',    label: 'Fone Trabalho',    type: 'text', maxLength: 15 },
      { key: 'data_admissao',    label: 'Data Admissão',    type: 'date' },
      { key: 'contato_trabalho', label: 'Contato Trabalho', type: 'text', maxLength: 15 },
    ],
  },
  {
    titulo: 'Documento de Identidade',
    campos: [
      { key: 'orgao_exp',      label: 'Órgão Expedidor', type: 'text', maxLength: 5 },
      { key: 'data_expedicao', label: 'Data Expedição',  type: 'date' },
    ],
  },
  {
    titulo: 'Endereço de Cobrança',
    campos: [
      { key: 'cob_endereco',   label: 'Endereço Cobrança', type: 'text', maxLength: 50 },
      { key: 'cob_bairro',     label: 'Bairro Cobrança',   type: 'text', maxLength: 23 },
      { key: 'cob_cep',        label: 'CEP Cobrança',      type: 'text', maxLength: 10 },
      { key: 'cob_cod_cidade', label: 'Cód. Cidade Cobrança', type: 'int' },
    ],
  },
  {
    titulo: 'Fiscal / Comercial',
    campos: [
      { key: 'cnae',                          label: 'CNAE',                    type: 'text', maxLength: 10 },
      { key: 'cod_representante',             label: 'Cód. Representante',      type: 'int' },
      { key: 'cod_regiao',                    label: 'Cód. Região',             type: 'int' },
      { key: 'cod_cfop',                      label: 'Cód. CFOP',               type: 'text', maxLength: 5 },
      { key: 'cod_transportador',             label: 'Cód. Transportador',      type: 'int' },
      { key: 'cod_carteira',                  label: 'Cód. Carteira',           type: 'int' },
      { key: 'cod_contas',                    label: 'Cód. Contas',             type: 'int' },
      { key: 'cod_cond_pagto',                label: 'Cód. Cond. Pagamento',    type: 'text', maxLength: 5 },
      { key: 'tipo_comercio',                 label: 'Tipo Comércio',           type: 'text', maxLength: 1 },
      { key: 'agregar_ipi',                   label: 'Agregar IPI',             type: 'text', maxLength: 1 },
      { key: 'reduzir_base_st',                label: 'Reduzir Base ST',        type: 'text', maxLength: 1 },
      { key: 'carga_media_trib',              label: 'Carga Média Tributária',  type: 'float' },
      { key: 'valor_km_rodado',               label: 'Valor Km Rodado',         type: 'float' },
      { key: 'acrescimo',                     label: 'Acréscimo',               type: 'float' },
      { key: 'cod_alternativo',               label: 'Cód. Alternativo',        type: 'int' },
      { key: 'cod_tipo_venda',                label: 'Cód. Tipo Venda',         type: 'int' },
      { key: 'operadora',                     label: 'Operadora',               type: 'text', maxLength: 1 },
      { key: 'cod_tabela_preco',              label: 'Cód. Tabela Preço',       type: 'int' },
      { key: 'prod_rural',                    label: 'Produtor Rural',          type: 'text', maxLength: 1 },
      { key: 'dias_recorrencia',              label: 'Dias Recorrência',        type: 'int' },
      { key: 'calcular_difal',                label: 'Calcular DIFAL',          type: 'text', maxLength: 1 },
      { key: 'nao_destacar_icms',             label: 'Não Destacar ICMS',       type: 'text', maxLength: 1 },
      { key: 'reduzir_icms_base_pis_cofins',  label: 'Reduzir ICMS Base PIS/COFINS', type: 'text', maxLength: 1 },
      { key: 'reforma_cclasstrib',            label: 'Reforma cClassTrib',      type: 'text', maxLength: 10 },
    ],
  },
  {
    titulo: 'LGPD',
    campos: [
      { key: 'data_imp_lgpd',        label: 'Data Imp. LGPD',   type: 'date' },
      { key: 'data_dev_lgpd',        label: 'Data Dev. LGPD',   type: 'date' },
      { key: 'hora_imp_lgpd',        label: 'Hora Imp. LGPD',   type: 'text', maxLength: 8 },
      { key: 'hora_dev_lgpd',        label: 'Hora Dev. LGPD',   type: 'text', maxLength: 8 },
      { key: 'cod_funcionario_lgpd', label: 'Cód. Funcionário LGPD', type: 'int' },
    ],
  },
];

/** Lista plana de todas as chaves GENUS, útil para inicializar/serializar o form. */
export const GENUS_CLIENTE_CAMPOS = GENUS_CLIENTE_SECOES.flatMap(s => s.campos);

/** Estado vazio dos campos GENUS — usado para inicializar o FORM_VAZIO do módulo. */
export const GENUS_CLIENTE_FORM_VAZIO = Object.fromEntries(
  GENUS_CLIENTE_CAMPOS.map(({ key }) => [key, ''])
);

/** Constrói o pedaço do form correspondente aos campos GENUS a partir de um cliente. */
export function buildGenusClienteFormFromCliente(cliente) {
  const out = {};
  for (const { key, type } of GENUS_CLIENTE_CAMPOS) {
    const valor = cliente?.[key];
    if (type === 'date') {
      out[key] = valor ? String(valor).slice(0, 10) : '';
    } else {
      out[key] = valor ?? '';
    }
  }
  return out;
}

/** Converte o pedaço GENUS do form de volta para o formato esperado pela API. */
export function serializeGenusClienteForm(form) {
  const out = {};
  for (const { key, type } of GENUS_CLIENTE_CAMPOS) {
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

const GENUS_CLIENTE_KEYS = new Set(GENUS_CLIENTE_CAMPOS.map(c => c.key));

/**
 * Normaliza o form completo do cliente antes de enviar ao backend: mantém os
 * campos originais do ERP como estavam (sem alterar o comportamento já
 * existente) e serializa apenas os campos migrados de GENUS.CLIENTE (int,
 * float e date) via `serializeGenusClienteForm`.
 *
 * Usado tanto pelo hook useCrud (lista/edição em ClienteWindow) quanto pela
 * janela de criação NovoClienteWindow.
 */
export function normalizarClienteCompleto(form) {
  const base = {};
  const genus = {};
  for (const [chave, valor] of Object.entries(form)) {
    if (GENUS_CLIENTE_KEYS.has(chave)) genus[chave] = valor;
    else base[chave] = valor;
  }
  return { ...base, ...serializeGenusClienteForm(genus) };
}
