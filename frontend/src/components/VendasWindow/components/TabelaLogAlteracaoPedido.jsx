import React, { useCallback, useEffect, useState } from 'react';
import {
  listarLogsAlteracaoPedido,
  criarLogAlteracaoPedido,
  atualizarLogAlteracaoPedido,
  deletarLogAlteracaoPedido,
} from '../services/logAlteracaoPedidoService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_pedido: '',
  status_novo: '',
  cod_funcionario_logado: '',
  data_alteracao: '',
  hora_alteracao: '',
  origem_alteracao: '',
};

/**
 * Gerencia o log de alterações de status de um pedido de venda já salvo
 * (GENUS: LOGALTERACAOPEDIDO) — histórico de auditoria de mudanças de
 * status daquele pedido no sistema legado (novo status, funcionário logado
 * que fez a alteração, data/hora e a origem/tela de onde partiu a
 * alteração). Cada pedido pode ter muitas linhas em LOGALTERACAOPEDIDO (uma
 * por alteração de status registrada) — por isso é uma lista, e não campos
 * únicos do formulário principal do pedido, seguindo o mesmo padrão de
 * lista + formulário usado por `TabelaItemPedidoLan` (GENUS: PEDIDOLAN)
 * neste mesmo modal.
 */
export default function TabelaLogAlteracaoPedido({ pedidoId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!pedidoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarLogsAlteracaoPedido(pedidoId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [pedidoId]);

  useEffect(() => { carregar(); }, [carregar]);

  const setCampo = (campo, valor) => setForm(v => ({ ...v, [campo]: valor }));

  const limparForm = () => {
    setForm(LINHA_VAZIA);
    setEditandoId(null);
  };

  const iniciarEdicao = (linha) => {
    setEditandoId(linha.id);
    setForm({ ...LINHA_VAZIA, ...linha });
  };

  const salvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro(null);
    try {
      if (editandoId) {
        await atualizarLogAlteracaoPedido(editandoId, form);
      } else {
        await criarLogAlteracaoPedido({ ...form, pedido_id: pedidoId });
      }
      limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id) => {
    if (!window.confirm('Excluir este log de alteração de pedido (GENUS)?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarLogAlteracaoPedido(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!pedidoId) {
    return (
      <div className="aba-placeholder">
        Salve o pedido primeiro para consultar o log de alterações (GENUS: LOGALTERACAOPEDIDO).
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Log de Alterações do Pedido (GENUS: LOGALTERACAOPEDIDO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Status Novo</th>
            <th>Funcionário Logado</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Origem</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={6} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={6} className="produto-busca-status">Nenhum log (GENUS) registrado para este pedido.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.status_novo ?? '—'}</td>
              <td>{linha.cod_funcionario_logado ?? '—'}</td>
              <td>{linha.data_alteracao ?? '—'}</td>
              <td>{linha.hora_alteracao ?? '—'}</td>
              <td>{linha.origem_alteracao ?? '—'}</td>
              <td>
                <button type="button" className="btn-search" disabled={salvando} onClick={() => iniciarEdicao(linha)}>Editar</button>
                <button type="button" className="btn-cancel" disabled={salvando} onClick={() => excluir(linha.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={salvar} style={{ marginTop: 16 }}>
        <h4 style={{ margin: '8px 0' }}>
          {editandoId ? `Editando log #${editandoId}` : 'Novo log (GENUS: LOGALTERACAOPEDIDO)'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Pedido (GENUS)</label>
              <input type="number" value={form.cod_pedido} onChange={e => setCampo('cod_pedido', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Funcionário Logado</label>
              <input type="number" value={form.cod_funcionario_logado} onChange={e => setCampo('cod_funcionario_logado', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Alteração</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Status Novo</label>
              <input type="text" maxLength={100} value={form.status_novo} onChange={e => setCampo('status_novo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Alteração</label>
              <input type="text" maxLength={12} placeholder="DD/MM/AAAA" value={form.data_alteracao} onChange={e => setCampo('data_alteracao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Hora Alteração</label>
              <input type="text" maxLength={12} placeholder="HH:MM:SS" value={form.hora_alteracao} onChange={e => setCampo('hora_alteracao', e.target.value)} />
            </div>
            <div className="form-group form-group-full">
              <label>Origem da Alteração</label>
              <input type="text" maxLength={200} value={form.origem_alteracao} onChange={e => setCampo('origem_alteracao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar log')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}
