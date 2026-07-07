import React, { useCallback, useEffect, useState } from 'react';
import {
  listarSaidasDevolucao,
  criarSaidaDevolucao,
  atualizarSaidaDevolucao,
  deletarSaidaDevolucao,
} from '../services/saidaDevolucaoService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  cod_saida: '',
  codigo: '',
  saida_cod_empresa: '',
  saida_codigo: '',
  entrada_cod_empresa: '',
  entrada_tipo_doc: '',
  entrada_doc: '',
  entrada_serie: '',
  entrada_cod_fornecedor: '',
  ref_chave: '',
  saida_id: '',
};

/**
 * Gerencia as devoluções de mercadoria vinculadas a uma saída já salva
 * (GENUS: SAIDADEVOLUCAO) — tabela "filha"/detalhe de `Saida`, 1:N: uma
 * mesma saída pode ter várias devoluções ao longo do tempo, cada uma com seu
 * próprio documento de entrada/fornecedor. Segue o mesmo padrão de lista +
 * formulário usado por `TabelaPedidoNota` (GENUS: PEDIDONOTA) neste mesmo
 * módulo de Vendas/Faturamento.
 *
 * `saida_id` (FK para a saída já migrada neste ERP, quando resolvida) é
 * opcional — a resolução de fato de (saida_cod_empresa, saida_codigo) contra
 * `Saida.cod_empresa`/`Saida.codigo` é tarefa do agente de migração de
 * dados, não desta janela.
 */
export default function TabelaSaidaDevolucao({ saidaId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!saidaId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarSaidasDevolucao(saidaId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [saidaId]);

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
        await atualizarSaidaDevolucao(editandoId, form);
      } else {
        await criarSaidaDevolucao({ ...form, saida_id: saidaId });
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
    if (!window.confirm('Excluir esta devolução de saída (GENUS)?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarSaidaDevolucao(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!saidaId) {
    return (
      <div className="aba-placeholder">
        Salve a saída primeiro para consultar as devoluções vinculadas (GENUS: SAIDADEVOLUCAO).
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Devoluções Vinculadas à Saída (GENUS: SAIDADEVOLUCAO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Saída (própria)</th>
            <th>Saída Cód./Empresa (ref.)</th>
            <th>Entrada Doc/Série</th>
            <th>Entrada Fornecedor</th>
            <th>Ref. Chave</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={6} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={6} className="produto-busca-status">Nenhuma devolução (GENUS) vinculada a esta saída.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_empresa ?? '—'}/{linha.cod_saida ?? '—'}/{linha.codigo ?? '—'}</td>
              <td>{linha.saida_cod_empresa ?? '—'}/{linha.saida_codigo ?? '—'}</td>
              <td>{linha.entrada_doc ?? '—'} / {linha.entrada_serie ?? '—'}</td>
              <td>{linha.entrada_cod_fornecedor ?? '—'}</td>
              <td>{linha.ref_chave ?? '—'}</td>
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
          {editandoId ? `Editando devolução #${editandoId}` : 'Nova devolução (GENUS: SAIDADEVOLUCAO)'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Chave própria da devolução (GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Saída (GENUS)</label>
              <input type="number" value={form.cod_saida} onChange={e => setCampo('cod_saida', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Código</label>
              <input type="number" value={form.codigo} onChange={e => setCampo('codigo', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Saída original vinculada (GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Saída Cód. Empresa</label>
              <input type="number" value={form.saida_cod_empresa} onChange={e => setCampo('saida_cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Saída Código (GENUS)</label>
              <input type="number" value={form.saida_codigo} onChange={e => setCampo('saida_codigo', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Documento de entrada vinculado (GENUS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Entrada Cód. Empresa</label>
              <input type="number" value={form.entrada_cod_empresa} onChange={e => setCampo('entrada_cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Entrada Tipo Doc.</label>
              <input type="text" maxLength={1} value={form.entrada_tipo_doc} onChange={e => setCampo('entrada_tipo_doc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Entrada Doc.</label>
              <input type="number" value={form.entrada_doc} onChange={e => setCampo('entrada_doc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Entrada Série</label>
              <input type="text" maxLength={4} value={form.entrada_serie} onChange={e => setCampo('entrada_serie', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Entrada Cód. Fornecedor</label>
              <input type="number" value={form.entrada_cod_fornecedor} onChange={e => setCampo('entrada_cod_fornecedor', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Referência</legend>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Ref. Chave (ex.: chave NF-e)</label>
              <input type="text" maxLength={70} value={form.ref_chave} onChange={e => setCampo('ref_chave', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar devolução')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}
