import { useState, useEffect, useCallback } from 'react';
import {
  fetchSolicitacoes, fetchPedidos, salvarSolicitacao, aprovarSolicitacao, excluirSolicitacao,
  salvarPedido, receberPedido, excluirPedido, fetchFornecedores, fetchFormasPagamento,
} from '../services/comprasService.js';

const FORM_SOLIC_VAZIO = { solicitante: '', observacao: '' };
const FORM_PEDIDO_VAZIO = { fornecedor_id: '', data_entrega_prevista: '', forma_pagamento_id: '', observacao: '' };
const ITEM_VAZIO = { descricao: '', quantidade: '', unidade: '' };
const ITEM_PEDIDO_VAZIO = { descricao: '', quantidade: '', preco_unitario: '', unidade: '' };

export function useComprasData() {
  const [solicitacoes, setSolicitacoes]     = useState([]);
  const [pedidos, setPedidos]               = useState([]);
  const [fornecedores, setFornecedores]     = useState([]);
  const [formasPag, setFormasPag]           = useState([]);
  const [loadingSolic, setLoadingSolic]     = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  // Modal solicitação
  const [modalSolic, setModalSolic]         = useState(false);
  const [editandoSolicId, setEditSolicId]   = useState(null);
  const [formSolic, setFormSolic]           = useState({ ...FORM_SOLIC_VAZIO });
  const [itensSolic, setItensSolic]         = useState([]);

  // Modal pedido
  const [modalPedido, setModalPedido]       = useState(false);
  const [editandoPedidoId, setEditPedidoId] = useState(null);
  const [formPedido, setFormPedido]         = useState({ ...FORM_PEDIDO_VAZIO });
  const [itensPedido, setItensPedido]       = useState([]);

  const carregarSolicitacoes = useCallback(async () => {
    setLoadingSolic(true);
    try { setSolicitacoes(await fetchSolicitacoes()); } catch (e) { console.error(e); } finally { setLoadingSolic(false); }
  }, []);

  const carregarPedidos = useCallback(async () => {
    setLoadingPedidos(true);
    try { setPedidos(await fetchPedidos()); } catch (e) { console.error(e); } finally { setLoadingPedidos(false); }
  }, []);

  useEffect(() => {
    carregarSolicitacoes();
    carregarPedidos();
    Promise.all([fetchFornecedores(), fetchFormasPagamento()]).then(([f, fp]) => {
      setFornecedores(f);
      setFormasPag(fp);
    });
  }, [carregarSolicitacoes, carregarPedidos]);

  // Solicitações
  const abrirNovaSolic = useCallback(() => {
    setEditSolicId(null);
    setFormSolic({ ...FORM_SOLIC_VAZIO });
    setItensSolic([{ ...ITEM_VAZIO }]);
    setModalSolic(true);
  }, []);

  const abrirEditarSolic = useCallback((s) => {
    setEditSolicId(s.id);
    setFormSolic({ solicitante: s.solicitante || '', observacao: s.observacao || '' });
    setItensSolic(s.itens?.length ? s.itens.map(i => ({ descricao: i.descricao || '', quantidade: i.quantidade || '', unidade: i.unidade || '' })) : [{ ...ITEM_VAZIO }]);
    setModalSolic(true);
  }, []);

  const salvarSolicHandler = useCallback(async () => {
    try {
      await salvarSolicitacao({ ...formSolic, itens: itensSolic }, editandoSolicId);
      setModalSolic(false);
      carregarSolicitacoes();
    } catch (e) { alert('Erro: ' + e.message); }
  }, [formSolic, itensSolic, editandoSolicId, carregarSolicitacoes]);

  const aprovarSolicHandler = useCallback(async (id) => {
    try { await aprovarSolicitacao(id); carregarSolicitacoes(); } catch (e) { alert('Erro: ' + e.message); }
  }, [carregarSolicitacoes]);

  const excluirSolicHandler = useCallback(async (id) => {
    if (!window.confirm('Excluir esta solicitação?')) return;
    try { await excluirSolicitacao(id); carregarSolicitacoes(); } catch (e) { alert('Erro ao excluir'); }
  }, [carregarSolicitacoes]);

  // Pedidos
  const abrirNovoPedido = useCallback(() => {
    setEditPedidoId(null);
    setFormPedido({ ...FORM_PEDIDO_VAZIO });
    setItensPedido([{ ...ITEM_PEDIDO_VAZIO }]);
    setModalPedido(true);
  }, []);

  const abrirEditarPedido = useCallback((p) => {
    setEditPedidoId(p.id);
    setFormPedido({
      fornecedor_id:        p.fornecedor_id || '',
      data_entrega_prevista: p.data_entrega_prevista ? p.data_entrega_prevista.slice(0, 10) : '',
      forma_pagamento_id:   p.forma_pagamento_id || '',
      observacao:           p.observacao || '',
    });
    setItensPedido(p.itens?.length ? p.itens.map(i => ({
      descricao: i.descricao || '', quantidade: i.quantidade || '',
      preco_unitario: i.preco_unitario || '', unidade: i.unidade || '',
    })) : [{ ...ITEM_PEDIDO_VAZIO }]);
    setModalPedido(true);
  }, []);

  const salvarPedidoHandler = useCallback(async () => {
    try {
      const payload = {
        ...formPedido,
        fornecedor_id: formPedido.fornecedor_id ? parseInt(formPedido.fornecedor_id) : null,
        forma_pagamento_id: formPedido.forma_pagamento_id ? parseInt(formPedido.forma_pagamento_id) : null,
        itens: itensPedido.map(i => ({
          ...i,
          quantidade: parseFloat(i.quantidade) || 0,
          preco_unitario: parseFloat(i.preco_unitario) || 0,
        })),
      };
      await salvarPedido(payload, editandoPedidoId);
      setModalPedido(false);
      carregarPedidos();
    } catch (e) { alert('Erro: ' + e.message); }
  }, [formPedido, itensPedido, editandoPedidoId, carregarPedidos]);

  const receberPedidoHandler = useCallback(async (id) => {
    try { await receberPedido(id); carregarPedidos(); } catch (e) { alert('Erro: ' + e.message); }
  }, [carregarPedidos]);

  const excluirPedidoHandler = useCallback(async (id) => {
    if (!window.confirm('Excluir este pedido?')) return;
    try { await excluirPedido(id); carregarPedidos(); } catch (e) { alert('Erro ao excluir'); }
  }, [carregarPedidos]);

  return {
    solicitacoes, pedidos, fornecedores, formasPag,
    loadingSolic, loadingPedidos,
    // modal solic
    modalSolic, setModalSolic, editandoSolicId, formSolic, setFormSolic, itensSolic, setItensSolic,
    abrirNovaSolic, abrirEditarSolic, salvarSolicHandler, aprovarSolicHandler, excluirSolicHandler,
    // modal pedido
    modalPedido, setModalPedido, editandoPedidoId, formPedido, setFormPedido, itensPedido, setItensPedido,
    abrirNovoPedido, abrirEditarPedido, salvarPedidoHandler, receberPedidoHandler, excluirPedidoHandler,
    ITEM_VAZIO: { descricao: '', quantidade: '', unidade: '' },
    ITEM_PEDIDO_VAZIO: { descricao: '', quantidade: '', preco_unitario: '', unidade: '' },
  };
}
