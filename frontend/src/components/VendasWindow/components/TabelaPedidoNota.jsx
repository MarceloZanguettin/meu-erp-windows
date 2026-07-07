import React, { useCallback, useEffect, useState } from 'react';
import {
  listarPedidosNota,
  criarPedidoNota,
  atualizarPedidoNota,
  deletarPedidoNota,
} from '../services/pedidoNotaService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_pedido: '',
  cod_saida: '',
  cod_empresa_saida: '',
  saida_id: '',
};

/**
 * Gerencia o vínculo entre um pedido de venda já salvo e a(s) nota(s)
 * fiscal(is) de saída geradas a partir dele (GENUS: PEDIDONOTA) — tabela de
 * junção N:N entre PEDIDO (`PedidoVenda`, este pedido) e SAIDA (`Saida`,
 * cabeçalho da nota fiscal de saída/venda). Um mesmo pedido pode gerar
 * várias notas (faturamento parcial) — por isso é uma lista, seguindo o
 * mesmo padrão de lista + formulário usado por `TabelaLogAlteracaoPedido`
 * (GENUS: LOGALTERACAOPEDIDO) neste mesmo modal.
 *
 * `saida_id` (FK para a saída já migrada neste ERP, quando resolvida) é
 * opcional — a resolução de fato de (cod_empresa_saida, cod_saida) contra
 * `Saida.cod_empresa`/`Saida.codigo` é tarefa do agente de migração de
 * dados, não desta janela.
 */
export default function TabelaPedidoNota({ pedidoId }) {
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
      const dados = await listarPedidosNota(pedidoId);
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
        await atualizarPedidoNota(editandoId, form);
      } else {
        await criarPedidoNota({ ...form, pedido_id: pedidoId });
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
    if (!window.confirm('Excluir este vínculo pedido-nota fiscal (GENUS)?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarPedidoNota(id);
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
        Salve o pedido primeiro para consultar as notas fiscais vinculadas (GENUS: PEDIDONOTA).
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Notas Fiscais Vinculadas ao Pedido (GENUS: PEDIDONOTA)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Empresa</th>
            <th>Cód. Pedido (GENUS)</th>
            <th>Cód. Empresa Saída</th>
            <th>Cód. Saída (GENUS)</th>
            <th>Saída (ERP)</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={6} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={6} className="produto-busca-status">Nenhuma nota fiscal (GENUS) vinculada a este pedido.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_empresa ?? '—'}</td>
              <td>{linha.cod_pedido ?? '—'}</td>
              <td>{linha.cod_empresa_saida ?? '—'}</td>
              <td>{linha.cod_saida ?? '—'}</td>
              <td>{linha.saida_id ?? '—'}</td>
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
          {editandoId ? `Editando vínculo #${editandoId}` : 'Novo vínculo (GENUS: PEDIDONOTA)'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação do pedido (GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Pedido (GENUS)</label>
              <input type="number" value={form.cod_pedido} onChange={e => setCampo('cod_pedido', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Nota fiscal de saída vinculada (GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa Saída</label>
              <input type="number" value={form.cod_empresa_saida} onChange={e => setCampo('cod_empresa_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Saída (GENUS)</label>
              <input type="number" value={form.cod_saida} onChange={e => setCampo('cod_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Saída (ID no ERP, se já resolvida)</label>
              <input type="number" value={form.saida_id} onChange={e => setCampo('saida_id', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar vínculo')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}
