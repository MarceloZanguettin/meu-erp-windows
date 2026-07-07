import React, { useCallback, useEffect, useState } from 'react';
import {
  listarRegrasProdutoCliente,
  criarRegraProdutoCliente,
  atualizarRegraProdutoCliente,
  deletarRegraProdutoCliente,
} from '../services/regraProdutoClienteService.js';

const LINHA_VAZIA = {
  cod_cliente: '',
  cod_regras: '',
};

/**
 * Gerencia as regras comerciais específicas por cliente (GENUS.REGRASPRODCLI)
 * de um produto. Cada produto pode ter várias linhas em REGRASPRODCLI — uma
 * por cliente com regra própria — por isso é uma lista, e não campos únicos
 * do form.
 */
export default function TabelaRegrasProdutoCliente({ produtoId }) {
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
      const dados = await listarRegrasProdutoCliente(produtoId);
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
      await criarRegraProdutoCliente({ ...novaLinha, produto_id: produtoId });
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
      cod_cliente: linha.cod_cliente ?? '',
      cod_regras: linha.cod_regras ?? '',
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
      await atualizarRegraProdutoCliente(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir esta regra de cliente?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarRegraProdutoCliente(id);
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
        Salve o produto primeiro para gerenciar as regras por cliente.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Regras por Cliente (GENUS: REGRASPRODCLI)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Cliente</th>
            <th>Cód. Regra (GENUS)</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={3} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={3} className="produto-busca-status">Nenhuma regra cadastrada para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="number" value={linhaEdicao.cod_cliente} onChange={e => setLinhaEdicao(v => ({ ...v, cod_cliente: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_regras} onChange={e => setLinhaEdicao(v => ({ ...v, cod_regras: e.target.value }))} style={{ width: '100px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.cod_cliente ?? '—'}</td>
                <td>{linha.cod_regras ?? '—'}</td>
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
          <label>Cód. Cliente</label>
          <input type="number" value={novaLinha.cod_cliente} onChange={e => setNovaLinha(v => ({ ...v, cod_cliente: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Cód. Regra (GENUS)</label>
          <input type="number" value={novaLinha.cod_regras} onChange={e => setNovaLinha(v => ({ ...v, cod_regras: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
