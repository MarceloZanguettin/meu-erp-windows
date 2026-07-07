import React, { useCallback, useEffect, useState } from 'react';
import ModalBuscaProduto from './ModalBuscaProduto.jsx';
import {
  listarProdutoComposicoes,
  criarProdutoComposicao,
  atualizarProdutoComposicao,
  deletarProdutoComposicao,
} from '../services/produtoComposicaoService.js';

const LINHA_VAZIA = {
  produto_materia_id: '',
  materia_label: '',
  cod_processo: '',
  sequencia: '',
  qtde: '',
  qtde_equivalente: '',
  perda: '',
};

/**
 * Gerencia a composição/estrutura (BOM — bill of materials) de um produto
 * (GENUS.PRODUTOCOMPOSICAO). Cada linha vincula o produto atual (produto
 * "pai"/acabado, já identificado por `produtoId`) a um produto "componente"
 * (matéria-prima, escolhido em `ModalBuscaProduto` dentre os produtos já
 * cadastrados neste ERP) com a quantidade, quantidade equivalente e perda
 * daquele componente na composição — por isso é uma lista, e não campos
 * únicos do form.
 */
export default function TabelaComposicaoProduto({ produtoId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);
  const [buscaAlvo, setBuscaAlvo] = useState(null); // 'nova' | 'edicao' | null

  const carregar = useCallback(async () => {
    if (!produtoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarProdutoComposicoes(produtoId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

  useEffect(() => { carregar(); }, [carregar]);

  const rotuloMateria = (linha) => {
    if (linha.materia_label) return linha.materia_label;
    if (linha.cod_materia) return linha.cod_materia;
    if (linha.produto_materia_id) return `Produto #${linha.produto_materia_id}`;
    return '—';
  };

  const handleSelecionarMateria = (produto) => {
    const dadosMateria = { produto_materia_id: produto.id, materia_label: `${produto.codigo || ''} - ${produto.nome}`.trim() };
    if (buscaAlvo === 'nova') {
      setNovaLinha(v => ({ ...v, ...dadosMateria }));
    } else if (buscaAlvo === 'edicao') {
      setLinhaEdicao(v => ({ ...v, ...dadosMateria }));
    }
    setBuscaAlvo(null);
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      const { materia_label: _materia_label, ...dados } = novaLinha;
      await criarProdutoComposicao({ ...dados, produto_id: produtoId });
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
      produto_materia_id: linha.produto_materia_id ?? '',
      materia_label: rotuloMateria(linha),
      cod_processo: linha.cod_processo ?? '',
      sequencia: linha.sequencia ?? '',
      qtde: linha.qtde ?? '',
      qtde_equivalente: linha.qtde_equivalente ?? '',
      perda: linha.perda ?? '',
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
      const { materia_label: _materia_label, ...dados } = linhaEdicao;
      await atualizarProdutoComposicao(id, dados);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este item da composição?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarProdutoComposicao(id);
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
        Salve o produto primeiro para gerenciar a composição (BOM) deste produto.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Composição / Estrutura do Produto (GENUS: PRODUTOCOMPOSICAO)
      </legend>

      {buscaAlvo && (
        <ModalBuscaProduto
          onSelecionar={handleSelecionarMateria}
          onFechar={() => setBuscaAlvo(null)}
        />
      )}

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Seq.</th>
            <th>Matéria-prima (componente)</th>
            <th>Cód. Processo</th>
            <th>Qtde.</th>
            <th>Qtde. Equivalente</th>
            <th>Perda</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={7} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={7} className="produto-busca-status">Nenhum item de composição cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="number" value={linhaEdicao.sequencia} onChange={e => setLinhaEdicao(v => ({ ...v, sequencia: e.target.value }))} style={{ width: '60px' }} /></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{linhaEdicao.materia_label || '—'}</span>
                    <button type="button" className="btn-search" onClick={() => setBuscaAlvo('edicao')}>🔍</button>
                  </div>
                </td>
                <td><input type="number" value={linhaEdicao.cod_processo} onChange={e => setLinhaEdicao(v => ({ ...v, cod_processo: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="number" step="0.000001" value={linhaEdicao.qtde} onChange={e => setLinhaEdicao(v => ({ ...v, qtde: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="number" step="0.000001" value={linhaEdicao.qtde_equivalente} onChange={e => setLinhaEdicao(v => ({ ...v, qtde_equivalente: e.target.value }))} style={{ width: '110px' }} /></td>
                <td><input type="number" step="0.00001" value={linhaEdicao.perda} onChange={e => setLinhaEdicao(v => ({ ...v, perda: e.target.value }))} style={{ width: '90px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.sequencia ?? '—'}</td>
                <td>{rotuloMateria(linha)}</td>
                <td>{linha.cod_processo ?? '—'}</td>
                <td>{linha.qtde ?? '—'}</td>
                <td>{linha.qtde_equivalente ?? '—'}</td>
                <td>{linha.perda ?? '—'}</td>
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
          <label>Seq.</label>
          <input type="number" value={novaLinha.sequencia} onChange={e => setNovaLinha(v => ({ ...v, sequencia: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Matéria-prima (componente)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{novaLinha.materia_label || 'Nenhum selecionado'}</span>
            <button type="button" className="btn-search" onClick={() => setBuscaAlvo('nova')}>🔍 Selecionar</button>
          </div>
        </div>
        <div className="form-group">
          <label>Cód. Processo</label>
          <input type="number" value={novaLinha.cod_processo} onChange={e => setNovaLinha(v => ({ ...v, cod_processo: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Qtde.</label>
          <input type="number" step="0.000001" value={novaLinha.qtde} onChange={e => setNovaLinha(v => ({ ...v, qtde: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Qtde. Equivalente</label>
          <input type="number" step="0.000001" value={novaLinha.qtde_equivalente} onChange={e => setNovaLinha(v => ({ ...v, qtde_equivalente: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Perda</label>
          <input type="number" step="0.00001" value={novaLinha.perda} onChange={e => setNovaLinha(v => ({ ...v, perda: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando || !novaLinha.produto_materia_id} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
