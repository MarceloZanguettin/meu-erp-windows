import React, { useCallback, useEffect, useState } from 'react';
import {
  listarFornecedoresBanco,
  criarFornecedorBanco,
  atualizarFornecedorBanco,
  deletarFornecedorBanco,
} from '../services/fornecedorBancoService.js';

const LINHA_VAZIA = {
  banco: '',
  agencia: '',
  conta: '',
  titular: '',
};

/**
 * Gerencia a lista de contas bancárias vinculadas ao fornecedor
 * (GENUS.FORNECEDORBANCO), usadas para pagamento. Um mesmo fornecedor pode
 * ter mais de uma conta cadastrada, por isso é uma lista, e não um campo
 * único do form principal do fornecedor — mesmo padrão já usado em
 * CnaesCliente (ClienteWindow).
 */
export default function BancosFornecedor({ fornecedorId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!fornecedorId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarFornecedoresBanco(fornecedorId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [fornecedorId]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await criarFornecedorBanco({ ...novaLinha, fornecedor_id: fornecedorId });
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
      banco: linha.banco ?? '',
      agencia: linha.agencia ?? '',
      conta: linha.conta ?? '',
      titular: linha.titular ?? '',
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
      await atualizarFornecedorBanco(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir esta conta bancária?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarFornecedorBanco(id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!fornecedorId) {
    return (
      <div className="aba-placeholder">
        Salve o fornecedor primeiro para gerenciar as contas bancárias vinculadas a ele.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Contas bancárias vinculadas (GENUS: FORNECEDORBANCO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Banco</th>
            <th>Agência</th>
            <th>Conta</th>
            <th>Titular</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={5} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={5} className="produto-busca-status">Nenhuma conta bancária vinculada a este fornecedor.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input value={linhaEdicao.banco} maxLength={3} onChange={e => setLinhaEdicao(v => ({ ...v, banco: e.target.value }))} style={{ width: '60px' }} /></td>
                <td><input value={linhaEdicao.agencia} maxLength={5} onChange={e => setLinhaEdicao(v => ({ ...v, agencia: e.target.value }))} style={{ width: '80px' }} /></td>
                <td><input value={linhaEdicao.conta} maxLength={15} onChange={e => setLinhaEdicao(v => ({ ...v, conta: e.target.value }))} style={{ width: '120px' }} /></td>
                <td><input value={linhaEdicao.titular} maxLength={50} onChange={e => setLinhaEdicao(v => ({ ...v, titular: e.target.value }))} style={{ width: '100%' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.banco || '—'}</td>
                <td>{linha.agencia || '—'}</td>
                <td>{linha.conta || '—'}</td>
                <td>{linha.titular || '—'}</td>
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
          <label>Banco</label>
          <input value={novaLinha.banco} maxLength={3} onChange={e => setNovaLinha(v => ({ ...v, banco: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Agência</label>
          <input value={novaLinha.agencia} maxLength={5} onChange={e => setNovaLinha(v => ({ ...v, agencia: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Conta</label>
          <input value={novaLinha.conta} maxLength={15} onChange={e => setNovaLinha(v => ({ ...v, conta: e.target.value }))} />
        </div>
        <div className="form-group form-group-full">
          <label>Titular</label>
          <input value={novaLinha.titular} maxLength={50} onChange={e => setNovaLinha(v => ({ ...v, titular: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
