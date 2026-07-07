import React, { useCallback, useEffect, useState } from 'react';
import {
  listarProdutoBarras,
  criarProdutoBarra,
  atualizarProdutoBarra,
  deletarProdutoBarra,
} from '../services/produtoBarraService.js';

const LINHA_VAZIA = {
  codigo_barra: '',
};

/**
 * Gerencia os códigos de barra alternativos (GENUS.PRODUTOBARRA) de um
 * produto. Cada produto pode ter várias linhas em PRODUTOBARRA — um por
 * código de barras alternativo cadastrado — por isso é uma lista, e não um
 * campo único do form.
 */
export default function TabelaProdutoBarras({ produtoId }) {
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
      const dados = await listarProdutoBarras(produtoId);
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
      await criarProdutoBarra({ ...novaLinha, produto_id: produtoId });
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
      codigo_barra: linha.codigo_barra ?? '',
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
      await atualizarProdutoBarra(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este código de barras?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoBarra(id);
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
        Salve o produto primeiro para gerenciar os códigos de barra.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Códigos de Barra (GENUS: PRODUTOBARRA)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Código de Barras</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={2} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={2} className="produto-busca-status">Nenhum código de barras cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="text" maxLength={20} value={linhaEdicao.codigo_barra} onChange={e => setLinhaEdicao(v => ({ ...v, codigo_barra: e.target.value }))} style={{ width: '160px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.codigo_barra ?? '—'}</td>
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
          <label>Código de Barras</label>
          <input type="text" maxLength={20} value={novaLinha.codigo_barra} onChange={e => setNovaLinha(v => ({ ...v, codigo_barra: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
