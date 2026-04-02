import { useState, useEffect, useCallback } from 'react';
import { fetchPosicao, fetchMovimentos, registrarMovimento, fetchProdutos, fetchDepositos } from '../services/estoqueService.js';

const FORM_MOV_VAZIO = {
  produto_id: '',
  produto_nome: '',
  deposito_id: '',
  tipo: 'entrada',
  quantidade: '',
  custo_unitario: '',
  documento_ref: '',
  observacao: '',
};

export function useEstoqueData() {
  const [posicao, setPosicao]         = useState([]);
  const [movimentos, setMovimentos]   = useState([]);
  const [produtos, setProdutos]       = useState([]);
  const [depositos, setDepositos]     = useState([]);
  const [loadingPosicao, setLoadingP] = useState(false);
  const [loadingMov, setLoadingM]     = useState(false);
  const [buscaPosicao, setBuscaP]     = useState('');
  const [filtrosMov, setFiltrosMov]   = useState({ data_inicio: '', data_fim: '', tipo: '' });
  const [modalMov, setModalMov]       = useState(false);
  const [formMov, setFormMov]         = useState({ ...FORM_MOV_VAZIO });

  const carregarPosicao = useCallback(async () => {
    setLoadingP(true);
    try { setPosicao(await fetchPosicao(buscaPosicao)); } catch (e) { console.error(e); } finally { setLoadingP(false); }
  }, [buscaPosicao]);

  const carregarMovimentos = useCallback(async () => {
    setLoadingM(true);
    try { setMovimentos(await fetchMovimentos(filtrosMov)); } catch (e) { console.error(e); } finally { setLoadingM(false); }
  }, [filtrosMov]);

  useEffect(() => { carregarPosicao(); }, [carregarPosicao]);
  useEffect(() => { carregarMovimentos(); }, [carregarMovimentos]);

  useEffect(() => {
    Promise.all([fetchProdutos(), fetchDepositos()]).then(([p, d]) => {
      setProdutos(p);
      setDepositos(d);
    });
  }, []);

  const abrirModalMov = useCallback(() => {
    setFormMov({ ...FORM_MOV_VAZIO });
    setModalMov(true);
  }, []);

  const salvarMovimento = useCallback(async () => {
    try {
      const payload = {
        ...formMov,
        produto_id:     formMov.produto_id ? parseInt(formMov.produto_id) : null,
        deposito_id:    formMov.deposito_id ? parseInt(formMov.deposito_id) : null,
        quantidade:     parseFloat(formMov.quantidade),
        custo_unitario: formMov.custo_unitario !== '' ? parseFloat(formMov.custo_unitario) : null,
      };
      await registrarMovimento(payload);
      setModalMov(false);
      carregarMovimentos();
      carregarPosicao();
    } catch (e) {
      alert('Erro: ' + e.message);
    }
  }, [formMov, carregarMovimentos, carregarPosicao]);

  return {
    posicao, movimentos, produtos, depositos,
    loadingPosicao, loadingMov,
    buscaPosicao, setBuscaP,
    filtrosMov, setFiltrosMov,
    modalMov, setModalMov,
    formMov, setFormMov,
    abrirModalMov, salvarMovimento,
  };
}
