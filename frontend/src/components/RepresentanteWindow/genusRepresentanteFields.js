/**
 * Configuração declarativa dos campos migrados da tabela REPRESENTANTE do
 * GENUS (GENUS_ZANGUETTIN.FDB), exibidos na seção "GENUS" do
 * RepresentanteWindow / NovoRepresentanteWindow.
 *
 * No GENUS, REPRESENTANTE não guarda identidade própria (nome, documento,
 * endereço) — ela referencia a tabela mestre CADASTRO através de
 * CODCADASTRO. Estes são apenas os campos específicos de REPRESENTANTE; ver
 * docstring do model Representante em backend/models/tabelas.py.
 *
 * Cada campo: { key, label, type }
 *   type: 'int' | 'float' | 'text' | 'date'
 * `key` corresponde 1:1 ao nome do campo no model Representante / schema
 * RepresentanteOut (backend/models/tabelas.py, backend/schemas/cadastro.py).
 */
export const GENUS_REPRESENTANTE_SECOES = [
  {
    titulo: 'Identificação / Vínculo (GENUS)',
    campos: [
      { key: 'cod_cadastro', label: 'Cód. Cadastro (GENUS)', type: 'int' },
      { key: 'cod_empresa',  label: 'Cód. Empresa',           type: 'int' },
    ],
  },
  {
    titulo: 'Dados Bancários',
    campos: [
      { key: 'banco',          label: 'Banco',            type: 'text', maxLength: 3 },
      { key: 'agencia',        label: 'Agência',          type: 'text', maxLength: 5 },
      { key: 'digito_agencia', label: 'Dígito Agência',   type: 'text', maxLength: 1 },
      { key: 'conta',          label: 'Conta',            type: 'int' },
      { key: 'digito_conta',   label: 'Dígito Conta',     type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Dados Específicos de Representante',
    campos: [
      { key: 'contato',           label: 'Contato',             type: 'text', maxLength: 20 },
      { key: 'comissao',          label: 'Comissão (GENUS)',    type: 'float' },
      { key: 'dt_admissao',       label: 'Data Admissão',       type: 'date' },
      { key: 'dt_demissao',       label: 'Data Demissão',       type: 'date' },
      { key: 'cod_supervisor',    label: 'Cód. Supervisor',     type: 'int' },
      { key: 'cod_gerente',       label: 'Cód. Gerente',        type: 'int' },
      { key: 'nivel_hierarquico', label: 'Nível Hierárquico',   type: 'text', maxLength: 1 },
      { key: 'tipo_comissao',     label: 'Tipo Comissão',       type: 'text', maxLength: 1 },
    ],
  },
];

/** Lista plana de todas as chaves GENUS, útil para inicializar/serializar o form. */
export const GENUS_REPRESENTANTE_CAMPOS = GENUS_REPRESENTANTE_SECOES.flatMap(s => s.campos);

/** Estado vazio dos campos GENUS — usado para inicializar o FORM_VAZIO do módulo. */
export const GENUS_REPRESENTANTE_FORM_VAZIO = Object.fromEntries(
  GENUS_REPRESENTANTE_CAMPOS.map(({ key }) => [key, ''])
);

/** Constrói o pedaço do form correspondente aos campos GENUS a partir de um representante. */
export function buildGenusRepresentanteFormFromRepresentante(representante) {
  const out = {};
  for (const { key, type } of GENUS_REPRESENTANTE_CAMPOS) {
    const valor = representante?.[key];
    if (type === 'date') {
      out[key] = valor ? String(valor).slice(0, 10) : '';
    } else {
      out[key] = valor ?? '';
    }
  }
  return out;
}

/** Converte o pedaço GENUS do form de volta para o formato esperado pela API. */
export function serializeGenusRepresentanteForm(form) {
  const out = {};
  for (const { key, type } of GENUS_REPRESENTANTE_CAMPOS) {
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

const GENUS_REPRESENTANTE_KEYS = new Set(GENUS_REPRESENTANTE_CAMPOS.map(c => c.key));

/**
 * Normaliza o form completo do representante antes de enviar ao backend:
 * mantém os campos originais do ERP como estavam (sem alterar o
 * comportamento já existente) e serializa apenas os campos migrados de
 * GENUS.REPRESENTANTE (int, float e date) via
 * `serializeGenusRepresentanteForm`.
 *
 * Usado tanto pelo hook useCrud (lista/edição em RepresentanteWindow)
 * quanto pela janela de criação NovoRepresentanteWindow.
 */
export function normalizarRepresentante(form) {
  const base = {};
  const genus = {};
  for (const [chave, valor] of Object.entries(form)) {
    if (GENUS_REPRESENTANTE_KEYS.has(chave)) genus[chave] = valor;
    else base[chave] = valor;
  }
  return { ...base, ...serializeGenusRepresentanteForm(genus) };
}
