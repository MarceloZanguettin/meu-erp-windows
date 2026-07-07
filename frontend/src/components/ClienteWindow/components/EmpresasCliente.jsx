import React, { useCallback, useEffect, useState } from 'react';
import {
  listarClientesEmpresa,
  criarClienteEmpresa,
  atualizarClienteEmpresa,
  deletarClienteEmpresa,
} from '../services/clienteEmpresaService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_cadastro: '',
};

/**
 * Gerencia a lista de empresas/filiais em que o cliente está cadastrado
 * (GENUS.CLIENTEEMPRESA — recurso multi-filial). Um mesmo cliente pode
 * estar vinculado a várias empresas, por isso é uma lista, e não um campo
 * único do form principal do cliente.
 */
export default function EmpresasCliente({ clienteId }) {
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
      const dados = await listarClientesEmpresa(clienteId);
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
      await criarClienteEmpresa({ ...novaLinha, cliente_id: clienteId });
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
      cod_cadastro: linha.cod_cadastro ?? '',
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
      await atualizarClienteEmpresa(id, linhaEdicao);
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este vínculo de empresa/filial?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarClienteEmpresa(id);
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
        Salve o cliente primeiro para gerenciar as empresas/filiais em que ele está cadastrado.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Empresas / Filiais vinculadas (GENUS: CLIENTEEMPRESA)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Empresa</th>
            <th>Cód. Cadastro (GENUS)</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={3} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={3} className="produto-busca-status">Nenhuma empresa/filial vinculada a este cliente.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="number" value={linhaEdicao.cod_empresa} onChange={e => setLinhaEdicao(v => ({ ...v, cod_empresa: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_cadastro} onChange={e => setLinhaEdicao(v => ({ ...v, cod_cadastro: e.target.value }))} style={{ width: '120px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.cod_empresa ?? '—'}</td>
                <td>{linha.cod_cadastro ?? '—'}</td>
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
          <label>Cód. Cadastro (GENUS)</label>
          <input type="number" value={novaLinha.cod_cadastro} onChange={e => setNovaLinha(v => ({ ...v, cod_cadastro: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
