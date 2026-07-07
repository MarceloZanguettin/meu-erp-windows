/**
 * Configuração declarativa dos campos migrados da tabela FUNCIONARIO do
 * GENUS (GENUS_ZANGUETTIN.FDB), exibidos na seção "GENUS" do
 * FuncionarioWindow / NovoFuncionarioWindow.
 *
 * No GENUS, FUNCIONARIO não guarda identidade própria (nome, documento,
 * endereço) — ela referencia a tabela mestre CADASTRO através de
 * CODCADASTRO. Estes são apenas os campos específicos de FUNCIONARIO; ver
 * docstring do model Funcionario em backend/models/tabelas.py.
 *
 * Cada campo: { key, label, type }
 *   type: 'int' | 'float' | 'text' | 'date'
 * `key` corresponde 1:1 ao nome do campo no model Funcionario / schema
 * FuncionarioOut (backend/models/tabelas.py, backend/schemas/cadastro.py).
 */
export const GENUS_FUNCIONARIO_SECOES = [
  {
    titulo: 'Identificação / Vínculo (GENUS)',
    campos: [
      { key: 'cod_cadastro',      label: 'Cód. Cadastro (GENUS)', type: 'int' },
      { key: 'cod_empresa',       label: 'Cód. Empresa',          type: 'int' },
      { key: 'cadastro_cliente',  label: 'Cadastro Cliente (S/N)', type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Acesso / Login ao Sistema',
    campos: [
      { key: 'nivel',                        label: 'Nível',                        type: 'text', maxLength: 1 },
      { key: 'senha',                        label: 'Senha',                        type: 'text', maxLength: 10 },
      { key: 'usuario',                      label: 'Usuário',                      type: 'text', maxLength: 15 },
      { key: 'cod_grupo_menu',                label: 'Cód. Grupo de Menu',           type: 'int' },
      { key: 'alterar_login',                 label: 'Pode Alterar Login (S/N)',     type: 'text', maxLength: 1 },
      { key: 'bloq_visualizar_funcionarios',  label: 'Bloq. Visualizar Funcionários (S/N)', type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Dados Bancários',
    campos: [
      { key: 'banco',           label: 'Banco',           type: 'text', maxLength: 3 },
      { key: 'agencia',         label: 'Agência',         type: 'text', maxLength: 5 },
      { key: 'digito_agencia',  label: 'Dígito Agência',  type: 'text', maxLength: 1 },
      { key: 'conta',           label: 'Conta',           type: 'text', maxLength: 20 },
      { key: 'digito_conta',    label: 'Dígito Conta',    type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Financeiro / Contas',
    campos: [
      { key: 'cod_contas', label: 'Cód. Contas', type: 'int' },
      { key: 'caixa',      label: 'Opera Caixa (S/N)', type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Configuração de E-mail (SMTP)',
    campos: [
      { key: 'smtp_porta',            label: 'Porta SMTP',           type: 'int' },
      { key: 'smtp_host',             label: 'Host SMTP',            type: 'text', maxLength: 60 },
      { key: 'smtp_password',         label: 'Senha SMTP',           type: 'text', maxLength: 20 },
      { key: 'smtp_username',         label: 'Usuário SMTP',         type: 'text', maxLength: 60 },
      { key: 'from_address',          label: 'E-mail Remetente',     type: 'text', maxLength: 60 },
      { key: 'from_name',             label: 'Nome Remetente',       type: 'text', maxLength: 20 },
      { key: 'autenticar_email_ssl',  label: 'Autenticar SSL (S/N)', type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Cargo / Função / Uniforme',
    campos: [
      { key: 'cod_cargo',  label: 'Cód. Cargo (GENUS)', type: 'int' },
      { key: 'cod_funcao', label: 'Cód. Função',         type: 'int' },
      { key: 'cod_setor',  label: 'Cód. Setor',          type: 'int' },
      { key: 'n_carteira', label: 'Nº Carteira',         type: 'text', maxLength: 20 },
      { key: 'camisa',     label: 'Tam. Camisa',         type: 'text', maxLength: 5 },
      { key: 'sapato',     label: 'Tam. Sapato',         type: 'text', maxLength: 5 },
      { key: 'calca',      label: 'Tam. Calça',          type: 'text', maxLength: 5 },
    ],
  },
  {
    titulo: 'Jornada de Trabalho',
    campos: [
      { key: 'horas_trabalhadas', label: 'Horas Trabalhadas', type: 'text', maxLength: 7 },
      { key: 'horas_efetivas',    label: 'Horas Efetivas',    type: 'text', maxLength: 7 },
      { key: 'data_demissao',     label: 'Data de Demissão',  type: 'date' },
    ],
  },
  {
    titulo: 'Carteira de Trabalho (CTPS)',
    campos: [
      { key: 'ctps',         label: 'CTPS',           type: 'text', maxLength: 7 },
      { key: 'serie',        label: 'Série',          type: 'text', maxLength: 4 },
      { key: 'emissao_ctps', label: 'Emissão CTPS',   type: 'date' },
      { key: 'uf_ctps',      label: 'UF CTPS',        type: 'text', maxLength: 2 },
      { key: 'cbo',          label: 'CBO',            type: 'text', maxLength: 8 },
    ],
  },
  {
    titulo: 'Vendedor',
    campos: [
      { key: 'vendedor', label: 'É Vendedor (S/N)', type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Permissões — Clientes / Atendimento',
    campos: [
      { key: 'exibe_dados',                        label: 'Exibe Dados (S/N)',                          type: 'text', maxLength: 1 },
      { key: 'liberar_pre_pedido',                 label: 'Liberar Pré-Pedido (S/N)',                   type: 'text', maxLength: 1 },
      { key: 'consultar_produto',                  label: 'Consultar Produto (S/N)',                    type: 'text', maxLength: 1 },
      { key: 'receber_cotacao_email',               label: 'Receber Cotação por E-mail (S/N)',           type: 'text', maxLength: 1 },
      { key: 'permitir_anexo_cliente',              label: 'Permitir Anexo Cliente (S/N)',               type: 'text', maxLength: 1 },
      { key: 'permitir_inativar_clientes',          label: 'Permitir Inativar Clientes (S/N)',           type: 'text', maxLength: 1 },
      { key: 'permitir_campo_bloqueado_cliente',    label: 'Permitir Campo Bloqueado Cliente (S/N)',     type: 'text', maxLength: 1 },
      { key: 'aprovar_pre_pedido',                  label: 'Aprovar Pré-Pedido (S/N)',                   type: 'text', maxLength: 1 },
      { key: 'visualizar_cotacao_preco',            label: 'Visualizar Cotação de Preço (S/N)',          type: 'text', maxLength: 1 },
      { key: 'alterar_limite_cliente',               label: 'Alterar Limite Cliente (S/N)',               type: 'text', maxLength: 1 },
      { key: 'permitir_imprimir_lgpd_cliente',       label: 'Permitir Imprimir LGPD Cliente (S/N)',      type: 'text', maxLength: 1 },
      { key: 'permitir_anexo_funcionario',           label: 'Permitir Anexo Funcionário (S/N)',          type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Permissões — Financeiro',
    campos: [
      { key: 'permitir_acessar_cond_pagamento',        label: 'Acessar Cond. Pagamento (S/N)',            type: 'text', maxLength: 1 },
      { key: 'permitir_alterar_juros',                  label: 'Alterar Juros (S/N)',                      type: 'text', maxLength: 1 },
      { key: 'permitir_baixar_alterar_parcelas',        label: 'Baixar/Alterar Parcelas (S/N)',            type: 'text', maxLength: 1 },
      { key: 'permitir_tornar_parcelas_pendentes',      label: 'Tornar Parcelas Pendentes (S/N)',          type: 'text', maxLength: 1 },
      { key: 'permitir_redefinir_parcelas',             label: 'Redefinir Parcelas (S/N)',                 type: 'text', maxLength: 1 },
      { key: 'permitir_excluir_pagar_receber',          label: 'Excluir Pagar/Receber (S/N)',              type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Permissões — Estoque / Romaneio',
    campos: [
      { key: 'permitir_visualizar_custo',             label: 'Visualizar Custo (S/N)',                type: 'text', maxLength: 1 },
      { key: 'permitir_alterar_romaneio_fechado',     label: 'Alterar Romaneio Fechado (S/N)',        type: 'text', maxLength: 1 },
      { key: 'permitir_excluir_romaneio',              label: 'Excluir Romaneio (S/N)',                type: 'text', maxLength: 1 },
      { key: 'permitir_alterar_unit_saidas',            label: 'Alterar Unit. Saídas (S/N)',           type: 'text', maxLength: 1 },
      { key: 'acessar_menu_batelada',                   label: 'Acessar Menu Batelada (S/N)',           type: 'text', maxLength: 1 },
    ],
  },
  {
    titulo: 'Transferência entre Empresas / Código Antigo (GENUS)',
    campos: [
      { key: 'cod_antigo_transfere1', label: 'Cód. Antigo Transfere 1', type: 'int' },
      { key: 'cod_antigo_transfere2', label: 'Cód. Antigo Transfere 2', type: 'int' },
      { key: 'cod_empresa_transf1',   label: 'Cód. Empresa Transf. 1',  type: 'int' },
      { key: 'cod_empresa_transf2',   label: 'Cód. Empresa Transf. 2',  type: 'int' },
    ],
  },
];

/** Lista plana de todas as chaves GENUS, útil para inicializar/serializar o form. */
export const GENUS_FUNCIONARIO_CAMPOS = GENUS_FUNCIONARIO_SECOES.flatMap(s => s.campos);

/** Estado vazio dos campos GENUS — usado para inicializar o FORM_VAZIO do módulo. */
export const GENUS_FUNCIONARIO_FORM_VAZIO = Object.fromEntries(
  GENUS_FUNCIONARIO_CAMPOS.map(({ key }) => [key, ''])
);

/** Constrói o pedaço do form correspondente aos campos GENUS a partir de um funcionário. */
export function buildGenusFuncionarioFormFromFuncionario(funcionario) {
  const out = {};
  for (const { key, type } of GENUS_FUNCIONARIO_CAMPOS) {
    const valor = funcionario?.[key];
    if (type === 'date') {
      out[key] = valor ? String(valor).slice(0, 10) : '';
    } else {
      out[key] = valor ?? '';
    }
  }
  return out;
}

/** Converte o pedaço GENUS do form de volta para o formato esperado pela API. */
export function serializeGenusFuncionarioForm(form) {
  const out = {};
  for (const { key, type } of GENUS_FUNCIONARIO_CAMPOS) {
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

const GENUS_FUNCIONARIO_KEYS = new Set(GENUS_FUNCIONARIO_CAMPOS.map(c => c.key));

/**
 * Normaliza o form completo do funcionário antes de enviar ao backend: mantém
 * os campos originais do ERP como estavam (sem alterar o comportamento já
 * existente) e serializa apenas os campos migrados de GENUS.FUNCIONARIO (int,
 * float e date) via `serializeGenusFuncionarioForm`.
 *
 * Usado tanto pelo hook useCrud (lista/edição em FuncionarioWindow) quanto
 * pela janela de criação NovoFuncionarioWindow.
 */
export function normalizarFuncionario(form) {
  const base = {};
  const genus = {};
  for (const [chave, valor] of Object.entries(form)) {
    if (GENUS_FUNCIONARIO_KEYS.has(chave)) genus[chave] = valor;
    else base[chave] = valor;
  }
  return { ...base, ...serializeGenusFuncionarioForm(genus) };
}
