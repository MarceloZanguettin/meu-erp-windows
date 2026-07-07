import React, { useState } from 'react';
import JanelaBase from '../JanelaBase/JanelaBase.jsx';
import TabelaCrud from '../shared/TabelaCrud.jsx';
import BarraFerramentas from '../shared/BarraFerramentas.jsx';
import ModalSimples from './ModalSimples.jsx';
import { useCrud } from '../../hooks/useCrud.js';
import './TabelasAuxiliaresWindow.css';

// Campos numéricos de "Regras Fiscais por Estado" — precisam virar Number (ou
// ser removidos do payload quando deixados em branco) antes de ir para a API,
// já que o form guarda tudo como string e o schema Pydantic usa int/float
// opcionais (mesmo padrão de normalização usado em outras janelas, ex.:
// `normalizarCentroCusto` em CentroCustoWindow/services/centroCustoService.js).
const CAMPOS_NUMERICOS_REGRAS_ESTADO = [
  'cod_regras', 'icms_st', 'reducao_icms', 'reducao_icms_st', 'ipi',
  'pis_aliquota', 'cofins_aliquota', 'cod_decreto', 'desconto_iva', 'fcp', 'cod_cbenef',
];

function normalizarRegraEstado(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_REGRAS_ESTADO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Regras" (tabela mestre GENUS.REGRAS) — mesma
// normalização usada em `normalizarRegraEstado` acima, já que o form guarda
// tudo como string e o schema Pydantic (RegraCreate/Update) usa int
// opcionais.
const CAMPOS_NUMERICOS_REGRA = ['codigo', 'cod_empresa'];

function normalizarRegra(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_REGRA) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Tabelas de Preço" — mesma normalização usada em
// `normalizarRegraEstado` acima, já que o form guarda tudo como string e o
// schema Pydantic (TabelaPrecoCreate/Update) usa int/float opcionais.
const CAMPOS_NUMERICOS_TABELA_PRECO = ['codigo', 'cod_empresa', 'percentual', 'cod_preco', 'perc_comissao'];

function normalizarTabelaPreco(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_TABELA_PRECO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Tamanhos" — mesma normalização usada em
// `normalizarTabelaPreco` acima, já que o form guarda tudo como string e o
// schema Pydantic (TamanhoCreate/Update) usa int opcional para `ordem`.
const CAMPOS_NUMERICOS_TAMANHO = ['ordem'];

function normalizarTamanho(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_TAMANHO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Marcas" — mesma normalização usada em
// `normalizarTamanho` acima, já que o form guarda tudo como string e o
// schema Pydantic (MarcaCreate/Update) usa int opcional para `codigo`
// (diferente de `Tamanho.codigo`, que é string no GENUS).
const CAMPOS_NUMERICOS_MARCA = ['codigo'];

function normalizarMarca(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_MARCA) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Tipos de Venda" — mesma normalização usada em
// `normalizarMarca` acima, já que o form guarda tudo como string e o schema
// Pydantic (TipoVendaCreate/Update) usa int opcional para `codigo`.
const CAMPOS_NUMERICOS_TIPO_VENDA = ['codigo'];

function normalizarTipoVenda(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_TIPO_VENDA) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Classificações" — tabela mestre GENUS.CLASSIFICACAO
// (classificação fiscal de produto por NCM, referenciada por
// `Produto.cod_classificacao` / GENUS.PRODUTO.CODCLASSIFICACAO), mesma
// normalização usada em `normalizarTipoVenda` acima, já que o form guarda
// tudo como string e o schema Pydantic (ClassificacaoCreate/Update) usa
// int/float opcionais para estes campos.
const CAMPOS_NUMERICOS_CLASSIFICACAO = [
  'codigo', 'cod_produto_tipo', 'aliquota_nacional', 'aliquota_importado', 'cod_cest',
];

function normalizarClassificacao(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_CLASSIFICACAO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos de "Históricos" — tabela mestre GENUS.HISTORICO (referenciada por
// ContaPagar.cod_historico / ContaReceber.cod_historico /
// LancamentoContabil.cod_historico) não têm campos numéricos: todos os
// campos são string (codigo é VARCHAR(12) no GENUS, os demais são
// flags CHAR(1)), então nenhuma normalização extra é necessária além da
// limpeza padrão de campos vazios feita pelo `useCrud`.

// Campos numéricos de "Benefícios Fiscais (CBENEF)" — tabela mestre
// GENUS.CADASTROCBENEF (catálogo de códigos de benefício fiscal usados na
// NF-e, referenciado por Produto.cod_cbenef/RegraEstado.cod_cbenef/
// ItemPedidoLan.cod_cbenef — ver docstring do model CadastroCbenef), mesma
// normalização usada em `normalizarClassificacao` acima: o form guarda tudo
// como string e o schema Pydantic (CadastroCbenefCreate/Update) usa int
// opcional apenas para `codigo`.
const CAMPOS_NUMERICOS_CADASTRO_CBENEF = ['codigo'];

function normalizarCadastroCbenef(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_CADASTRO_CBENEF) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// "Benefícios Fiscais (CBENEF)" não têm campos numéricos além de `codigo`
// (já tratado acima) — CFOP também não tem campos numéricos: CODIGO é
// VARCHAR(5) no GENUS (ex.: "5102"), então nenhuma normalização extra é
// necessária além da limpeza padrão de campos vazios feita pelo `useCrud`.

// Opções S/N reutilizadas nos 15 campos de CST da aba de CBENEF e nos
// campos S/N da aba de CFOP
const OPCOES_SIM_NAO = [
  { value: 'S', label: 'Sim' },
  { value: 'N', label: 'Não' },
];

// Campos numéricos de "CClassTrib" — tabela mestre GENUS.CCLASSTRIB
// (Código de Classificação Tributária da Reforma Tributária/IBS-CBS,
// referenciado por Produto.reforma_cclasstrib/Classificacao.reforma_cclasstrib
// e demais campos "reforma_cclasstrib*" já reconhecidos neste ERP — ver
// docstring do model CClassTrib), mesma normalização usada em
// `normalizarCadastroCbenef` acima: o form guarda tudo como string e o
// schema Pydantic (CClassTribCreate/Update) usa float para os dois
// percentuais de redução e int para os 20 indicadores IND_*.
const CAMPOS_NUMERICOS_CCLASSTRIB = [
  'perc_reducao_ibs', 'perc_reducao_cbs',
  'ind_credito_presumido_operacao', 'ind_monofasico_padrao',
  'ind_monofasico_retencao', 'ind_monofasico_retido',
  'ind_monofasico_diferimento', 'ind_estorno_credito',
  'ind_nfe_abi', 'ind_nfe', 'ind_nfce', 'ind_cte', 'ind_cte_os',
  'ind_bpe', 'ind_bpe_ta', 'ind_bpe_tm', 'ind_nf3e', 'ind_nfse',
  'ind_nfse_via', 'ind_nfcom', 'ind_nfag', 'ind_nfgas', 'ind_dere',
];

function normalizarCClassTrib(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_CCLASSTRIB) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "CST IBS/CBS" — tabela mestre GENUS.CST_IBS_CBS
// (Código de Situação Tributária do IBS/CBS da Reforma Tributária,
// referenciado por ItemSaida.reforma_cst_ibscbs/ItemEntrada.reforma_cst_ibscbs
// e também usado como CClassTrib.cst — ver docstring do model CstIbsCbs),
// mesma normalização usada em `normalizarCClassTrib` acima: o form guarda
// tudo como string e o schema Pydantic (CstIbsCbsCreate/Update) usa int
// opcional para os 7 indicadores IND_*.
const CAMPOS_NUMERICOS_CST_IBS_CBS = [
  'ind_gibscbs', 'ind_gred', 'ind_gdif', 'ind_gtransfcred',
  'ind_gcredpresibszfm', 'ind_gajustecompet', 'ind_redutorbc',
];

function normalizarCstIbsCbs(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_CST_IBS_CBS) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "IVA" — tabela mestre GENUS.IVA (Índice de Valor
// Agregado por Classificação Fiscal x Estado, usado no cálculo do
// ICMS-ST e referenciado como valor bruto já calculado nos campos
// iva/iva_reajusta de Entrada/ItemEntrada/Saida/ItemPedidoLan/ItemSaida —
// ver docstring do model Iva), mesma normalização usada em
// `normalizarCstIbsCbs` acima: o form guarda tudo como string e o schema
// Pydantic (IvaCreate/Update) usa int para `cod_classificacao` e float
// para `iva`.
const CAMPOS_NUMERICOS_IVA = ['cod_classificacao', 'iva'];

function normalizarIva(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_IVA) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Cidades" — tabela mestre GENUS.CIDADE (catálogo de
// cidades, módulo Sistema/Config, referenciada por Empresa.cod_cidade/
// CadastroPessoa.cod_cidade/ClienteCompleto.cob_cod_cidade/
// Orcamento.cli_cod_cidade como código bruto — ver docstring do model
// Cidade), mesma normalização usada em `normalizarIva` acima: o form
// guarda tudo como string e o schema Pydantic (CidadeCreate/Update) usa
// int opcional para codigo/qtde_habitante/cod_pais/qtde_pontos/meta.
const CAMPOS_NUMERICOS_CIDADE = ['codigo', 'qtde_habitante', 'cod_pais', 'qtde_pontos', 'meta'];

function normalizarCidade(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_CIDADE) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Países" — tabela mestre GENUS.PAIS (catálogo de
// países, módulo Sistema/Config, referenciada por Cidade.cod_pais como
// código bruto — ver docstring do model Pais), mesma normalização usada em
// `normalizarCidade` acima: o form guarda tudo como string e o schema
// Pydantic (PaisCreate/Update) usa int opcional para `codigo`.
const CAMPOS_NUMERICOS_PAIS = ['codigo'];

function normalizarPais(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_PAIS) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Mensagens" — tabela mestre GENUS.MENSAGEM (mensagens
// internas entre usuários/empresas do GENUS, módulo Sistema/Config —
// ver docstring do model Mensagem), mesma normalização usada em
// `normalizarPais` acima: o form guarda tudo como string e o schema
// Pydantic (MensagemCreate/Update) usa int opcional para
// codigo/cod_origem/cod_destino/usuario_origem/usuario_destino.
const CAMPOS_NUMERICOS_MENSAGEM = ['codigo', 'cod_origem', 'cod_destino', 'usuario_origem', 'usuario_destino'];

function normalizarMensagem(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_MENSAGEM) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Estados" — tabela mestre GENUS.ESTADO (catálogo de
// UFs, módulo Sistema/Config, referenciada por Cidade.cod_estado/
// RegraEstado.cod_estado/Iva.estado como código bruto (a sigla) — ver
// docstring do model Estado), mesma normalização usada em
// `normalizarMensagem` acima: o form guarda tudo como string e o schema
// Pydantic (EstadoCreate/Update) usa float opcional para icms/perc_comissao.
const CAMPOS_NUMERICOS_ESTADO = ['icms', 'perc_comissao'];

function normalizarEstado(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_ESTADO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Padrões de Consulta" — tabela mestre GENUS.
// PADRAOCONSULTA (layout de grade — ordem/colunas exibidas — salvo por
// funcionário/empresa/tela, módulo Sistema/Config — ver docstring do model
// PadraoConsulta), mesma normalização usada em `normalizarEstado` acima: o
// form guarda tudo como string e o schema Pydantic
// (PadraoConsultaCreate/Update) usa int opcional para
// codigo/cod_empresa/cod_funcionario.
const CAMPOS_NUMERICOS_PADRAO_CONSULTA = ['codigo', 'cod_empresa', 'cod_funcionario'];

function normalizarPadraoConsulta(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_PADRAO_CONSULTA) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Processos" — tabela mestre GENUS.PROCESSO (processo/
// etapa de produção, referenciado como código bruto por
// ProdutoProcesso.cod_processo/ProdutoComposicao.cod_processo — ver
// docstring do model Processo), mesma normalização usada em
// `normalizarPadraoConsulta` acima: o form guarda tudo como string e o
// schema Pydantic (ProcessoCreate/Update) usa int opcional para
// codigo/ordem.
const CAMPOS_NUMERICOS_PROCESSO = ['codigo', 'ordem'];

function normalizarProcesso(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_PROCESSO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Configurações" — tabela mestre GENUS.CONFIGURACAO
// (parâmetros/flags globais do sistema, módulo Sistema/Config — ver
// docstring do model Configuracao), mesma normalização usada em
// `normalizarPadraoConsulta` acima: o form guarda tudo como string e o
// schema Pydantic (ConfiguracaoCreate/Update) usa int opcional para
// versao/dias_atraso/colunas_mat/validade_orcamento/dias_pos_venda/
// dias_manutencao/dias_recorrencia.
const CAMPOS_NUMERICOS_CONFIGURACAO = [
  'versao', 'dias_atraso', 'colunas_mat', 'validade_orcamento',
  'dias_pos_venda', 'dias_manutencao', 'dias_recorrencia',
];

function normalizarConfiguracao(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_CONFIGURACAO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Padrões Contábeis" — tabela mestre GENUS.PADRAO
// (históricos/contas contábeis padrão usados pelas rotinas automáticas de
// lançamento do módulo financeiro/contábil — caixa padrão, cartão a
// receber, descontos, acréscimos, depreciação, partida dobrada — módulo
// Sistema/Config, ver docstring do model Padrao), mesma normalização usada
// em `normalizarConfiguracao` acima: o form guarda tudo como string e o
// schema Pydantic (PadraoCreate/Update) usa int opcional para
// codigo/caixa/cod_conta_cartao_receber/cod_conta_lancamento_credito_fornecedor/
// cod_conta_lancamento_credito.
const CAMPOS_NUMERICOS_PADRAO = [
  'codigo', 'caixa', 'cod_conta_cartao_receber',
  'cod_conta_lancamento_credito_fornecedor', 'cod_conta_lancamento_credito',
];

function normalizarPadrao(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_PADRAO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Repositório" — tabela mestre GENUS.REPOSITORIO
// (registro versionado de objeto/script interno do sistema, módulo
// Sistema/Config — ver docstring do model Repositorio), mesma
// normalização usada em `normalizarPadrao` acima: o form guarda tudo
// como string e o schema Pydantic (RepositorioCreate/Update) usa int
// opcional para versao.
const CAMPOS_NUMERICOS_REPOSITORIO = ['versao'];

function normalizarRepositorio(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_REPOSITORIO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Agenda" — tabela mestre GENUS.AGENDA (compromissos/
// lembretes, módulo RH/Folha — ver docstring do model Agenda), mesma
// normalização usada em `normalizarRepositorio` acima: o form guarda tudo
// como string e o schema Pydantic (AgendaCreate/Update) usa int opcional
// para codigo/cod_agendador/cod_para.
const CAMPOS_NUMERICOS_AGENDA = ['codigo', 'cod_agendador', 'cod_para'];

function normalizarAgenda(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_AGENDA) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Cargos" — tabela mestre GENUS.CARGO (cargos de
// funcionário, módulo RH/Folha, referenciada por Funcionario.cod_cargo
// como código bruto — ver docstring do model Cargo), mesma normalização
// usada em `normalizarAgenda` acima: o form guarda tudo como string e o
// schema Pydantic (CargoCreate/Update) usa int opcional para `codigo`.
const CAMPOS_NUMERICOS_CARGO = ['codigo'];

function normalizarCargo(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_CARGO) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Campos numéricos de "Setores" — tabela mestre GENUS.SETOR (setores de
// funcionário/contato, módulo RH/Folha, referenciada por
// Funcionario.cod_setor e CadastroContato.cod_setor como código bruto —
// ver docstring do model Setor), mesma normalização usada em
// `normalizarCargo` acima: o form guarda tudo como string e o schema
// Pydantic (SetorCreate/Update) usa int opcional para `codigo`.
const CAMPOS_NUMERICOS_SETOR = ['codigo'];

function normalizarSetor(form) {
  const dados = { ...form };
  for (const campo of Object.keys(dados)) {
    if (dados[campo] === '' || dados[campo] === undefined) {
      delete dados[campo];
    }
  }
  for (const campo of CAMPOS_NUMERICOS_SETOR) {
    if (dados[campo] !== undefined) {
      dados[campo] = Number(dados[campo]);
    }
  }
  return dados;
}

// Configuração de cada aba
const ABAS_CONFIG = [
  {
    key: 'unidades',
    label: 'Unidades de Medida',
    endpoint: '/cadastros/unidades-medida',
    formVazio: { sigla: '', descricao: '' },
    colunas: ['Sigla', 'Descrição'],
    campos: ['sigla', 'descricao'],
    campasModal: [
      { label: 'Sigla *', key: 'sigla' },
      { label: 'Descrição *', key: 'descricao' },
    ],
  },
  {
    key: 'grupos',
    label: 'Grupos/Subgrupos/Categorias',
    endpoint: '/cadastros/grupos-produto',
    formVazio: { nome: '', tipo: 'grupo', codigo: '', enviar_tablet: '', ordem: '' },
    colunas: ['Código', 'Nome', 'Tipo', 'Ordem', 'Enviar Tablet'],
    campos: ['codigo', 'nome', 'tipo', 'ordem', 'enviar_tablet'],
    campasModal: [
      { label: 'Nome *', key: 'nome' },
      { label: 'Tipo', key: 'tipo', type: 'select', options: [
        { value: 'grupo', label: 'Grupo' },
        { value: 'subgrupo', label: 'Subgrupo' },
        { value: 'categoria', label: 'Categoria' },
      ]},
      // Para tipo='grupo', este código resolve (no futuro) GENUS.GRUPO.CODIGO;
      // para tipo='subgrupo', resolve GENUS.SUBGRUPO.CODIGO (tabela irmã, mesmo formato).
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Ordem', key: 'ordem', type: 'number' },
      { label: 'Enviar Tablet', key: 'enviar_tablet', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
    ],
    renderCelula: (item, campo) => {
      if (campo === 'enviar_tablet') return item.enviar_tablet === 'S' ? 'Sim' : (item.enviar_tablet === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
  },
  {
    key: 'marcas',
    label: 'Marcas',
    endpoint: '/marcas',
    formVazio: { codigo: '', descricao: '' },
    colunas: ['Código', 'Descrição'],
    campos: ['codigo', 'descricao'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Descrição *', key: 'descricao' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarMarca,
  },
  {
    key: 'tamanhos',
    label: 'Tamanhos',
    endpoint: '/tamanhos',
    formVazio: { codigo: '', descricao: '', ordem: '' },
    colunas: ['Código', 'Descrição', 'Ordem'],
    campos: ['codigo', 'descricao', 'ordem'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Ordem', key: 'ordem', type: 'number' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarTamanho,
  },
  {
    key: 'formasPagamento',
    label: 'Formas de Pagamento',
    endpoint: '/cadastros/formas-pagamento',
    formVazio: {
      nome: '', parcelas: '1', dias_primeiro_vencimento: '30', intervalo_dias: '30', acrescimo_percentual: '0',
      codigo: '', avista_prazo: '', baixa_primeira: '', dia: '',
    },
    colunas: ['Código', 'Nome', 'Parcelas', 'Primeiro Venc.', 'Intervalo (dias)', 'Acréscimo %', 'À Vista/Prazo', 'Baixa 1ª Parcela', 'Dia Fixo'],
    campos: ['codigo', 'nome', 'parcelas', 'dias_primeiro_vencimento', 'intervalo_dias', 'acrescimo_percentual', 'avista_prazo', 'baixa_primeira', 'dia'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo' },
      { label: 'Nome *', key: 'nome' },
      { label: 'Parcelas', key: 'parcelas', type: 'number' },
      { label: 'Dias 1º Vencimento', key: 'dias_primeiro_vencimento', type: 'number' },
      { label: 'Intervalo entre parcelas (dias)', key: 'intervalo_dias', type: 'number' },
      { label: 'Acréscimo (%)', key: 'acrescimo_percentual', type: 'number', step: '0.01' },
      { label: 'À Vista / Prazo', key: 'avista_prazo', type: 'select', options: [
        { value: 'A', label: 'À Vista' },
        { value: 'P', label: 'A Prazo' },
      ]},
      { label: 'Baixa Automática 1ª Parcela', key: 'baixa_primeira', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
      { label: 'Dia Fixo de Vencimento', key: 'dia', type: 'number' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'avista_prazo') return item.avista_prazo === 'A' ? 'À Vista' : (item.avista_prazo === 'P' ? 'A Prazo' : '-');
      if (campo === 'baixa_primeira') return item.baixa_primeira === 'S' ? 'Sim' : (item.baixa_primeira === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
  },
  {
    key: 'tabelasPreco',
    label: 'Tabelas de Preço',
    endpoint: '/tabelas-preco',
    formVazio: {
      codigo: '', cod_empresa: '', descricao: '', percentual: '', cod_preco: '',
      ativo: 'S', tipo_calculo: '', tipo_comissao: '', perc_comissao: '',
    },
    colunas: [
      'Código', 'Empresa', 'Descrição', 'Percentual', 'Cód. Preço', 'Ativo',
      'Tipo Cálculo', 'Tipo Comissão', '% Comissão',
    ],
    campos: [
      'codigo', 'cod_empresa', 'descricao', 'percentual', 'cod_preco', 'ativo',
      'tipo_calculo', 'tipo_comissao', 'perc_comissao',
    ],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Código da Empresa (GENUS)', key: 'cod_empresa', type: 'number' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Percentual (%)', key: 'percentual', type: 'number', step: '0.01' },
      { label: 'Código do Preço (GENUS)', key: 'cod_preco', type: 'number' },
      { label: 'Ativo', key: 'ativo', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
      { label: 'Tipo de Cálculo', key: 'tipo_calculo' },
      { label: 'Tipo de Comissão', key: 'tipo_comissao' },
      { label: 'Comissão (%)', key: 'perc_comissao', type: 'number', step: '0.01' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'ativo') return item.ativo === 'S' ? 'Sim' : (item.ativo === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
    normalizar: normalizarTabelaPreco,
  },
  {
    key: 'planoContas',
    label: 'Plano de Contas',
    endpoint: '/cadastros/plano-contas',
    formVazio: { codigo: '', descricao: '', tipo: 'receita' },
    colunas: ['Código', 'Descrição', 'Tipo'],
    campos: ['codigo', 'descricao', 'tipo'],
    campasModal: [
      { label: 'Código *', key: 'codigo' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Tipo', key: 'tipo', type: 'select', options: [
        { value: 'receita', label: 'Receita' },
        { value: 'despesa', label: 'Despesa' },
        { value: 'ativo', label: 'Ativo' },
        { value: 'passivo', label: 'Passivo' },
      ]},
    ],
  },
  {
    key: 'centrosCusto',
    label: 'Centros de Custo',
    endpoint: '/cadastros/centros-custo',
    formVazio: { codigo: '', nome: '', ativo: true },
    colunas: ['Código', 'Nome', 'Ativo'],
    campos: ['codigo', 'nome', 'ativo'],
    campasModal: [
      { label: 'Código *', key: 'codigo' },
      { label: 'Nome *', key: 'nome' },
      { label: 'Ativo', key: 'ativo', type: 'checkbox' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'ativo') return item.ativo ? 'Sim' : 'Não';
      return item[campo] ?? '-';
    },
  },
  {
    key: 'depositos',
    label: 'Depósitos',
    endpoint: '/cadastros/depositos',
    formVazio: { nome: '', descricao: '', ativo: true },
    colunas: ['Nome', 'Descrição', 'Ativo'],
    campos: ['nome', 'descricao', 'ativo'],
    campasModal: [
      { label: 'Nome *', key: 'nome' },
      { label: 'Descrição', key: 'descricao' },
      { label: 'Ativo', key: 'ativo', type: 'checkbox' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'ativo') return item.ativo ? 'Sim' : 'Não';
      return item[campo] ?? '-';
    },
  },
  {
    key: 'regras',
    label: 'Regras',
    endpoint: '/regras',
    formVazio: {
      codigo: '', descricao: '', tipo_nf: '', tipo_cliente: '', cod_empresa: '',
      pessoa: '', tipo_apuracao: '', nao_contribuinte: '',
    },
    colunas: [
      'Código', 'Descrição', 'Tipo NF', 'Tipo Cliente', 'Empresa', 'Pessoa',
      'Tipo Apuração', 'Não Contribuinte',
    ],
    campos: [
      'codigo', 'descricao', 'tipo_nf', 'tipo_cliente', 'cod_empresa', 'pessoa',
      'tipo_apuracao', 'nao_contribuinte',
    ],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Tipo NF', key: 'tipo_nf' },
      { label: 'Tipo Cliente', key: 'tipo_cliente' },
      { label: 'Código da Empresa (GENUS)', key: 'cod_empresa', type: 'number' },
      { label: 'Pessoa', key: 'pessoa', type: 'select', options: [
        { value: 'F', label: 'Física' },
        { value: 'J', label: 'Jurídica' },
      ]},
      { label: 'Tipo de Apuração', key: 'tipo_apuracao' },
      { label: 'Não Contribuinte', key: 'nao_contribuinte', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
    ],
    renderCelula: (item, campo) => {
      if (campo === 'pessoa') return item.pessoa === 'F' ? 'Física' : (item.pessoa === 'J' ? 'Jurídica' : '-');
      if (campo === 'nao_contribuinte') return item.nao_contribuinte === 'S' ? 'Sim' : (item.nao_contribuinte === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
    normalizar: normalizarRegra,
  },
  {
    key: 'regrasEstado',
    label: 'Regras Fiscais por Estado',
    endpoint: '/regras-estado',
    formVazio: {
      cod_regras: '', cod_estado: '', cst: '', cod_cfop: '', aliquota_icms: '',
      icms_st: '', reducao_icms: '', reducao_icms_st: '', ipi_cst: '', ipi: '',
      pis_cst: '', pis_aliquota: '', cofins_cst: '', cofins_aliquota: '',
      cod_decreto: '', desconto_iva: '', csosn: '', cenq: '', fcp: '', cod_cbenef: '',
    },
    colunas: [
      'Cód. Regra', 'UF', 'CST', 'CFOP', 'Alíq. ICMS', 'ICMS ST', 'Red. ICMS',
      'Red. ICMS ST', 'CST IPI', 'IPI', 'CST PIS', 'Alíq. PIS', 'CST COFINS',
      'Alíq. COFINS', 'Cód. Decreto', 'Desc. IVA', 'CSOSN', 'CENQ', 'FCP', 'Cód. CBENEF',
    ],
    campos: [
      'cod_regras', 'cod_estado', 'cst', 'cod_cfop', 'aliquota_icms', 'icms_st',
      'reducao_icms', 'reducao_icms_st', 'ipi_cst', 'ipi', 'pis_cst', 'pis_aliquota',
      'cofins_cst', 'cofins_aliquota', 'cod_decreto', 'desconto_iva', 'csosn', 'cenq',
      'fcp', 'cod_cbenef',
    ],
    campasModal: [
      { label: 'Código da Regra (GENUS)', key: 'cod_regras', type: 'number' },
      { label: 'UF (Estado)', key: 'cod_estado' },
      { label: 'CST', key: 'cst' },
      { label: 'CFOP', key: 'cod_cfop' },
      { label: 'Alíquota ICMS', key: 'aliquota_icms' },
      { label: 'ICMS ST (%)', key: 'icms_st', type: 'number', step: '0.0001' },
      { label: 'Redução Base ICMS (%)', key: 'reducao_icms', type: 'number', step: '0.001' },
      { label: 'Redução Base ICMS ST (%)', key: 'reducao_icms_st', type: 'number', step: '0.001' },
      { label: 'CST IPI', key: 'ipi_cst' },
      { label: 'IPI (%)', key: 'ipi', type: 'number', step: '0.001' },
      { label: 'CST PIS', key: 'pis_cst' },
      { label: 'Alíquota PIS (%)', key: 'pis_aliquota', type: 'number', step: '0.0001' },
      { label: 'CST COFINS', key: 'cofins_cst' },
      { label: 'Alíquota COFINS (%)', key: 'cofins_aliquota', type: 'number', step: '0.0001' },
      { label: 'Código do Decreto (GENUS)', key: 'cod_decreto', type: 'number' },
      { label: 'Desconto IVA (%)', key: 'desconto_iva', type: 'number', step: '0.001' },
      { label: 'CSOSN', key: 'csosn' },
      { label: 'CENQ', key: 'cenq' },
      { label: 'FCP (%)', key: 'fcp', type: 'number', step: '0.0001' },
      { label: 'Código CBENEF (GENUS)', key: 'cod_cbenef', type: 'number' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarRegraEstado,
  },
  {
    key: 'tiposVenda',
    label: 'Tipos de Venda',
    endpoint: '/tipos-venda',
    formVazio: {
      codigo: '', descricao: '', retirar_estoque: '', gerar_financeiro: '',
      entrada_saida: '', mostra_relatorio: '',
    },
    colunas: [
      'Código', 'Descrição', 'Retira Estoque', 'Gera Financeiro',
      'Entrada/Saída', 'Mostra Relatório',
    ],
    campos: [
      'codigo', 'descricao', 'retirar_estoque', 'gerar_financeiro',
      'entrada_saida', 'mostra_relatorio',
    ],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Retira Estoque', key: 'retirar_estoque', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
      { label: 'Gera Financeiro', key: 'gerar_financeiro', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
      { label: 'Entrada/Saída', key: 'entrada_saida', type: 'select', options: [
        { value: 'E', label: 'Entrada' },
        { value: 'S', label: 'Saída' },
      ]},
      { label: 'Mostra no Relatório', key: 'mostra_relatorio', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
    ],
    renderCelula: (item, campo) => {
      if (campo === 'retirar_estoque') return item.retirar_estoque === 'S' ? 'Sim' : (item.retirar_estoque === 'N' ? 'Não' : '-');
      if (campo === 'gerar_financeiro') return item.gerar_financeiro === 'S' ? 'Sim' : (item.gerar_financeiro === 'N' ? 'Não' : '-');
      if (campo === 'entrada_saida') return item.entrada_saida === 'E' ? 'Entrada' : (item.entrada_saida === 'S' ? 'Saída' : '-');
      if (campo === 'mostra_relatorio') return item.mostra_relatorio === 'S' ? 'Sim' : (item.mostra_relatorio === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
    normalizar: normalizarTipoVenda,
  },
  {
    key: 'historicos',
    label: 'Históricos',
    endpoint: '/historicos',
    formVazio: {
      codigo: '', descricao: '', debito_credito: '', grau: '', situacao: '',
      mostrar_dre: '', permissao: '', tipo: '',
    },
    colunas: [
      'Código', 'Descrição', 'Déb./Créd.', 'Grau', 'Situação', 'Mostra DRE',
      'Permissão', 'Tipo',
    ],
    campos: [
      'codigo', 'descricao', 'debito_credito', 'grau', 'situacao',
      'mostrar_dre', 'permissao', 'tipo',
    ],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Débito/Crédito', key: 'debito_credito', type: 'select', options: [
        { value: 'D', label: 'Débito' },
        { value: 'C', label: 'Crédito' },
      ]},
      { label: 'Grau (GENUS)', key: 'grau' },
      { label: 'Situação', key: 'situacao', type: 'select', options: [
        { value: 'A', label: 'Ativo' },
        { value: 'I', label: 'Inativo' },
      ]},
      { label: 'Mostrar no DRE', key: 'mostrar_dre', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
      { label: 'Permissão (GENUS)', key: 'permissao' },
      { label: 'Tipo (GENUS)', key: 'tipo' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'debito_credito') return item.debito_credito === 'D' ? 'Débito' : (item.debito_credito === 'C' ? 'Crédito' : '-');
      if (campo === 'situacao') return item.situacao === 'A' ? 'Ativo' : (item.situacao === 'I' ? 'Inativo' : '-');
      if (campo === 'mostrar_dre') return item.mostrar_dre === 'S' ? 'Sim' : (item.mostrar_dre === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
  },
  {
    key: 'classificacoes',
    label: 'Classificações Fiscais (NCM)',
    endpoint: '/classificacoes',
    formVazio: {
      codigo: '', ncm: '', cod_produto_tipo: '', aliquota_nacional: '',
      aliquota_importado: '', cod_cest: '', unidade_exportacao: '',
      reforma_cclasstrib: '', descricao_ncm: '',
    },
    colunas: [
      'Código', 'NCM', 'Descrição NCM', 'Cód. Tipo Produto', 'Alíq. Nacional (%)',
      'Alíq. Importado (%)', 'Cód. CEST', 'Unid. Exportação', 'Reforma Cl. Trib.',
    ],
    campos: [
      'codigo', 'ncm', 'descricao_ncm', 'cod_produto_tipo', 'aliquota_nacional',
      'aliquota_importado', 'cod_cest', 'unidade_exportacao', 'reforma_cclasstrib',
    ],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'NCM *', key: 'ncm' },
      { label: 'Descrição do NCM', key: 'descricao_ncm' },
      { label: 'Código do Tipo de Produto (GENUS)', key: 'cod_produto_tipo', type: 'number' },
      { label: 'Alíquota Nacional (IPI, %)', key: 'aliquota_nacional', type: 'number', step: '0.01' },
      { label: 'Alíquota Importado (IPI, %)', key: 'aliquota_importado', type: 'number', step: '0.01' },
      { label: 'Código do CEST (GENUS)', key: 'cod_cest', type: 'number' },
      { label: 'Unidade de Exportação', key: 'unidade_exportacao' },
      { label: 'Reforma Tributária (CClassTrib)', key: 'reforma_cclasstrib' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarClassificacao,
  },
  {
    key: 'cadastroCbenef',
    label: 'Benefícios Fiscais (CBENEF)',
    endpoint: '/cadastro-cbenef',
    formVazio: {
      codigo: '', cbenef: '', simples_nacional: '',
      cst_00: '', cst_02: '', cst_10: '', cst_15: '', cst_20: '', cst_30: '',
      cst_40: '', cst_41: '', cst_50: '', cst_51: '', cst_53: '', cst_60: '',
      cst_61: '', cst_70: '', cst_90: '',
      dispositivo: '', objeto_descricao: '', observacao: '',
    },
    colunas: ['Código', 'CBENEF', 'Simples Nacional', 'Descrição do Objeto'],
    campos: ['codigo', 'cbenef', 'simples_nacional', 'objeto_descricao'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'CBENEF *', key: 'cbenef' },
      { label: 'Aplicável ao Simples Nacional', key: 'simples_nacional', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 00 (Tributada integralmente)', key: 'cst_00', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 02', key: 'cst_02', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 10 (Tributada c/ ST)', key: 'cst_10', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 15', key: 'cst_15', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 20 (Redução de BC)', key: 'cst_20', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 30 (Isenta/não trib. c/ ST)', key: 'cst_30', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 40 (Isenta)', key: 'cst_40', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 41 (Não tributada)', key: 'cst_41', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 50 (Suspensão)', key: 'cst_50', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 51 (Diferimento)', key: 'cst_51', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 53', key: 'cst_53', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 60 (Cobrado anteriormente por ST)', key: 'cst_60', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 61', key: 'cst_61', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 70 (Redução BC c/ ST)', key: 'cst_70', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'CST 90 (Outras)', key: 'cst_90', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Dispositivo Legal', key: 'dispositivo', type: 'textarea' },
      { label: 'Descrição do Objeto', key: 'objeto_descricao', type: 'textarea' },
      { label: 'Observação', key: 'observacao', type: 'textarea' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'simples_nacional') return item.simples_nacional === 'S' ? 'Sim' : (item.simples_nacional === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
    normalizar: normalizarCadastroCbenef,
  },
  {
    key: 'cfops',
    label: 'CFOP',
    endpoint: '/cfops',
    formVazio: {
      codigo: '', descricao: '', mensagem_1: '', mensagem_2: '',
      cod_contabil_prazo: '', cod_contabil_avista: '', credito_icms: '',
      observacao: '', obrigatorio_retorno_mercadoria: '',
    },
    colunas: [
      'Código', 'Descrição', 'Cód. Contábil (Prazo)', 'Cód. Contábil (À Vista)',
      'Crédito ICMS', 'Retorno Obrigatório',
    ],
    campos: [
      'codigo', 'descricao', 'cod_contabil_prazo', 'cod_contabil_avista',
      'credito_icms', 'obrigatorio_retorno_mercadoria',
    ],
    campasModal: [
      { label: 'Código (GENUS) *', key: 'codigo' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Mensagem 1', key: 'mensagem_1' },
      { label: 'Mensagem 2', key: 'mensagem_2' },
      { label: 'Código Contábil (Operação a Prazo, GENUS)', key: 'cod_contabil_prazo' },
      { label: 'Código Contábil (Operação à Vista, GENUS)', key: 'cod_contabil_avista' },
      { label: 'Gera Crédito de ICMS', key: 'credito_icms', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Exige Retorno de Mercadoria', key: 'obrigatorio_retorno_mercadoria', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Observação', key: 'observacao', type: 'textarea' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'credito_icms') return item.credito_icms === 'S' ? 'Sim' : (item.credito_icms === 'N' ? 'Não' : '-');
      if (campo === 'obrigatorio_retorno_mercadoria') return item.obrigatorio_retorno_mercadoria === 'S' ? 'Sim' : (item.obrigatorio_retorno_mercadoria === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
  },
  {
    key: 'cclasstribs',
    label: 'CClassTrib (IBS/CBS)',
    endpoint: '/cclasstribs',
    formVazio: {
      cclasstrib: '', cst: '', nome: '', descricao: '',
      perc_reducao_ibs: '', perc_reducao_cbs: '',
      ind_redutor_bc: '', ind_tributacao_regular: '',
      data_inicio_vigencia: '', data_fim_vigencia: '', data_atualizacao: '',
      ind_monofasico: '', lc: '',
      ind_credito_presumido_operacao: '', ind_monofasico_padrao: '',
      ind_monofasico_retencao: '', ind_monofasico_retido: '',
      ind_monofasico_diferimento: '', ind_estorno_credito: '',
      ind_nfe_abi: '', ind_nfe: '', ind_nfce: '', ind_cte: '', ind_cte_os: '',
      ind_bpe: '', ind_bpe_ta: '', ind_bpe_tm: '', ind_nf3e: '',
      ind_nfse: '', ind_nfse_via: '', ind_nfcom: '', ind_nfag: '',
      ind_nfgas: '', ind_dere: '',
    },
    colunas: [
      'CClassTrib', 'CST', 'Nome', 'Red. IBS (%)', 'Red. CBS (%)',
      'Redutor BC', 'Trib. Regular', 'Monofásico', 'Início Vigência', 'Fim Vigência',
    ],
    campos: [
      'cclasstrib', 'cst', 'nome', 'perc_reducao_ibs', 'perc_reducao_cbs',
      'ind_redutor_bc', 'ind_tributacao_regular', 'ind_monofasico',
      'data_inicio_vigencia', 'data_fim_vigencia',
    ],
    campasModal: [
      { label: 'CClassTrib (GENUS) *', key: 'cclasstrib' },
      { label: 'CST', key: 'cst' },
      { label: 'Nome *', key: 'nome' },
      { label: 'Descrição', key: 'descricao', type: 'textarea' },
      { label: 'Redução de Alíquota IBS (%)', key: 'perc_reducao_ibs', type: 'number', step: '0.0001' },
      { label: 'Redução de Alíquota CBS (%)', key: 'perc_reducao_cbs', type: 'number', step: '0.0001' },
      { label: 'Redutor de Base de Cálculo', key: 'ind_redutor_bc', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Tributação Regular', key: 'ind_tributacao_regular', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Monofásico', key: 'ind_monofasico', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Lei Complementar (base legal)', key: 'lc' },
      { label: 'Início da Vigência', key: 'data_inicio_vigencia', type: 'datetime-local' },
      { label: 'Fim da Vigência', key: 'data_fim_vigencia', type: 'datetime-local' },
      { label: 'Data de Atualização (GENUS)', key: 'data_atualizacao', type: 'datetime-local' },
      { label: 'Crédito Presumido na Operação', key: 'ind_credito_presumido_operacao', type: 'number' },
      { label: 'Monofásico Padrão', key: 'ind_monofasico_padrao', type: 'number' },
      { label: 'Monofásico Retenção', key: 'ind_monofasico_retencao', type: 'number' },
      { label: 'Monofásico Retido', key: 'ind_monofasico_retido', type: 'number' },
      { label: 'Monofásico Diferimento', key: 'ind_monofasico_diferimento', type: 'number' },
      { label: 'Estorno de Crédito', key: 'ind_estorno_credito', type: 'number' },
      { label: 'Aplica NF-e ABI', key: 'ind_nfe_abi', type: 'number' },
      { label: 'Aplica NF-e', key: 'ind_nfe', type: 'number' },
      { label: 'Aplica NFC-e', key: 'ind_nfce', type: 'number' },
      { label: 'Aplica CT-e', key: 'ind_cte', type: 'number' },
      { label: 'Aplica CT-e OS', key: 'ind_cte_os', type: 'number' },
      { label: 'Aplica BP-e', key: 'ind_bpe', type: 'number' },
      { label: 'Aplica BP-e TA', key: 'ind_bpe_ta', type: 'number' },
      { label: 'Aplica BP-e TM', key: 'ind_bpe_tm', type: 'number' },
      { label: 'Aplica NF3-e', key: 'ind_nf3e', type: 'number' },
      { label: 'Aplica NFS-e', key: 'ind_nfse', type: 'number' },
      { label: 'Aplica NFS-e Via', key: 'ind_nfse_via', type: 'number' },
      { label: 'Aplica NFCom', key: 'ind_nfcom', type: 'number' },
      { label: 'Aplica NFAgro', key: 'ind_nfag', type: 'number' },
      { label: 'Aplica NFGás', key: 'ind_nfgas', type: 'number' },
      { label: 'Aplica DeRE', key: 'ind_dere', type: 'number' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'ind_redutor_bc') return item.ind_redutor_bc === 'S' ? 'Sim' : (item.ind_redutor_bc === 'N' ? 'Não' : '-');
      if (campo === 'ind_tributacao_regular') return item.ind_tributacao_regular === 'S' ? 'Sim' : (item.ind_tributacao_regular === 'N' ? 'Não' : '-');
      if (campo === 'ind_monofasico') return item.ind_monofasico === 'S' ? 'Sim' : (item.ind_monofasico === 'N' ? 'Não' : '-');
      if (campo === 'data_inicio_vigencia' || campo === 'data_fim_vigencia') {
        return item[campo] ? new Date(item[campo]).toLocaleDateString('pt-BR') : '-';
      }
      return item[campo] ?? '-';
    },
    normalizar: normalizarCClassTrib,
  },
  {
    key: 'cstIbsCbs',
    label: 'CST IBS/CBS',
    endpoint: '/cst-ibs-cbs',
    formVazio: {
      cst: '', descricao: '',
      ind_gibscbs: '', ind_gred: '', ind_gdif: '', ind_gtransfcred: '',
      ind_gcredpresibszfm: '', ind_gajustecompet: '', ind_redutorbc: '',
    },
    colunas: [
      'CST', 'Descrição', 'IBS/CBS', 'Redução', 'Diferimento',
      'Transf. Crédito', 'Créd. Pres. ZFM', 'Ajuste Compet.', 'Redutor BC',
    ],
    campos: [
      'cst', 'descricao', 'ind_gibscbs', 'ind_gred', 'ind_gdif',
      'ind_gtransfcred', 'ind_gcredpresibszfm', 'ind_gajustecompet', 'ind_redutorbc',
    ],
    campasModal: [
      { label: 'CST (GENUS) *', key: 'cst' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Aplica IBS/CBS', key: 'ind_gibscbs', type: 'number' },
      { label: 'Redução de Alíquota', key: 'ind_gred', type: 'number' },
      { label: 'Diferimento', key: 'ind_gdif', type: 'number' },
      { label: 'Transferência de Crédito', key: 'ind_gtransfcred', type: 'number' },
      { label: 'Crédito Presumido IBS (ZFM)', key: 'ind_gcredpresibszfm', type: 'number' },
      { label: 'Ajuste de Competência', key: 'ind_gajustecompet', type: 'number' },
      { label: 'Redutor de Base de Cálculo', key: 'ind_redutorbc', type: 'number' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarCstIbsCbs,
  },
  {
    key: 'ivas',
    label: 'IVA (ICMS-ST)',
    endpoint: '/ivas',
    formVazio: { cod_classificacao: '', estado: '', iva: '' },
    colunas: ['Cód. Classificação', 'UF', 'IVA (%)'],
    campos: ['cod_classificacao', 'estado', 'iva'],
    campasModal: [
      { label: 'Código da Classificação (GENUS) *', key: 'cod_classificacao', type: 'number' },
      { label: 'UF (Estado) *', key: 'estado' },
      { label: 'IVA (%)', key: 'iva', type: 'number', step: '0.0001' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarIva,
  },
  {
    key: 'cidades',
    label: 'Cidades',
    endpoint: '/cidades',
    formVazio: {
      codigo: '', nome: '', cod_estado: '', qtde_habitante: '', cep: '',
      ibge: '', cod_pais: '', qtde_pontos: '', observacao: '', meta: '',
    },
    colunas: ['Código', 'Nome', 'UF', 'CEP', 'IBGE', 'Qtde. Habitantes'],
    campos: ['codigo', 'nome', 'cod_estado', 'cep', 'ibge', 'qtde_habitante'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Nome *', key: 'nome' },
      { label: 'UF (Estado)', key: 'cod_estado' },
      { label: 'Qtde. Habitantes', key: 'qtde_habitante', type: 'number' },
      { label: 'CEP', key: 'cep' },
      { label: 'Código IBGE', key: 'ibge' },
      { label: 'Código do País (GENUS)', key: 'cod_pais', type: 'number' },
      { label: 'Qtde. Pontos', key: 'qtde_pontos', type: 'number' },
      { label: 'Meta (GENUS)', key: 'meta', type: 'number' },
      { label: 'Observação', key: 'observacao', type: 'textarea' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarCidade,
  },
  {
    key: 'paises',
    label: 'Países',
    endpoint: '/paises',
    formVazio: { codigo: '', nome: '' },
    colunas: ['Código', 'Nome'],
    campos: ['codigo', 'nome'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Nome *', key: 'nome' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarPais,
  },
  {
    key: 'mensagens',
    label: 'Mensagens',
    endpoint: '/mensagens',
    formVazio: {
      codigo: '', cod_origem: '', cod_destino: '', usuario_origem: '',
      usuario_destino: '', titulo: '', observacao: '', chave: '', dia: '',
    },
    colunas: ['Código', 'Título', 'Origem (Usuário)', 'Destino (Usuário)', 'Data/Hora', 'Chave'],
    campos: ['codigo', 'titulo', 'usuario_origem', 'usuario_destino', 'dia', 'chave'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Título *', key: 'titulo' },
      { label: 'Código da Empresa/Cadastro de Origem (GENUS)', key: 'cod_origem', type: 'number' },
      { label: 'Código da Empresa/Cadastro de Destino (GENUS)', key: 'cod_destino', type: 'number' },
      { label: 'Código do Usuário de Origem (GENUS)', key: 'usuario_origem', type: 'number' },
      { label: 'Código do Usuário de Destino (GENUS)', key: 'usuario_destino', type: 'number' },
      { label: 'Data/Hora', key: 'dia', type: 'datetime-local' },
      { label: 'Chave (GENUS)', key: 'chave' },
      { label: 'Observação', key: 'observacao', type: 'textarea' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'dia') return item.dia ? new Date(item.dia).toLocaleString('pt-BR') : '-';
      return item[campo] ?? '-';
    },
    normalizar: normalizarMensagem,
  },
  {
    key: 'estados',
    label: 'Estados',
    endpoint: '/estados',
    formVazio: { sigla: '', nome: '', icms: '', perc_comissao: '' },
    colunas: ['UF', 'Nome', 'ICMS (%)', 'Comissão (%)'],
    campos: ['sigla', 'nome', 'icms', 'perc_comissao'],
    campasModal: [
      { label: 'UF (Sigla) *', key: 'sigla' },
      { label: 'Nome *', key: 'nome' },
      { label: 'ICMS (%)', key: 'icms', type: 'number', step: '0.001' },
      { label: 'Comissão (%)', key: 'perc_comissao', type: 'number', step: '0.001' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarEstado,
  },
  {
    key: 'processos',
    label: 'Processos',
    endpoint: '/processos',
    formVazio: { codigo: '', descricao: '', mostrar: '', ordem: '' },
    colunas: ['Código', 'Descrição', 'Mostrar', 'Ordem'],
    campos: ['codigo', 'descricao', 'mostrar', 'ordem'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Descrição *', key: 'descricao' },
      { label: 'Mostrar', key: 'mostrar', type: 'select', options: [
        { value: 'S', label: 'Sim' },
        { value: 'N', label: 'Não' },
      ]},
      { label: 'Ordem', key: 'ordem', type: 'number' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'mostrar') return item.mostrar === 'S' ? 'Sim' : (item.mostrar === 'N' ? 'Não' : '-');
      return item[campo] ?? '-';
    },
    normalizar: normalizarProcesso,
  },
  {
    key: 'padroesConsulta',
    label: 'Padrões de Consulta',
    endpoint: '/padroes-consulta',
    formVazio: {
      codigo: '', cod_empresa: '', tipo_consulta: '', checkbox: '',
      ordem: '', cod_funcionario: '', coluna: '',
    },
    colunas: ['Código', 'Tipo de Consulta', 'Empresa', 'Funcionário', 'Checkbox'],
    campos: ['codigo', 'tipo_consulta', 'cod_empresa', 'cod_funcionario', 'checkbox'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Tipo de Consulta *', key: 'tipo_consulta' },
      { label: 'Código da Empresa (GENUS)', key: 'cod_empresa', type: 'number' },
      { label: 'Código do Funcionário (GENUS)', key: 'cod_funcionario', type: 'number' },
      { label: 'Checkbox (GENUS)', key: 'checkbox' },
      { label: 'Ordem das Colunas (GENUS)', key: 'ordem', type: 'textarea' },
      { label: 'Colunas Exibidas (GENUS)', key: 'coluna', type: 'textarea' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarPadraoConsulta,
  },
  {
    key: 'configuracoes',
    label: 'Configurações do Sistema',
    endpoint: '/configuracoes',
    formVazio: {
      codigo: '', versao: '', dh: '', dc: '', estoque_cliente: '', frete: '',
      dias_atraso: '', producao: '', nf_eletronica: '', imagem: '',
      lote_produto: '', preco_minimo: '', pedido_mat: '', orcamento_mat: '',
      recibo_mat: '', prevenda_mat: '', duplicata_mat: '', fatura_mat: '',
      colunas_mat: '', carne_mat: '', copia_cupom: '', banco_origem: '',
      banco_destino: '', conexao_destino: '', balanca: '',
      validade_orcamento: '', agregado: '', volume: '', fatura_pedido: '',
      controle: '', calcula_custo: '', estoque_negativo: '',
      producao_receita: '', status_func: '', tablet: '', holerite: '',
      custo_producao: '', locacao: '', manutencao: '', producao_etapas: '',
      custo_medio_producao: '', estoque_pre_pedido: '', checar_mensagem: '',
      grade: '', empresa_nao_fiscal: '', icms_mensagem: '',
      cadastrar_importar_xml: '', desconto_acumulativo: '',
      data_envio_arquivos_contador: '', logo_impressao_pedido: '',
      logo_impressao_pre_pedido: '', mostra_lembrete_agenda: '',
      alterar_nota: '', cotacao_por_agregado: '', xml_automatico_contador: '',
      reduzir_icms_pis_cofins: '', verificar_cst_reducao_icms: '',
      menu_batelada: '', aprovar_pre_pedido: '', producao_etapas_processo: '',
      atualizar_custo_por_composicao: '', consulta_sem_espaco: '',
      consulta_sem_espaco_palavra: '', ultima_consulta_produto: '',
      consulta_produto_completo: '', producao_cores: '', estoque_reservado: '',
      fechamento_producao: '', conferencia_fechamento_producao: '',
      obrigar_preencher_dados_cliente: '', dias_pos_venda: '',
      dias_manutencao: '', dias_recorrencia: '', data_prevista: '',
      nova_prospeccao: '', enviar_email_automatico: '',
      vbloq_estoque_financeiro: '', enviar_email_status: '',
      imagem_produto: '', faturamento_parcial: '', producao_manual: '',
      perda_ganho_automatico: '', confeccao: '', anexos_internos: '',
      cad_cclasstrib_automatico: '',
    },
    colunas: [
      'Código', 'Versão', 'Produção', 'NF Eletrônica', 'Balança', 'Tablet',
      'Estoque Negativo', 'Grade',
    ],
    campos: [
      'codigo', 'versao', 'producao', 'nf_eletronica', 'balanca', 'tablet',
      'estoque_negativo', 'grade',
    ],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo' },
      { label: 'Versão (GENUS)', key: 'versao', type: 'number' },
      { label: 'DH (GENUS)', key: 'dh' },
      { label: 'DC (GENUS)', key: 'dc' },
      { label: 'Controla Estoque do Cliente', key: 'estoque_cliente', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Controla Frete', key: 'frete', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Dias de Atraso (tolerância)', key: 'dias_atraso', type: 'number' },
      { label: 'Módulo de Produção Ativo', key: 'producao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Nota Fiscal Eletrônica Ativa', key: 'nf_eletronica', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Imagem (GENUS, base64/caminho)', key: 'imagem', type: 'textarea' },
      { label: 'Controla Lote do Produto', key: 'lote_produto', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Controla Preço Mínimo', key: 'preco_minimo', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Matricial — Pedido', key: 'pedido_mat', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Matricial — Orçamento', key: 'orcamento_mat', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Matricial — Recibo', key: 'recibo_mat', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Matricial — Pré-venda', key: 'prevenda_mat', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Matricial — Duplicata', key: 'duplicata_mat', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Matricial — Fatura', key: 'fatura_mat', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Colunas da Impressão Matricial', key: 'colunas_mat', type: 'number' },
      { label: 'Matricial — Carnê', key: 'carne_mat', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Cópia do Cupom', key: 'copia_cupom', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Banco de Dados de Origem (GENUS)', key: 'banco_origem' },
      { label: 'Banco de Dados de Destino (GENUS)', key: 'banco_destino' },
      { label: 'Conexão de Destino (GENUS)', key: 'conexao_destino' },
      { label: 'Usa Balança', key: 'balanca', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Validade do Orçamento (dias)', key: 'validade_orcamento', type: 'number' },
      { label: 'Usa Agregado', key: 'agregado', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Controla Volume', key: 'volume', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Fatura a partir do Pedido', key: 'fatura_pedido', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Controle Ativo', key: 'controle', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Calcula Custo Automaticamente', key: 'calcula_custo', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Permite Estoque Negativo', key: 'estoque_negativo', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Produção por Receita', key: 'producao_receita', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Status do Funcionário Ativo', key: 'status_func', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Usa Tablet', key: 'tablet', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Emite Holerite', key: 'holerite', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Custo de Produção Ativo', key: 'custo_producao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Módulo de Locação Ativo', key: 'locacao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Módulo de Manutenção Ativo', key: 'manutencao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Produção por Etapas', key: 'producao_etapas', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Custo Médio de Produção', key: 'custo_medio_producao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Estoque de Pré-pedido', key: 'estoque_pre_pedido', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Checar Mensagens ao Entrar', key: 'checar_mensagem', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Usa Grade de Produto', key: 'grade', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Empresa Não Fiscal', key: 'empresa_nao_fiscal', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Exibe Mensagem de ICMS', key: 'icms_mensagem', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Permite Cadastrar Importando XML', key: 'cadastrar_importar_xml', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Desconto Acumulativo', key: 'desconto_acumulativo', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Data de Envio dos Arquivos ao Contador', key: 'data_envio_arquivos_contador', type: 'datetime-local' },
      { label: 'Logo na Impressão do Pedido', key: 'logo_impressao_pedido', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Logo na Impressão do Pré-pedido', key: 'logo_impressao_pre_pedido', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Mostra Lembrete de Agenda', key: 'mostra_lembrete_agenda', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Permite Alterar Nota', key: 'alterar_nota', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Cotação por Agregado', key: 'cotacao_por_agregado', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'XML Automático para o Contador', key: 'xml_automatico_contador', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Reduzir ICMS/PIS/COFINS', key: 'reduzir_icms_pis_cofins', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Verificar CST de Redução de ICMS', key: 'verificar_cst_reducao_icms', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Menu de Batelada Ativo', key: 'menu_batelada', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Exige Aprovação de Pré-pedido', key: 'aprovar_pre_pedido', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Produção por Etapas de Processo', key: 'producao_etapas_processo', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Atualiza Custo por Composição', key: 'atualizar_custo_por_composicao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Consulta Sem Espaço', key: 'consulta_sem_espaco', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Consulta Sem Espaço por Palavra', key: 'consulta_sem_espaco_palavra', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Lembra Última Consulta de Produto', key: 'ultima_consulta_produto', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Consulta de Produto Completa', key: 'consulta_produto_completo', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Produção por Cores', key: 'producao_cores', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Controla Estoque Reservado', key: 'estoque_reservado', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Fechamento de Produção Ativo', key: 'fechamento_producao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Exige Conferência no Fechamento de Produção', key: 'conferencia_fechamento_producao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Obriga Preencher Dados do Cliente', key: 'obrigar_preencher_dados_cliente', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Dias de Pós-venda', key: 'dias_pos_venda', type: 'number' },
      { label: 'Dias de Manutenção', key: 'dias_manutencao', type: 'number' },
      { label: 'Dias de Recorrência', key: 'dias_recorrencia', type: 'number' },
      { label: 'Usa Data Prevista', key: 'data_prevista', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Nova Prospecção', key: 'nova_prospeccao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Envia E-mail Automático', key: 'enviar_email_automatico', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Bloqueia Estoque no Financeiro', key: 'vbloq_estoque_financeiro', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Envia E-mail de Status', key: 'enviar_email_status', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Exibe Imagem do Produto', key: 'imagem_produto', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Permite Faturamento Parcial', key: 'faturamento_parcial', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Produção Manual', key: 'producao_manual', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Perda/Ganho Automático', key: 'perda_ganho_automatico', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Módulo de Confecção Ativo', key: 'confeccao', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Anexos Internos', key: 'anexos_internos', type: 'select', options: OPCOES_SIM_NAO },
      { label: 'Cadastra CClassTrib Automaticamente', key: 'cad_cclasstrib_automatico', type: 'select', options: OPCOES_SIM_NAO },
    ],
    renderCelula: (item, campo) => {
      const CAMPOS_SIM_NAO = [
        'producao', 'nf_eletronica', 'balanca', 'tablet', 'estoque_negativo', 'grade',
      ];
      if (CAMPOS_SIM_NAO.includes(campo)) {
        return item[campo] === 'S' ? 'Sim' : (item[campo] === 'N' ? 'Não' : '-');
      }
      return item[campo] ?? '-';
    },
    normalizar: normalizarConfiguracao,
  },
  {
    key: 'padroes',
    label: 'Padrões Contábeis',
    endpoint: '/padroes',
    formVazio: {
      codigo: '', caixa: '', historico_receber: '', historico_pagar: '',
      historico_desconto: '', historico_acrescimo: '', historico_cartao: '',
      historico_depreciacao: '', historico_lancamento_credito: '',
      cod_conta_cartao_receber: '', historico_credito_partida_dobrada: '',
      historico_debito_partida_dobrada: '', historico_credito_cartao_desconto: '',
      historico_debito_cartao_desconto: '', historico_lancamento_credito_fornecedor: '',
      cod_conta_lancamento_credito_fornecedor: '', cod_conta_lancamento_credito: '',
    },
    colunas: [
      'Código', 'Caixa', 'Hist. Receber', 'Hist. Pagar', 'Hist. Desconto',
      'Hist. Acréscimo', 'Hist. Cartão',
    ],
    campos: [
      'codigo', 'caixa', 'historico_receber', 'historico_pagar',
      'historico_desconto', 'historico_acrescimo', 'historico_cartao',
    ],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Código da Conta Caixa Padrão (GENUS)', key: 'caixa', type: 'number' },
      { label: 'Histórico Padrão — Contas a Receber (GENUS)', key: 'historico_receber' },
      { label: 'Histórico Padrão — Contas a Pagar (GENUS)', key: 'historico_pagar' },
      { label: 'Histórico Padrão — Desconto (GENUS)', key: 'historico_desconto' },
      { label: 'Histórico Padrão — Acréscimo (GENUS)', key: 'historico_acrescimo' },
      { label: 'Histórico Padrão — Cartão (GENUS)', key: 'historico_cartao' },
      { label: 'Histórico Padrão — Depreciação (GENUS)', key: 'historico_depreciacao' },
      { label: 'Histórico Padrão — Lançamento de Crédito (GENUS)', key: 'historico_lancamento_credito' },
      { label: 'Código da Conta — Cartão a Receber (GENUS)', key: 'cod_conta_cartao_receber', type: 'number' },
      { label: 'Histórico Padrão — Crédito Partida Dobrada (GENUS)', key: 'historico_credito_partida_dobrada' },
      { label: 'Histórico Padrão — Débito Partida Dobrada (GENUS)', key: 'historico_debito_partida_dobrada' },
      { label: 'Histórico Padrão — Crédito Desconto de Cartão (GENUS)', key: 'historico_credito_cartao_desconto' },
      { label: 'Histórico Padrão — Débito Desconto de Cartão (GENUS)', key: 'historico_debito_cartao_desconto' },
      { label: 'Histórico Padrão — Lançamento de Crédito de Fornecedor (GENUS)', key: 'historico_lancamento_credito_fornecedor' },
      { label: 'Código da Conta — Lançamento de Crédito de Fornecedor (GENUS)', key: 'cod_conta_lancamento_credito_fornecedor', type: 'number' },
      { label: 'Código da Conta — Lançamento de Crédito (GENUS)', key: 'cod_conta_lancamento_credito', type: 'number' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarPadrao,
  },
  {
    key: 'repositorios',
    label: 'Repositório do Sistema',
    endpoint: '/repositorios',
    formVazio: { nome: '', aq: '', versao: '', atualiza: '' },
    colunas: ['Nome', 'Versão', 'Atualizado em'],
    campos: ['nome', 'versao', 'atualiza'],
    campasModal: [
      { label: 'Nome (GENUS)', key: 'nome' },
      { label: 'Conteúdo/Referência (GENUS)', key: 'aq', type: 'textarea' },
      { label: 'Versão (GENUS)', key: 'versao', type: 'number' },
      { label: 'Atualizado em (GENUS)', key: 'atualiza', type: 'datetime-local' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarRepositorio,
  },
  {
    key: 'restricoes',
    label: 'Restrições Cadastrais',
    endpoint: '/restricoes',
    // Tabela mestre GENUS.RESTRICAO (bloqueio de crédito/negativação por
    // CPF/CNPJ, identificado diretamente pelo documento — sem FK para
    // CADASTRO — ver docstring do model Restricao). Todos os campos são
    // string, então nenhuma normalização numérica extra é necessária além
    // da limpeza padrão de campos vazios feita pelo `useCrud` (mesmo
    // critério de "Históricos" acima).
    formVazio: { cpf_cnpj: '', nome: '', motivo: '' },
    colunas: ['CPF/CNPJ', 'Nome', 'Motivo'],
    campos: ['cpf_cnpj', 'nome', 'motivo'],
    campasModal: [
      { label: 'CPF/CNPJ *', key: 'cpf_cnpj' },
      { label: 'Nome *', key: 'nome' },
      { label: 'Motivo', key: 'motivo' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
  },
  {
    key: 'agendas',
    label: 'Agenda',
    endpoint: '/agendas',
    // Tabela mestre GENUS.AGENDA (compromissos/lembretes, módulo RH/Folha —
    // ver docstring do model Agenda). `cod_agendador` e `cod_para` são
    // códigos brutos (FUNCIONARIO e CADASTRO, respectivamente), sem FK
    // própria — mesmo critério de "Mensagens" acima.
    formVazio: {
      codigo: '', cod_agendador: '', cod_para: '', data: '', hora: '',
      texto: '', emissao: '', status: '',
    },
    colunas: ['Código', 'Agendador', 'Para', 'Data', 'Hora', 'Status'],
    campos: ['codigo', 'cod_agendador', 'cod_para', 'data', 'hora', 'status'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Código do Funcionário Agendador (GENUS)', key: 'cod_agendador', type: 'number' },
      { label: 'Código da Pessoa/Empresa Destino (GENUS)', key: 'cod_para', type: 'number' },
      { label: 'Data', key: 'data', type: 'datetime-local' },
      { label: 'Hora', key: 'hora' },
      { label: 'Status', key: 'status' },
      { label: 'Emissão', key: 'emissao', type: 'datetime-local' },
      { label: 'Texto', key: 'texto', type: 'textarea' },
    ],
    renderCelula: (item, campo) => {
      if (campo === 'data') return item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-';
      return item[campo] ?? '-';
    },
    normalizar: normalizarAgenda,
  },
  {
    key: 'cargos',
    label: 'Cargos',
    endpoint: '/cargos',
    // Tabela mestre GENUS.CARGO (cargos de funcionário, módulo RH/Folha —
    // ver docstring do model Cargo). Referenciada como código bruto por
    // Funcionario.cod_cargo, sem FK própria — mesmo critério de
    // "Agenda"/"Mensagens" acima.
    formVazio: { codigo: '', descricao: '' },
    colunas: ['Código', 'Descrição'],
    campos: ['codigo', 'descricao'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Descrição *', key: 'descricao' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarCargo,
  },
  {
    key: 'setores',
    label: 'Setores',
    endpoint: '/setores',
    // Tabela mestre GENUS.SETOR (setores de funcionário/contato, módulo
    // RH/Folha — ver docstring do model Setor). Referenciada como código
    // bruto por Funcionario.cod_setor e CadastroContato.cod_setor, sem FK
    // própria — mesmo critério de "Cargos" acima.
    formVazio: { codigo: '', descricao: '' },
    colunas: ['Código', 'Descrição'],
    campos: ['codigo', 'descricao'],
    campasModal: [
      { label: 'Código (GENUS)', key: 'codigo', type: 'number' },
      { label: 'Descrição *', key: 'descricao' },
    ],
    renderCelula: (item, campo) => item[campo] ?? '-',
    normalizar: normalizarSetor,
  },
];

function AbaAuxiliar({ config, abrirJanela }) {
  const { colunas, campos, campasModal, renderCelula } = config;
  const { itens, loading, modal, editandoId, form, setForm, busca, setBusca, abrirAdicionar, abrirEditar, salvar, excluir, fecharModal, recarregar } =
    useCrud(config.endpoint, config.formVazio, config.normalizar);

  const itensFiltrados = itens.filter(i =>
    !busca || Object.values(i).some(v => String(v).toLowerCase().includes(busca.toLowerCase()))
  );

  const handleAdicionar = () => abrirJanela('novaEntradaAuxiliar', { config, onSalvar: recarregar });

  return (
    <div className="aba-auxiliar">
      <BarraFerramentas busca={busca} setBusca={setBusca} onAdicionar={handleAdicionar} />
      {loading ? (
        <div className="aux-loading">Carregando...</div>
      ) : (
        <TabelaCrud
          colunas={colunas}
          campos={campos}
          itens={itensFiltrados}
          onEditar={abrirEditar}
          onExcluir={excluir}
          renderCelula={renderCelula}
        />
      )}
      {modal && (
        <ModalSimples
          titulo={config.label}
          campos={campasModal}
          form={form}
          setForm={setForm}
          onSalvar={salvar}
          onFechar={fecharModal}
          editando={!!editandoId}
        />
      )}
    </div>
  );
}

export default function TabelasAuxiliaresWindow({ id, onClose, onMinimize, abrirJanela }) {
  const [abaAtiva, setAbaAtiva] = useState(ABAS_CONFIG[0].key);
  const configAtiva = ABAS_CONFIG.find(a => a.key === abaAtiva);

  return (
    <JanelaBase id={id} titulo="Tabelas Auxiliares" onClose={onClose} onMinimize={onMinimize} largura={1050} altura={640}>
      <div className="tabs-header aux-tabs-header">
        {ABAS_CONFIG.map(a => (
          <button
            key={a.key}
            type="button"
            className={`tab-btn ${abaAtiva === a.key ? 'active' : ''}`}
            onClick={() => setAbaAtiva(a.key)}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div className="tab-content aux-tab-content">
        <AbaAuxiliar key={abaAtiva} config={configAtiva} abrirJanela={abrirJanela} />
      </div>
    </JanelaBase>
  );
}
