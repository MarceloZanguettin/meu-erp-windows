import React, { useCallback, useEffect, useState } from 'react';
import {
  listarProdutoConversoesFornecedor,
  criarProdutoConversaoFornecedor,
  atualizarProdutoConversaoFornecedor,
  deletarProdutoConversaoFornecedor,
} from '../services/produtoConversaoFornecedorService.js';

const LINHA_VAZIA = {
  cod_fornecedor: '',
  fator_conversao: '',
  tipo_conversao: '',
};

/**
 * Gerencia os fatores de conversão por fornecedor (GENUS.PRODUTOCONVERSAOFORNECEDOR)
 * de um produto. No GENUS, a chave é composta por CODPRODUTO + CODFORNECEDOR —
 * cada produto pode ter várias linhas em PRODUTOCONVERSAOFORNECEDOR (uma por
 * fornecedor com fator de conversão próprio entre a unidade de compra dele e
 * a unidade padrão do produto) — por isso é uma lista, e não um campo único
 * do form (diferente de Produto.fator_conversao/tipo_conversao, que guardam
 * o fator "padrão" único do produto).
 */
export default function TabelaProdutoConversaoFornecedor({ produtoId }) {
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
      const dados = await listarProdutoConversoesFornecedor(produtoId);
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
      await criarProdutoConversaoFornecedor({ ...novaLinha, produto_id: produtoId });
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
      cod_fornecedor: linha.cod_fornecedor ?? '',
      fator_conversao: linha.fator_conversao ?? '',
      tipo_conversao: linha.tipo_conversao ?? '',
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
      await atualizarProdutoConversaoFornecedor(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir esta conversão de fornecedor?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoConversaoFornecedor(id);
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
        Salve o produto primeiro para gerenciar as conversões por fornecedor.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Conversão por Fornecedor (GENUS: PRODUTOCONVERSAOFORNECEDOR)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Código do Fornecedor</th>
            <th>Fator de Conversão</th>
            <th>Tipo</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={4} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={4} className="produto-busca-status">Nenhuma conversão de fornecedor cadastrada para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="number" value={linhaEdicao.cod_fornecedor} onChange={e => setLinhaEdicao(v => ({ ...v, cod_fornecedor: e.target.value }))} style={{ width: '120px' }} /></td>
                <td><input type="number" step="0.001" value={linhaEdicao.fator_conversao} onChange={e => setLinhaEdicao(v => ({ ...v, fator_conversao: e.target.value }))} style={{ width: '120px' }} /></td>
                <td><input type="text" maxLength={1} value={linhaEdicao.tipo_conversao} onChange={e => setLinhaEdicao(v => ({ ...v, tipo_conversao: e.target.value.toUpperCase() }))} style={{ width: '50px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.cod_fornecedor ?? '—'}</td>
                <td>{linha.fator_conversao ?? '—'}</td>
                <td>{linha.tipo_conversao ?? '—'}</td>
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
          <label>Código do Fornecedor</label>
          <input type="number" value={novaLinha.cod_fornecedor} onChange={e => setNovaLinha(v => ({ ...v, cod_fornecedor: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Fator de Conversão</label>
          <input type="number" step="0.001" value={novaLinha.fator_conversao} onChange={e => setNovaLinha(v => ({ ...v, fator_conversao: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <input type="text" maxLength={1} value={novaLinha.tipo_conversao} onChange={e => setNovaLinha(v => ({ ...v, tipo_conversao: e.target.value.toUpperCase() }))} style={{ width: '50px' }} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
