import React, { useCallback, useEffect, useState } from 'react';
import {
  listarPrecosProduto,
  criarPrecoProduto,
  atualizarPrecoProduto,
  deletarPrecoProduto,
} from '../services/precoProdutoService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_tabela_preco: '',
  valor: '',
  percentual: '',
};

const fmtMoeda = (v) => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Gerencia a lista de preços por empresa/tabela de preço (GENUS.PRECO) de um produto.
 * Cada produto pode ter várias linhas em PRECO — uma por combinação de
 * empresa + tabela de preço — por isso é uma lista, e não campos únicos do form.
 */
export default function TabelaPrecosProduto({ produtoId }) {
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
      const dados = await listarPrecosProduto(produtoId);
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
      await criarPrecoProduto({ ...novaLinha, produto_id: produtoId });
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
      cod_empresa: linha.cod_empresa ?? '',
      cod_tabela_preco: linha.cod_tabela_preco ?? '',
      valor: linha.valor ?? '',
      percentual: linha.percentual ?? '',
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
      await atualizarPrecoProduto(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este preço de tabela?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarPrecoProduto(id);
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
        Salve o produto primeiro para gerenciar preços por empresa/tabela de preço.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Preços por Empresa / Tabela de Preço (GENUS: PRECO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Empresa</th>
            <th>Cód. Tabela Preço</th>
            <th>Valor (R$)</th>
            <th>Percentual (%)</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={5} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={5} className="produto-busca-status">Nenhum preço de tabela cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="number" value={linhaEdicao.cod_empresa} onChange={e => setLinhaEdicao(v => ({ ...v, cod_empresa: e.target.value }))} style={{ width: '90px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_tabela_preco} onChange={e => setLinhaEdicao(v => ({ ...v, cod_tabela_preco: e.target.value }))} style={{ width: '110px' }} /></td>
                <td><input type="number" step="0.01" value={linhaEdicao.valor} onChange={e => setLinhaEdicao(v => ({ ...v, valor: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="number" step="0.01" value={linhaEdicao.percentual} onChange={e => setLinhaEdicao(v => ({ ...v, percentual: e.target.value }))} style={{ width: '100px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.cod_empresa ?? '—'}</td>
                <td>{linha.cod_tabela_preco ?? '—'}</td>
                <td>{fmtMoeda(linha.valor)}</td>
                <td>{linha.percentual ?? 0}%</td>
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
          <label>Cód. Empresa</label>
          <input type="number" value={novaLinha.cod_empresa} onChange={e => setNovaLinha(v => ({ ...v, cod_empresa: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Cód. Tabela Preço</label>
          <input type="number" value={novaLinha.cod_tabela_preco} onChange={e => setNovaLinha(v => ({ ...v, cod_tabela_preco: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Valor (R$)</label>
          <input type="number" step="0.01" value={novaLinha.valor} onChange={e => setNovaLinha(v => ({ ...v, valor: e.target.value }))} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label>Percentual (%)</label>
          <input type="number" step="0.01" value={novaLinha.percentual} onChange={e => setNovaLinha(v => ({ ...v, percentual: e.target.value }))} placeholder="0.00" />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
