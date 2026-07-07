import React, { useCallback, useEffect, useState } from 'react';
import {
  listarProdutoReferencias,
  criarProdutoReferencia,
  atualizarProdutoReferencia,
  deletarProdutoReferencia,
} from '../services/produtoReferenciaService.js';

const LINHA_VAZIA = {
  ref_fabrica: '',
  cod_fornecedor: '',
};

/**
 * Gerencia as referências de fabricante/fornecedor (GENUS.PRODUTOREFERENCIA)
 * de um produto. No GENUS, a chave é composta por CODPRODUTO + REFFABRICA +
 * CODFORNECEDOR — cada produto pode ter várias linhas em PRODUTOREFERENCIA
 * (uma por fornecedor/referência de fábrica cadastrado) — por isso é uma
 * lista, e não um campo único do form.
 */
export default function TabelaProdutoReferencias({ produtoId }) {
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
      const dados = await listarProdutoReferencias(produtoId);
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
      await criarProdutoReferencia({ ...novaLinha, produto_id: produtoId });
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
      ref_fabrica: linha.ref_fabrica ?? '',
      cod_fornecedor: linha.cod_fornecedor ?? '',
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
      await atualizarProdutoReferencia(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir esta referência de fornecedor?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoReferencia(id);
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
        Salve o produto primeiro para gerenciar as referências de fornecedor.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Referências de Fornecedor (GENUS: PRODUTOREFERENCIA)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Referência de Fábrica</th>
            <th>Código do Fornecedor</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={3} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={3} className="produto-busca-status">Nenhuma referência de fornecedor cadastrada para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="text" maxLength={20} value={linhaEdicao.ref_fabrica} onChange={e => setLinhaEdicao(v => ({ ...v, ref_fabrica: e.target.value }))} style={{ width: '160px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_fornecedor} onChange={e => setLinhaEdicao(v => ({ ...v, cod_fornecedor: e.target.value }))} style={{ width: '120px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.ref_fabrica ?? '—'}</td>
                <td>{linha.cod_fornecedor ?? '—'}</td>
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
          <label>Referência de Fábrica</label>
          <input type="text" maxLength={20} value={novaLinha.ref_fabrica} onChange={e => setNovaLinha(v => ({ ...v, ref_fabrica: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Código do Fornecedor</label>
          <input type="number" value={novaLinha.cod_fornecedor} onChange={e => setNovaLinha(v => ({ ...v, cod_fornecedor: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
