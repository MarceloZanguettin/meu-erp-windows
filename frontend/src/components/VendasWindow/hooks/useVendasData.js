import { useState, useEffect, useCallback } from 'react';
import {
  fetchOrcamentos, fetchPedidosVenda, salvarOrcamento, aprovarOrcamento, converterOrcamento, excluirOrcamento,
  salvarPedidoVenda, faturarPedidoVenda, excluirPedidoVenda, fetchRepresentantes, fetchFormasPagamento,
} from '../services/vendasService.js';

const FORM_ORC_VAZIO = { nome_cliente: '', data_validade: '', forma_pagamento_id: '', desconto_percentual: '0', observacao: '' };
const FORM_PED_VAZIO = { nome_cliente: '', data_entrega_prevista: '', forma_pagamento_id: '', representante_id: '', desconto_percentual: '0', observacao: '' };
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
        itens: itensOrc.map(i => ({
          ...i,
          quantidade: parseFloat(i.quantidade) || 0,
          preco_unitario: parseFloat(i.preco_unitario) || 0,
        })),
      };
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
    ITEM_VAZIO,
  };
}
