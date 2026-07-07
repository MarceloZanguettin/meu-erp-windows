import React, { useCallback, useEffect, useState } from 'react';
import {
  listarClientesCnae,
  criarClienteCnae,
  atualizarClienteCnae,
  deletarClienteCnae,
} from '../services/clienteCnaeService.js';

const LINHA_VAZIA = {
  cod_cnae: '',
  descricao: '',
};

/**
 * Gerencia a lista de CNAEs (Classificação Nacional de Atividades
 * Econômicas) vinculados ao cliente (GENUS.CLIENTECNAE). Um mesmo cliente
 * pode exercer mais de uma atividade econômica, por isso é uma lista, e não
 * um campo único do form principal do cliente — mesmo padrão já usado em
 * EmpresasCliente/AtendimentosCliente.
 */
export default function CnaesCliente({ clienteId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!clienteId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarClientesCnae(clienteId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [clienteId]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await criarClienteCnae({ ...novaLinha, cliente_id: clienteId });
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
      cod_cnae: linha.cod_cnae ?? '',
      descricao: linha.descricao ?? '',
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
      await atualizarClienteCnae(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este CNAE?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarClienteCnae(id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!clienteId) {
    return (
      <div className="aba-placeholder">
        Salve o cliente primeiro para gerenciar os CNAEs vinculados a ele.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        CNAEs vinculados (GENUS: CLIENTECNAE)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Código CNAE</th>
            <th>Descrição</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={3} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={3} className="produto-busca-status">Nenhum CNAE vinculado a este cliente.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input value={linhaEdicao.cod_cnae} onChange={e => setLinhaEdicao(v => ({ ...v, cod_cnae: e.target.value }))} style={{ width: '110px' }} /></td>
                <td><input value={linhaEdicao.descricao} onChange={e => setLinhaEdicao(v => ({ ...v, descricao: e.target.value }))} style={{ width: '100%' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.cod_cnae || '—'}</td>
                <td>{linha.descricao || '—'}</td>
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
          <label>Código CNAE</label>
          <input value={novaLinha.cod_cnae} onChange={e => setNovaLinha(v => ({ ...v, cod_cnae: e.target.value }))} />
        </div>
        <div className="form-group form-group-full">
          <label>Descrição</label>
          <input value={novaLinha.descricao} onChange={e => setNovaLinha(v => ({ ...v, descricao: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
