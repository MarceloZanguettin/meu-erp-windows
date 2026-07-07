import React, { useCallback, useEffect, useState } from 'react';
import {
  listarComprasEntrada,
  criarCompraEntrada,
  atualizarCompraEntrada,
  deletarCompraEntrada,
} from './compraEntradaService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  tipo_doc: '',
  doc: '',
  serie: '',
  cod_fornecedor: '',
  cod_compras: '',
};

/**
 * Gerencia as compras vinculadas a uma entrada (GENUS: COMPRAENTRADA) — tabela
 * de junção N:N entre `CompraGenus`/GENUS.COMPRAS (solicitação/pedido de
 * compra) e `Entrada`/GENUS.ENTRADA (nota fiscal de entrada), análoga em
 * espírito a `PedidoNota` (vínculo N:N Pedido↔Saída, módulo Vendas). Ver
 * docstring do model `CompraEntrada` em backend/models/tabelas.py.
 *
 * Uma mesma entrada pode estar vinculada a várias compras (e vice-versa) —
 * por isso é uma lista + formulário embutidos dentro do modal de edição de
 * Entrada, e não campos únicos do form principal, seguindo o mesmo padrão já
 * usado em `TabelaEntradaFrete` (fretes vinculados desta mesma janela).
 */
export default function TabelaCompraEntrada({ entradaId }) {
  const [linhas, setLinhas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [form, setForm] = useState(LINHA_VAZIA);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    if (!entradaId) return;
    setCarregando(true);
    setErro(null);
    try {
      const dados = await listarComprasEntrada(entradaId);
      setLinhas(dados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, [entradaId]);

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
        await atualizarCompraEntrada(editandoId, form);
      } else {
        await criarCompraEntrada({ ...form, entrada_id: entradaId });
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
    if (!window.confirm('Excluir este vínculo de compra?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarCompraEntrada(id);
      if (editandoId === id) limparForm();
      await carregar();
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  };

  if (!entradaId) {
    return (
      <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '12px', borderRadius: '4px' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
          Compras Vinculadas (GENUS: COMPRAENTRADA)
        </legend>
        <div className="aba-placeholder">
          Salve a entrada primeiro para gerenciar as compras vinculadas.
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '12px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Compras Vinculadas (GENUS: COMPRAENTRADA)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Doc.</th>
            <th>Série</th>
            <th>Fornecedor</th>
            <th>Cód. Compra (GENUS)</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={5} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={5} className="produto-busca-status">Nenhuma compra vinculada cadastrada para esta entrada.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.doc ?? '—'}</td>
              <td>{linha.serie ?? '—'}</td>
              <td>{linha.cod_fornecedor ?? '—'}</td>
              <td>{linha.cod_compras ?? '—'}</td>
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
          {editandoId ? `Editando compra vinculada #${editandoId}` : 'Nova compra vinculada'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Documento de entrada (esta entrada)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa</label>
              <input type="number" value={form.cod_empresa} onChange={e => setCampo('cod_empresa', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo Documento</label>
              <input type="text" maxLength={1} value={form.tipo_doc} onChange={e => setCampo('tipo_doc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Documento (Nº)</label>
              <input type="number" value={form.doc} onChange={e => setCampo('doc', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Série</label>
              <input type="text" maxLength={4} value={form.serie} onChange={e => setCampo('serie', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Fornecedor (GENUS)</label>
              <input type="number" value={form.cod_fornecedor} onChange={e => setCampo('cod_fornecedor', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Compra vinculada (GENUS.COMPRAS)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Compra (GENUS.COMPRAS.CODIGO)</label>
              <input type="number" value={form.cod_compras} onChange={e => setCampo('cod_compras', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar compra vinculada')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}
