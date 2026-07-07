/**
 * Configuração declarativa dos campos migrados da tabela TRANSPORTADOR do
 * GENUS (GENUS_ZANGUETTIN.FDB), exibidos na seção "GENUS" do
 * TransportadoraWindow / NovaTransportadoraWindow.
 *
 * No GENUS, TRANSPORTADOR não guarda identidade própria (nome, documento,
 * endereço) — ela referencia a tabela mestre CADASTRO através de
 * CODCADASTRO. Estes são apenas os campos específicos de TRANSPORTADOR; ver
 * docstring do model Transportadora em backend/models/tabelas.py.
 *
 * Cada campo: { key, label, type }
 *   type: 'int' | 'float' | 'text' | 'date'
 * `key` corresponde 1:1 ao nome do campo no model Transportadora / schema
 * TransportadoraOut (backend/models/tabelas.py, backend/schemas/cadastro.py).
 */
export const GENUS_TRANSPORTADORA_SECOES = [
  {
    titulo: 'Identificação / Vínculo (GENUS)',
    campos: [
      { key: 'cod_cadastro', label: 'Cód. Cadastro (GENUS)', type: 'int' },
    ],
  },
  {
    titulo: 'Dados Específicos de Transportadora',
    campos: [
      { key: 'placa',     label: 'Placa',                type: 'text', maxLength: 8 },
      { key: 'insc_inss', label: 'Inscrição INSS',        type: 'text', maxLength: 15 },
      { key: 'insc_iss',  label: 'Inscrição ISS',         type: 'text', maxLength: 15 },
      { key: 'cra_sp',    label: 'CRA-SP',                type: 'text', maxLength: 15 },
      { key: 'antt',      label: 'ANTT (RNTRC)',          type: 'text', maxLength: 20 },
    ],
  },
];

/** Lista plana de todas as chaves GENUS, útil para inicializar/serializar o form. */
export const GENUS_TRANSPORTADORA_CAMPOS = GENUS_TRANSPORTADORA_SECOES.flatMap(s => s.campos);

/** Estado vazio dos campos GENUS — usado para inicializar o FORM_VAZIO do módulo. */
export const GENUS_TRANSPORTADORA_FORM_VAZIO = Object.fromEntries(
  GENUS_TRANSPORTADORA_CAMPOS.map(({ key }) => [key, ''])
);

/** Constrói o pedaço do form correspondente aos campos GENUS a partir de uma transportadora. */
export function buildGenusTransportadoraFormFromTransportadora(transportadora) {
  const out = {};
  for (const { key, type } of GENUS_TRANSPORTADORA_CAMPOS) {
    const valor = transportadora?.[key];
    if (type === 'date') {
      out[key] = valor ? String(valor).slice(0, 10) : '';
    } else {
      out[key] = valor ?? '';
    }
  }
  return out;
}

/** Converte o pedaço GENUS do form de volta para o formato esperado pela API. */
export function serializeGenusTransportadoraForm(form) {
  const out = {};
  for (const { key, type } of GENUS_TRANSPORTADORA_CAMPOS) {
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

const GENUS_TRANSPORTADORA_KEYS = new Set(GENUS_TRANSPORTADORA_CAMPOS.map(c => c.key));

/**
 * Normaliza o form completo da transportadora antes de enviar ao backend:
 * mantém os campos originais do ERP como estavam (sem alterar o
 * comportamento já existente) e serializa apenas os campos migrados de
 * GENUS.TRANSPORTADOR (int, float e date) via
 * `serializeGenusTransportadoraForm`.
 *
 * Usado tanto pelo hook useCrud (lista/edição em TransportadoraWindow)
 * quanto pela janela de criação NovaTransportadoraWindow.
 */
export function normalizarTransportadora(form) {
  const base = {};
  const genus = {};
  for (const [chave, valor] of Object.entries(form)) {
    if (GENUS_TRANSPORTADORA_KEYS.has(chave)) genus[chave] = valor;
    else base[chave] = valor;
  }
  return { ...base, ...serializeGenusTransportadoraForm(genus) };
}
