import React, { useCallback, useEffect, useState } from 'react';
import {
  listarMovtoProdutos,
  criarMovtoProduto,
  atualizarMovtoProduto,
  deletarMovtoProduto,
} from '../services/movtoProdutoService.js';

const LINHA_VAZIA = {
  cod_movto: '',
  cod_empresa: '',
  cod_produto: '',
  ent_sai: '',
  qtde: '',
  valor: '',
  total: '',
  perc_comissao: '',
  cal_comissao: '',
  val_comissao: '',
  lote_produto: '',

  cod_empresa_producao: '',
  codigo_producao: '',
  lote_producao: '',
  cod_produto_principal_producao: '',
};

/**
 * Gerencia os movimentos de entrada/saída (GENUS: MOVTOPRODUTO) de um
 * produto. Cada produto pode ter vários lançamentos em MOVTOPRODUTO — um
 * por movimento (entrada ou saída) — por isso é uma lista, e não campos
 * únicos do form principal do produto, seguindo o mesmo padrão de lista +
 * formulário usado pelas demais abas filhas de produto (Produção,
 * Processos, Regras cliente, Código de barras).
 */
export default function TabelaMovtoProduto({ produtoId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!produtoId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarMovtoProdutos(produtoId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [produtoId]);

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
        await atualizarMovtoProduto(editandoId, form);
      } else {
        await criarMovtoProduto({ ...form, produto_id: produtoId });
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
    if (!window.confirm('Excluir este movimento?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarMovtoProduto(id);
      if (editandoId === id) limparForm();
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
        Salve o produto primeiro para gerenciar os movimentos.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Movimentos (GENUS: MOVTOPRODUTO)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>E/S</th>
            <th>Cód. Empresa</th>
            <th>Qtde</th>
            <th>Valor</th>
            <th>Total</th>
            <th>Val. Comissão</th>
            <th>Lote Produto</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={8} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={8} className="produto-busca-status">Nenhum movimento cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.ent_sai ?? '—'}</td>
              <td>{linha.cod_empresa ?? '—'}</td>
              <td>{linha.qtde ?? '—'}</td>
              <td>{linha.valor ?? '—'}</td>
              <td>{linha.total ?? '—'}</td>
              <td>{linha.val_comissao ?? '—'}</td>
              <td>{linha.lote_produto ?? '—'}</td>
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
          {editandoId ? `Editando movimento #${editandoId}` : 'Novo movimento'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Movto (GENUS)</label>
              <input type="number" value={form.cod_movto} onChange={e => setCampo('cod_movto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Entrada/Saída (E/S)</label>
              <input type="text" maxLength={1} value={form.ent_sai} onChange={e => setCampo('ent_sai', e.target.value.toUpperCase())} />
            </div>
            <div className="form-group">
              <label>Lote Produto</label>
              <input type="text" maxLength={15} value={form.lote_produto} onChange={e => setCampo('lote_produto', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Quantidade / Valor</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Qtde.</label>
              <input type="number" step="0.01" value={form.qtde} onChange={e => setCampo('qtde', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor</label>
              <input type="number" step="0.01" value={form.valor} onChange={e => setCampo('valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Total</label>
              <input type="number" step="0.01" value={form.total} onChange={e => setCampo('total', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Comissão</legend>
          <div className="form-row">
            <div className="form-group">
              <label>% Comissão</label>
              <input type="number" step="0.01" value={form.perc_comissao} onChange={e => setCampo('perc_comissao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cálc. Comissão</label>
              <input type="number" step="0.01" value={form.cal_comissao} onChange={e => setCampo('cal_comissao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Val. Comissão</label>
              <input type="number" step="0.01" value={form.val_comissao} onChange={e => setCampo('val_comissao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Produção de origem (quando aplicável)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa Produção</label>
              <input type="number" value={form.cod_empresa_producao} onChange={e => setCampo('cod_empresa_producao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Código Produção</label>
              <input type="number" value={form.codigo_producao} onChange={e => setCampo('codigo_producao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Lote Produção</label>
              <input type="text" maxLength={10} value={form.lote_producao} onChange={e => setCampo('lote_producao', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Produto Principal Produção</label>
              <input type="text" maxLength={15} value={form.cod_produto_principal_producao} onChange={e => setCampo('cod_produto_principal_producao', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar movimento')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}
