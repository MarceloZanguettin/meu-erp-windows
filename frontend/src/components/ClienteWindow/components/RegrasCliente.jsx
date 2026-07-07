import React, { useCallback, useEffect, useState } from 'react';
import {
  listarRegrasCliente,
  criarRegraCliente,
  atualizarRegraCliente,
  deletarRegraCliente,
} from '../services/regraClienteService.js';

const LINHA_VAZIA = {
  codigo: '',
  cod_produto: '',
  cod_cliente: '',
  cod_classificacao: '',
  produto_id: '',
};

/**
 * Gerencia as regras de classificação fiscal específicas por cliente
 * (GENUS.REGRASCLIENTE) — define, por cliente, qual classificação fiscal
 * (GENUS.CLASSIFICACAO/NCM) deve ser aplicada a um produto específico
 * vendido para aquele cliente.
 *
 * Diferente de EmpresasCliente (GENUS.CLIENTEEMPRESA), REGRASCLIENTE não
 * tem FK própria contra o cliente aberto nesta janela: o GENUS guarda ali
 * apenas o código bruto CODCLIENTE (chave interna da tabela CLIENTE), e o
 * cadastro de cliente deste ERP (`ClienteCompleto`) ainda não guarda esse
 * mesmo código bruto para permitir a resolução automática — por isso a
 * lista abaixo é filtrável pelo código GENUS do cliente (campo de busca),
 * em vez de ficar automaticamente restrita ao cliente sendo editado.
 */
export default function RegrasCliente() {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [novaLinha, setNovaLinha] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [linhaEdicao, setLinhaEdicao] = useState(LINHA_VAZIA);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarRegrasCliente({ codCliente: filtroCliente || undefined });
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [filtroCliente]);

  useEffect(() => { carregar(); }, [carregar]);

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      await criarRegraCliente(novaLinha);
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
      codigo: linha.codigo ?? '',
      cod_produto: linha.cod_produto ?? '',
      cod_cliente: linha.cod_cliente ?? '',
      cod_classificacao: linha.cod_classificacao ?? '',
      produto_id: linha.produto_id ?? '',
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
      await atualizarRegraCliente(id, linhaEdicao);
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
      await deletarRegraCliente(id);
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Regras de Classificação Fiscal por Cliente (GENUS: REGRASCLIENTE)
      </legend>

      <div className="form-row" style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        <div className="form-group">
          <label>Filtrar por Cód. Cliente (GENUS)</label>
          <input
            type="number"
            value={filtroCliente}
            onChange={e => setFiltroCliente(e.target.value)}
            placeholder="Todos"
          />
        </div>
      </div>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Código (GENUS)</th>
            <th>Cód. Produto</th>
            <th>Cód. Cliente</th>
            <th>Cód. Classificação</th>
            <th style={{ width: 120 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={5} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={5} className="produto-busca-status">Nenhuma regra de cliente cadastrada.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            editandoId === linha.id ? (
              <tr key={linha.id}>
                <td><input type="number" value={linhaEdicao.codigo} onChange={e => setLinhaEdicao(v => ({ ...v, codigo: e.target.value }))} style={{ width: '90px' }} /></td>
                <td><input type="text" value={linhaEdicao.cod_produto} onChange={e => setLinhaEdicao(v => ({ ...v, cod_produto: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_cliente} onChange={e => setLinhaEdicao(v => ({ ...v, cod_cliente: e.target.value }))} style={{ width: '100px' }} /></td>
                <td><input type="number" value={linhaEdicao.cod_classificacao} onChange={e => setLinhaEdicao(v => ({ ...v, cod_classificacao: e.target.value }))} style={{ width: '100px' }} /></td>
                <td>
                  <button type="button" className="btn-save" disabled={salvando} onClick={() => salvarEdicao(linha.id)}>Salvar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={cancelarEdicao}>Cancelar</button>
                </td>
              </tr>
            ) : (
              <tr key={linha.id}>
                <td>{linha.codigo ?? '—'}</td>
                <td>{linha.cod_produto ?? '—'}</td>
                <td>{linha.cod_cliente ?? '—'}</td>
                <td>{linha.cod_classificacao ?? '—'}</td>
                <td>
                  <button type="button" className="btn-search" disabled={salvando} onClick={() => iniciarEdicao(linha)}>Editar</button>
                  <button type="button" className="btn-cancel" disabled={salvando} onClick={() => excluir(linha.id)}>Excluir</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      <div className="form-row" style={{ marginTop: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="form-group">
          <label>Código (GENUS)</label>
          <input type="number" value={novaLinha.codigo} onChange={e => setNovaLinha(v => ({ ...v, codigo: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Cód. Produto</label>
          <input type="text" value={novaLinha.cod_produto} onChange={e => setNovaLinha(v => ({ ...v, cod_produto: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Cód. Cliente</label>
          <input type="number" value={novaLinha.cod_cliente} onChange={e => setNovaLinha(v => ({ ...v, cod_cliente: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Cód. Classificação</label>
          <input type="number" value={novaLinha.cod_classificacao} onChange={e => setNovaLinha(v => ({ ...v, cod_classificacao: e.target.value }))} />
        </div>
        <div className="form-group">
          <button type="button" className="btn-save" disabled={salvando} onClick={handleAdicionar}>+ Adicionar</button>
        </div>
      </div>
    </fieldset>
  );
}
