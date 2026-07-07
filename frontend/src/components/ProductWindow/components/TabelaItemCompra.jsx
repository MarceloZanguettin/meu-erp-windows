import React, { useCallback, useEffect, useState } from 'react';
import {
  listarItensCompra,
  criarItemCompra,
  atualizarItemCompra,
  deletarItemCompra,
} from '../services/itemCompraService.js';

const LINHA_VAZIA = {
  cod_compras: '',
  cod_empresa: '',
  cod_produto: '',
  lote_produto: '',
  qtde: '',
  unitario: '',
  total: '',
  desconto: '',
  custo_real: '',
  outros_valores: '',
  taxa_fornecedor: '',
  cpr: '',
  kgmt: '',
  kgmt_total: '',
  unde: '',
  ipi: '',
  ipi_valor: '',
  st: '',
  obs: '',
};

/**
 * Gerencia os itens de compra (GENUS: COMPRASLAN) de um produto — linhas de
 * solicitação/pedido de compra em que este produto foi solicitado/comprado.
 * Cada produto pode ter muitas linhas em COMPRASLAN (uma por compra em que
 * aparece) — por isso é uma lista, e não campos únicos do form principal do
 * produto, seguindo o mesmo padrão de lista + formulário já usado para Itens
 * de Entrada/Itens de Saída (e demais abas filhas de produto).
 *
 * COMPRASLAN é a tabela "filha" de COMPRAS (cabeçalho da solicitação/pedido
 * de compra), que ainda não tem model/janela próprios neste ERP — por isso o
 * campo "Cód. Compras" abaixo é mantido bruto, sem combo/vínculo de fato com
 * um cabeçalho de "Compra" (isso será resolvido quando esse cabeçalho ganhar
 * seu próprio model, análogo ao que já existe para Entrada/ItemEntrada no
 * mesmo módulo Compras).
 */
export default function TabelaItemCompra({ produtoId }) {
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
      const dados = await listarItensCompra(produtoId);
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
        await atualizarItemCompra(editandoId, form);
      } else {
        await criarItemCompra({ ...form, produto_id: produtoId });
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
    if (!window.confirm('Excluir este item de compra?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarItemCompra(id);
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
        Salve o produto primeiro para gerenciar os itens de compra.
      </div>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '15px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Itens de Compra (GENUS: COMPRASLAN)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Cód. Compras</th>
            <th>Lote</th>
            <th>Qtde</th>
            <th>Unitário</th>
            <th>Total</th>
            <th>Desconto</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={7} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={7} className="produto-busca-status">Nenhum item de compra cadastrado para este produto.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.cod_compras ?? '—'}</td>
              <td>{linha.lote_produto ?? '—'}</td>
              <td>{linha.qtde ?? '—'}</td>
              <td>{linha.unitario ?? '—'}</td>
              <td>{linha.total ?? '—'}</td>
              <td>{linha.desconto ?? '—'}</td>
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
          {editandoId ? `Editando item #${editandoId}` : 'Novo item de compra'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Identificação / Documento de Compra</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Compras (GENUS)</label>
              <input type="number" value={form.cod_compras} onChange={e => setCampo('cod_compras', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Produto (GENUS)</label>
              <input type="text" maxLength={15} value={form.cod_produto} onChange={e => setCampo('cod_produto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Lote Produto</label>
              <input type="text" maxLength={15} value={form.lote_produto} onChange={e => setCampo('lote_produto', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Quantidades / Valores comerciais</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Qtde.</label>
              <input type="number" step="0.01" value={form.qtde} onChange={e => setCampo('qtde', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor Unitário</label>
              <input type="number" step="0.01" value={form.unitario} onChange={e => setCampo('unitario', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Total</label>
              <input type="number" step="0.01" value={form.total} onChange={e => setCampo('total', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Desconto</label>
              <input type="number" step="0.01" value={form.desconto} onChange={e => setCampo('desconto', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Custo Real</label>
              <input type="number" step="0.01" value={form.custo_real} onChange={e => setCampo('custo_real', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Outros Valores</label>
              <input type="number" step="0.01" value={form.outros_valores} onChange={e => setCampo('outros_valores', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Taxa Fornecedor</label>
              <input type="number" step="0.01" value={form.taxa_fornecedor} onChange={e => setCampo('taxa_fornecedor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CPR</label>
              <input type="number" step="0.01" value={form.cpr} onChange={e => setCampo('cpr', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Unidades / Conversões</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Kg/Metro</label>
              <input type="number" step="0.01" value={form.kgmt} onChange={e => setCampo('kgmt', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Kg/Metro Total</label>
              <input type="number" step="0.01" value={form.kgmt_total} onChange={e => setCampo('kgmt_total', e.target.value)} />
            </div>
            <div className="form-group">
              <label>UNDE</label>
              <input type="number" step="0.01" value={form.unde} onChange={e => setCampo('unde', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Fiscal</legend>
          <div className="form-row">
            <div className="form-group">
              <label>IPI</label>
              <input type="number" step="0.01" value={form.ipi} onChange={e => setCampo('ipi', e.target.value)} />
            </div>
            <div className="form-group">
              <label>IPI Valor</label>
              <input type="number" step="0.01" value={form.ipi_valor} onChange={e => setCampo('ipi_valor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ST</label>
              <input type="number" step="0.01" value={form.st} onChange={e => setCampo('st', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Observação</legend>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label>Obs.</label>
              <textarea rows={3} value={form.obs} onChange={e => setCampo('obs', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar item')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}
