import { useState, useEffect, useCallback } from 'react';
import {
  fetchOrcamentos, fetchPedidosVenda, salvarOrcamento, aprovarOrcamento, converterOrcamento, excluirOrcamento,
  salvarPedidoVenda, faturarPedidoVenda, excluirPedidoVenda, fetchRepresentantes, fetchFormasPagamento,
} from '../services/vendasService.js';

const FORM_ORC_VAZIO = {
  nome_cliente: '', data_validade: '', forma_pagamento_id: '', desconto_percentual: '0', observacao: '',
  // Dados adicionais (GENUS.ORCAMENTO) — ver models/tabelas.py::Orcamento
  cod_empresa: '', codigo_genus: '', cod_cliente: '',
  cod_cond_pagto: '', cod_funcionario: '', avista_prazo: '', dt_pedido: '', liberado: '', dt_liberado: '', cod_adm: '',
  cli_endereco: '', cli_numero: '', cli_cod_cidade: '', cli_cep: '', cli_fone: '', cli_contato: '', cli_bairro: '', cli_cpf_cnpj: '',
  frete: '', cod_transportador: '', tipo_frete: '', cod_tabela_preco: '',
  status_genus: '', motivo: '', prazo_entrega: '',
  cod_agregado: '', especie: '',
};

// Campos GENUS.ORCAMENTO que são inteiros — precisam de parseInt (ou null) antes de enviar
const CAMPOS_ORC_GENUS_INT = [
  'cod_empresa', 'codigo_genus', 'cod_cliente', 'cod_funcionario', 'cod_adm',
  'cli_cod_cidade', 'cod_transportador', 'cod_tabela_preco', 'cod_agregado',
];
// Campos GENUS.ORCAMENTO do tipo data — vazio deve virar null
const CAMPOS_ORC_GENUS_DATA = ['dt_pedido', 'dt_liberado', 'prazo_entrega'];
const FORM_PED_VAZIO = {
  nome_cliente: '', data_entrega_prevista: '', forma_pagamento_id: '', representante_id: '', desconto_percentual: '0', observacao: '',
  // Dados adicionais (GENUS.PEDIDO) — ver models/tabelas.py::PedidoVenda
  cod_empresa: '', codigo_genus: '', doc: '', serie: '', cod_cliente: '', cod_representante: '', cod_cond_pagto: '', cod_chave: '',
  cod_cfop: '', cod_cfop2: '', icms_base: '', icms_valor: '', icms_base_subst: '', icms_valor_subst: '', ipi_valor: '', credito_icms: '',
  tipo_nf: '', tipo_cliente: '', cte: '', numero_nf: '', total_nf: '',
  valor_produtos: '', quantidade_genus: '', peso_bruto_genus: '', peso_liquido_genus: '', valor_unit: '', qtde_kg: '', valor_kg: '',
  frete: '', seguro: '', outras_despesas: '', cod_transportador: '', frete_conta: '', tipo_frete: '', perc_frete: '', valor_frete: '',
  frete_interno: '', tipo_transporte: '', local_entrega: '', voltagem: '',
  desc_acres: '', descto1: '', descto2: '', descto3: '', descto4: '', descto5: '', perc_desconto: '', desconto_interno: '', perc_divisao: '', comissao: '',
  avista_prazo: '', vencimento: '', cod_contas: '', cod_carteira: '', cod_tabela_preco: '', cod_tipo_venda: '', lote: '',
  tipo_pedido: '', tipo: '', tipo_pre_pedido: '', cod_tipo_ocorrencia: '', status_genus: '', excluido: '', telemarketing: '', contato: '',
  liberado: '', cod_liberacao: '', dt_liberacao: '', cod_aprovacao: '', dt_aprovacao: '', motivo_bloqueio: '', antes_bloqueado: '',
  orcamento_negado: '', motivo_orcamento_negado: '', cod_func_orcamento_negado: '',
  liberado_para_producao: '', producao_etapas: '', cod_movto_grade: '', cod_agregado: '', cod_empresa_saida_prod: '', codigo_saida_prod: '', doc_saida_prod: '',
  faturado: '', obs_interna: '', pedido_representante: '',
  cod_alteracao: '', hora_alteracao_genus: '', data_alteracao_genus: '',
};

// Campos GENUS.PEDIDO que são inteiros — precisam de parseInt (ou null) antes de enviar
const CAMPOS_PED_GENUS_INT = [
  'cod_empresa', 'codigo_genus', 'doc', 'cod_cliente', 'cod_representante', 'cod_chave',
  'cte', 'numero_nf', 'cod_transportador', 'cod_contas', 'cod_carteira', 'cod_tabela_preco', 'cod_tipo_venda',
  'cod_tipo_ocorrencia', 'cod_liberacao', 'cod_aprovacao', 'cod_func_orcamento_negado',
  'cod_movto_grade', 'cod_agregado', 'cod_empresa_saida_prod', 'codigo_saida_prod', 'cod_alteracao', 'voltagem',
];
// Campos GENUS.PEDIDO do tipo float — vazio deve virar null
const CAMPOS_PED_GENUS_FLOAT = [
  'icms_base', 'icms_valor', 'icms_base_subst', 'icms_valor_subst', 'ipi_valor', 'credito_icms', 'total_nf',
  'valor_produtos', 'valor_unit', 'qtde_kg', 'valor_kg', 'frete', 'seguro', 'outras_despesas', 'perc_frete', 'valor_frete',
  'frete_interno', 'desc_acres', 'descto1', 'descto2', 'descto3', 'descto4', 'descto5', 'perc_desconto',
  'desconto_interno', 'perc_divisao', 'comissao',
];
// Campos GENUS.PEDIDO do tipo data — vazio deve virar null
const CAMPOS_PED_GENUS_DATA = ['vencimento', 'dt_liberacao', 'dt_aprovacao', 'data_alteracao_genus'];
const ITEM_VAZIO = { descricao: '', quantidade: '', preco_unitario: '', unidade: '' };

export function useVendasData() {
  const [orcamentos, setOrcamentos]         = useState([]);
  const [pedidos, setPedidos]               = useState([]);
  const [representantes, setRepresentantes] = useState([]);
  const [formasPag, setFormasPag]           = useState([]);
  const [loadingOrc, setLoadingOrc]         = useState(false);
  const [loadingPed, setLoadingPed]         = useState(false);

  // Modal orçamento
  const [modalOrc, setModalOrc]             = useState(false);
  const [editandoOrcId, setEditOrcId]       = useState(null);
  const [formOrc, setFormOrc]               = useState({ ...FORM_ORC_VAZIO });
  const [itensOrc, setItensOrc]             = useState([]);

  // Modal pedido
  const [modalPed, setModalPed]             = useState(false);
  const [editandoPedId, setEditPedId]       = useState(null);
  const [formPed, setFormPed]               = useState({ ...FORM_PED_VAZIO });
  const [itensPed, setItensPed]             = useState([]);

  const carregarOrcamentos = useCallback(async () => {
    setLoadingOrc(true);
    try { setOrcamentos(await fetchOrcamentos()); } catch (e) { console.error(e); } finally { setLoadingOrc(false); }
  }, []);

  const carregarPedidos = useCallback(async () => {
    setLoadingPed(true);
    try { setPedidos(await fetchPedidosVenda()); } catch (e) { console.error(e); } finally { setLoadingPed(false); }
  }, []);

  useEffect(() => {
    carregarOrcamentos();
    carregarPedidos();
    Promise.all([fetchRepresentantes(), fetchFormasPagamento()]).then(([r, fp]) => {
      setRepresentantes(r);
      setFormasPag(fp);
    });
  }, [carregarOrcamentos, carregarPedidos]);

  // Orçamentos
  const abrirNovoOrc = useCallback(() => {
    setEditOrcId(null);
    setFormOrc({ ...FORM_ORC_VAZIO });
    setItensOrc([{ ...ITEM_VAZIO }]);
    setModalOrc(true);
  }, []);

  const abrirEditarOrc = useCallback((o) => {
    setEditOrcId(o.id);
    setFormOrc({
      nome_cliente:      o.nome_cliente || '',
      data_validade:     o.data_validade ? o.data_validade.slice(0, 10) : '',
      forma_pagamento_id: o.forma_pagamento_id || '',
      desconto_percentual: o.desconto_percentual || '0',
      observacao:        o.observacao || '',
      cod_empresa:       o.cod_empresa ?? '',
      codigo_genus:      o.codigo_genus ?? '',
      cod_cliente:       o.cod_cliente ?? '',
      cod_cond_pagto:    o.cod_cond_pagto || '',
      cod_funcionario:   o.cod_funcionario ?? '',
      avista_prazo:      o.avista_prazo || '',
      dt_pedido:         o.dt_pedido ? o.dt_pedido.slice(0, 10) : '',
      liberado:          o.liberado || '',
      dt_liberado:       o.dt_liberado ? o.dt_liberado.slice(0, 10) : '',
      cod_adm:           o.cod_adm ?? '',
      cli_endereco:      o.cli_endereco || '',
      cli_numero:        o.cli_numero || '',
      cli_cod_cidade:    o.cli_cod_cidade ?? '',
      cli_cep:           o.cli_cep || '',
      cli_fone:          o.cli_fone || '',
      cli_contato:       o.cli_contato || '',
      cli_bairro:        o.cli_bairro || '',
      cli_cpf_cnpj:      o.cli_cpf_cnpj || '',
      frete:             o.frete ?? '',
      cod_transportador: o.cod_transportador ?? '',
      tipo_frete:        o.tipo_frete || '',
      cod_tabela_preco:  o.cod_tabela_preco ?? '',
      status_genus:      o.status_genus || '',
      motivo:            o.motivo || '',
      prazo_entrega:     o.prazo_entrega ? o.prazo_entrega.slice(0, 10) : '',
      cod_agregado:      o.cod_agregado ?? '',
      especie:           o.especie || '',
    });
    setItensOrc(o.itens?.length ? o.itens.map(i => ({
      descricao: i.descricao || '', quantidade: i.quantidade || '',
      preco_unitario: i.preco_unitario || '', unidade: i.unidade || '',
    })) : [{ ...ITEM_VAZIO }]);
    setModalOrc(true);
  }, []);

  const salvarOrcHandler = useCallback(async () => {
    try {
      const payload = {
        ...formOrc,
        forma_pagamento_id: formOrc.forma_pagamento_id ? parseInt(formOrc.forma_pagamento_id) : null,
        desconto_percentual: parseFloat(formOrc.desconto_percentual) || 0,
        frete: formOrc.frete !== '' ? parseFloat(formOrc.frete) : null,
        itens: itensOrc.map(i => ({
          ...i,
          quantidade: parseFloat(i.quantidade) || 0,
          preco_unitario: parseFloat(i.preco_unitario) || 0,
        })),
      };
      CAMPOS_ORC_GENUS_INT.forEach(campo => {
        payload[campo] = formOrc[campo] !== '' && formOrc[campo] != null ? parseInt(formOrc[campo], 10) : null;
      });
      CAMPOS_ORC_GENUS_DATA.forEach(campo => {
        payload[campo] = formOrc[campo] || null;
      });
      await salvarOrcamento(payload, editandoOrcId);
      setModalOrc(false);
      carregarOrcamentos();
    } catch (e) { alert('Erro: ' + e.message); }
  }, [formOrc, itensOrc, editandoOrcId, carregarOrcamentos]);

  const aprovarOrcHandler = useCallback(async (id) => {
    try { await aprovarOrcamento(id); carregarOrcamentos(); } catch (e) { alert('Erro: ' + e.message); }
  }, [carregarOrcamentos]);

  const converterOrcHandler = useCallback(async (id) => {
    try { await converterOrcamento(id); carregarOrcamentos(); carregarPedidos(); } catch (e) { alert('Erro: ' + e.message); }
  }, [carregarOrcamentos, carregarPedidos]);

  const excluirOrcHandler = useCallback(async (id) => {
    if (!window.confirm('Excluir este orçamento?')) return;
    try { await excluirOrcamento(id); carregarOrcamentos(); } catch (e) { alert('Erro ao excluir'); }
  }, [carregarOrcamentos]);

  // Pedidos de venda
  const abrirNovoPed = useCallback(() => {
    setEditPedId(null);
    setFormPed({ ...FORM_PED_VAZIO });
    setItensPed([{ ...ITEM_VAZIO }]);
    setModalPed(true);
  }, []);

  const abrirEditarPed = useCallback((p) => {
    setEditPedId(p.id);
    setFormPed({
      nome_cliente:           p.nome_cliente || '',
      data_entrega_prevista:  p.data_entrega_prevista ? p.data_entrega_prevista.slice(0, 10) : '',
      forma_pagamento_id:     p.forma_pagamento_id || '',
      representante_id:       p.representante_id || '',
      desconto_percentual:    p.desconto_percentual || '0',
      observacao:             p.observacao || '',
      cod_empresa: p.cod_empresa ?? '', codigo_genus: p.codigo_genus ?? '', doc: p.doc ?? '', serie: p.serie || '',
      cod_cliente: p.cod_cliente ?? '', cod_representante: p.cod_representante ?? '', cod_cond_pagto: p.cod_cond_pagto || '', cod_chave: p.cod_chave ?? '',
      cod_cfop: p.cod_cfop || '', cod_cfop2: p.cod_cfop2 || '', icms_base: p.icms_base ?? '', icms_valor: p.icms_valor ?? '',
      icms_base_subst: p.icms_base_subst ?? '', icms_valor_subst: p.icms_valor_subst ?? '', ipi_valor: p.ipi_valor ?? '', credito_icms: p.credito_icms ?? '',
      tipo_nf: p.tipo_nf || '', tipo_cliente: p.tipo_cliente || '', cte: p.cte ?? '', numero_nf: p.numero_nf ?? '', total_nf: p.total_nf ?? '',
      valor_produtos: p.valor_produtos ?? '', quantidade_genus: p.quantidade_genus || '', peso_bruto_genus: p.peso_bruto_genus || '',
      peso_liquido_genus: p.peso_liquido_genus || '', valor_unit: p.valor_unit ?? '', qtde_kg: p.qtde_kg ?? '', valor_kg: p.valor_kg ?? '',
      frete: p.frete ?? '', seguro: p.seguro ?? '', outras_despesas: p.outras_despesas ?? '', cod_transportador: p.cod_transportador ?? '',
      frete_conta: p.frete_conta || '', tipo_frete: p.tipo_frete || '', perc_frete: p.perc_frete ?? '', valor_frete: p.valor_frete ?? '',
      frete_interno: p.frete_interno ?? '', tipo_transporte: p.tipo_transporte || '', local_entrega: p.local_entrega || '', voltagem: p.voltagem ?? '',
      desc_acres: p.desc_acres ?? '', descto1: p.descto1 ?? '', descto2: p.descto2 ?? '', descto3: p.descto3 ?? '', descto4: p.descto4 ?? '', descto5: p.descto5 ?? '',
      perc_desconto: p.perc_desconto ?? '', desconto_interno: p.desconto_interno ?? '', perc_divisao: p.perc_divisao ?? '', comissao: p.comissao ?? '',
      avista_prazo: p.avista_prazo || '', vencimento: p.vencimento ? p.vencimento.slice(0, 10) : '', cod_contas: p.cod_contas ?? '',
      cod_carteira: p.cod_carteira ?? '', cod_tabela_preco: p.cod_tabela_preco ?? '', cod_tipo_venda: p.cod_tipo_venda ?? '', lote: p.lote || '',
      tipo_pedido: p.tipo_pedido || '', tipo: p.tipo || '', tipo_pre_pedido: p.tipo_pre_pedido || '', cod_tipo_ocorrencia: p.cod_tipo_ocorrencia ?? '',
      status_genus: p.status_genus || '', excluido: p.excluido || '', telemarketing: p.telemarketing || '', contato: p.contato || '',
      liberado: p.liberado || '', cod_liberacao: p.cod_liberacao ?? '', dt_liberacao: p.dt_liberacao ? p.dt_liberacao.slice(0, 10) : '',
      cod_aprovacao: p.cod_aprovacao ?? '', dt_aprovacao: p.dt_aprovacao ? p.dt_aprovacao.slice(0, 10) : '',
      motivo_bloqueio: p.motivo_bloqueio || '', antes_bloqueado: p.antes_bloqueado || '',
      orcamento_negado: p.orcamento_negado || '', motivo_orcamento_negado: p.motivo_orcamento_negado || '', cod_func_orcamento_negado: p.cod_func_orcamento_negado ?? '',
      liberado_para_producao: p.liberado_para_producao || '', producao_etapas: p.producao_etapas || '', cod_movto_grade: p.cod_movto_grade ?? '',
      cod_agregado: p.cod_agregado ?? '', cod_empresa_saida_prod: p.cod_empresa_saida_prod ?? '', codigo_saida_prod: p.codigo_saida_prod ?? '',
      doc_saida_prod: p.doc_saida_prod || '',
      faturado: p.faturado || '', obs_interna: p.obs_interna || '', pedido_representante: p.pedido_representante || '',
      cod_alteracao: p.cod_alteracao ?? '', hora_alteracao_genus: p.hora_alteracao_genus || '',
      data_alteracao_genus: p.data_alteracao_genus ? p.data_alteracao_genus.slice(0, 10) : '',
    });
    setItensPed(p.itens?.length ? p.itens.map(i => ({
      descricao: i.descricao || '', quantidade: i.quantidade || '',
      preco_unitario: i.preco_unitario || '', unidade: i.unidade || '',
    })) : [{ ...ITEM_VAZIO }]);
    setModalPed(true);
  }, []);

  const salvarPedHandler = useCallback(async () => {
    try {
      const payload = {
        ...formPed,
        forma_pagamento_id: formPed.forma_pagamento_id ? parseInt(formPed.forma_pagamento_id) : null,
        representante_id:   formPed.representante_id ? parseInt(formPed.representante_id) : null,
        desconto_percentual: parseFloat(formPed.desconto_percentual) || 0,
        itens: itensPed.map(i => ({
          ...i,
          quantidade: parseFloat(i.quantidade) || 0,
          preco_unitario: parseFloat(i.preco_unitario) || 0,
        })),
      };
      CAMPOS_PED_GENUS_INT.forEach(campo => {
        payload[campo] = formPed[campo] !== '' && formPed[campo] != null ? parseInt(formPed[campo], 10) : null;
      });
      CAMPOS_PED_GENUS_FLOAT.forEach(campo => {
        payload[campo] = formPed[campo] !== '' && formPed[campo] != null ? parseFloat(formPed[campo]) : null;
      });
      CAMPOS_PED_GENUS_DATA.forEach(campo => {
        payload[campo] = formPed[campo] || null;
      });
      await salvarPedidoVenda(payload, editandoPedId);
      setModalPed(false);
      carregarPedidos();
    } catch (e) { alert('Erro: ' + e.message); }
  }, [formPed, itensPed, editandoPedId, carregarPedidos]);

  const faturarPedHandler = useCallback(async (id) => {
    try { await faturarPedidoVenda(id); carregarPedidos(); } catch (e) { alert('Erro: ' + e.message); }
  }, [carregarPedidos]);

  const excluirPedHandler = useCallback(async (id) => {
    if (!window.confirm('Excluir este pedido?')) return;
    try { await excluirPedidoVenda(id); carregarPedidos(); } catch (e) { alert('Erro ao excluir'); }
  }, [carregarPedidos]);

  return {
    orcamentos, pedidos, representantes, formasPag,
    loadingOrc, loadingPed,
    modalOrc, setModalOrc, editandoOrcId, formOrc, setFormOrc, itensOrc, setItensOrc,
    abrirNovoOrc, abrirEditarOrc, salvarOrcHandler, aprovarOrcHandler, converterOrcHandler, excluirOrcHandler,
    modalPed, setModalPed, editandoPedId, formPed, setFormPed, itensPed, setItensPed,
    abrirNovoPed, abrirEditarPed, salvarPedHandler, faturarPedHandler, excluirPedHandler,
    carregarOrcamentos, carregarPedidos,
    ITEM_VAZIO,
  };
}
