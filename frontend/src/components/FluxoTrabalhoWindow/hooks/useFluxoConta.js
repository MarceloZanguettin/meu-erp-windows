import { useState, useEffect, useCallback } from 'react';
import { fetchContas, salvarConta, baixarConta, excluirConta } from '../services/fluxoService';

const FORM_VAZIO = {
  empresa_id:      '',
  descricao:       '',
  valor:           '',
  data_vencimento: '',
  observacao:      '',
};

/**
 * Hook Controller — gerencia o estado e as ações CRUD de contas a pagar ou a receber
 * para o módulo Fluxo de Trabalho.
 *
 * @param {'pagar'|'receber'} tipo
 * @param {object[]}          empresas  lista de empresas (para pré-selecionar no form)
 */
export function useFluxoConta(tipo, empresas) {
  const [contas,    setContas]    = useState([]);
  const [modal,     setModal]     = useState(false);
  const [editando,  setEditando]  = useState(null);
  const [form,      setForm]      = useState(FORM_VAZIO);

  const carregar = useCallback(() => {
    fetchContas(tipo).then(setContas).catch(() => {});
  }, [tipo]);

  useEffect(() => { carregar(); }, [carregar]);

  const abrirAdicionar = useCallback(() => {
    setEditando(null);
    setForm({ ...FORM_VAZIO, empresa_id: empresas[0]?.id ?? '' });
    setModal(true);
  }, [empresas]);

  const abrirEditar = useCallback((conta) => {
    setEditando(conta.id);
    setForm({
      empresa_id:      conta.empresa_id,
      descricao:       conta.descricao,
      valor:           conta.valor,
      data_vencimento: conta.data_vencimento.slice(0, 10),
      observacao:      conta.observacao ?? '',
    });
    setModal(true);
  }, []);

  const salvar = useCallback(async () => {
    const payload = {
      ...form,
      valor:           parseFloat(form.valor),
      empresa_id:      parseInt(form.empresa_id),
      data_vencimento: new Date(form.data_vencimento + 'T00:00:00').toISOString(),
    };
    try {
      await salvarConta(tipo, payload, editando);
      setModal(false);
      carregar();
    } catch (e) {
      alert('Erro ao salvar: ' + e.message);
    }
  }, [tipo, form, editando, carregar]);

  const baixar = useCallback(async (id) => {
    await baixarConta(tipo, id);
    carregar();
  }, [tipo, carregar]);

  const excluir = useCallback(async (id) => {
    if (!window.confirm('Excluir este lançamento?')) return;
    await excluirConta(tipo, id);
    carregar();
  }, [tipo, carregar]);

  return {
    contas,
    modal,
    editando,
    form,
    setForm,
    abrirAdicionar,
    abrirEditar,
    salvar,
    baixar,
    excluir,
    fecharModal: () => setModal(false),
  };
}
