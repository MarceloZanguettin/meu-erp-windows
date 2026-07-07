import React, { useCallback, useEffect, useState } from 'react';
import {
  listarProdutoProcessos,
  criarProdutoProcesso,
  atualizarProdutoProcesso,
  deletarProdutoProcesso,
} from '../services/produtoProcessoService.js';

const LINHA_VAZIA = {
  cod_processo: '',
  tempo_padrao: '',
  valor: '',
  ordem: '',
  observacao: '',
};

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Gerencia o roteiro de processos produtivos (GENUS.PRODUTOPROCESSO) de um
 * produto. Cada produto pode ter várias linhas em PRODUTOPROCESSO — uma por
 * etapa/processo do seu roteiro de produção — por isso é uma lista, e não
 * campos únicos do form.
 */
export default function TabelaProcessosProduto({ produtoId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!produtoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarProdutoProcessos(produtoId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await criarProdutoProcesso({ ...novaLinha, produto_id: produtoId });
      setNovaLinha(LINHA_VAZIA);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const iniciarEdicao = (linha) => {
    setEditandoId(linha.id);
    setLinhaEdicao({
      cod_processo: linha.cod_processo ?? '',
      tempo_padrao: linha.tempo_padrao ?? '',
      valor: linha.valor ?? '',
      ordem: linha.ordem ?? '',
      observacao: linha.observacao ?? '',
    });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setLinhaEdicao(LINHA_VAZIA);
  };

  const salvarEdicao = async (id) => {
    setSalvando(true);
    setErro(null);
    try {
      await atualizarProdutoProcesso(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este processo?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoProcesso(id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!produtoId) {
    return (
      <div className="aba-placeholder">
        Salve o produto primeiro para gerenciar os processos do roteiro de produção.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Processos de Produção (GENUS: PRODUTOPROCESSO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Ordem</th>
            <th>Cód. Processo</th>
            <th>Tempo Padrão</th>
            <th>Valor (R$)</th>
            <th>Observação</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={6} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={6} className="produto-busca-status">Nenhum processo cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="number" value={linhaEdicao.ordem} onChange={e => setLinhaEdicao(v => ({ ...v, ordem: e.target.value }))} style={{ width: '70px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_processo} onChange={e => setLinhaEdicao(v => ({ ...v, cod_processo: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="text" maxLength={6} value={linhaEdicao.tempo_padrao} onChange={e => setLinhaEdicao(v => ({ ...v, tempo_padrao: e.target.value }))} style={{ width: '80px' }} placeholder="hh:mm" /></td>
                <td><input type="number" step="0.01" value={linhaEdicao.valor} onChange={e => setLinhaEdicao(v => ({ ...v, valor: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="text" value={linhaEdicao.observacao} onChange={e => setLinhaEdicao(v => ({ ...v, observacao: e.target.value }))} style={{ width: '160px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.ordem ?? '—'}</td>
                <td>{linha.cod_processo ?? '—'}</td>
                <td>{linha.tempo_padrao ?? '—'}</td>
                <td>{fmtMoeda(linha.valor)}</td>
                <td>{linha.observacao ?? '—'}</td>
                <td>
                  <button type="button" className="btn-search" disabled={salvando} onClick={() => iniciarEdicao(linha)}>Editar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={() => excluir(linha.id)}>Excluir</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      <div className="form-row" style={{ marginTop: '12px', alignItems: 'flex-end' }}>
        <div className="form-group">
          <label>Ordem</label>
          <input type="number" value={novaLinha.ordem} onChange={e => setNovaLinha(v => ({ ...v, ordem: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Cód. Processo</label>
          <input type="number" value={novaLinha.cod_processo} onChange={e => setNovaLinha(v => ({ ...v, cod_processo: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Tempo Padrão</label>
          <input type="text" maxLength={6} value={novaLinha.tempo_padrao} onChange={e => setNovaLinha(v => ({ ...v, tempo_padrao: e.target.value }))} placeholder="hh:mm" />
        </div>
        <div className="form-group">
          <label>Valor (R$)</label>
          <input type="number" step="0.01" value={novaLinha.valor} onChange={e => setNovaLinha(v => ({ ...v, valor: e.target.value }))} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Observação</label>
          <input type="text" value={novaLinha.observacao} onChange={e => setNovaLinha(v => ({ ...v, observacao: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
