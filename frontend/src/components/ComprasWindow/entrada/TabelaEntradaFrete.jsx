import React, { useCallback, useEffect, useState } from 'react';
import {
  listarEntradasFrete,
  criarEntradaFrete,
  atualizarEntradaFrete,
  deletarEntradaFrete,
} from './entradaFreteService.js';

const LINHA_VAZIA = {
  cod_empresa: '',
  tipo_doc: '',
  doc: '',
  serie: '',
  cod_fornecedor: '',
  cod_empresa2: '',
  tipo_doc2: '',
  doc2: '',
  serie2: '',
  cod_fornecedor2: '',
};

/**
 * Gerencia os fretes vinculados de uma entrada (GENUS: ENTRADAFRETE) — tabela
 * de vínculo que liga, por duas chaves de documento lado a lado, esta entrada
 * (nota fiscal de compra) a um segundo documento de frete. Ver docstring do
 * model `EntradaFrete` em backend/models/tabelas.py.
 *
 * Uma mesma entrada pode ter várias linhas em ENTRADAFRETE — por isso é uma
 * lista + formulário embutidos dentro do modal de edição de Entrada, e não
 * campos únicos do form principal, seguindo o mesmo padrão já usado em
 * `TabelaItemEntrada` (aba Itens de Entrada de ProductWindow).
 */
export default function TabelaEntradaFrete({ entradaId }) {
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
      const dados = await listarEntradasFrete(entradaId);
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
        await atualizarEntradaFrete(editandoId, form);
      } else {
        await criarEntradaFrete({ ...form, entrada_id: entradaId });
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
    if (!window.confirm('Excluir este frete vinculado?')) return;
    setSalvando(true);
    setErro(null);
    try {
      await deletarEntradaFrete(id);
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
          Fretes Vinculados (GENUS: ENTRADAFRETE)
        </legend>
        <div className="aba-placeholder">
          Salve a entrada primeiro para gerenciar os fretes vinculados.
        </div>
      </fieldset>
    );
  }

  return (
    <fieldset style={{ border: '1px solid #ccc', padding: '10px', marginTop: '12px', borderRadius: '4px' }}>
      <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#666', padding: '0 5px' }}>
        Fretes Vinculados (GENUS: ENTRADAFRETE)
      </legend>

      {erro && <div className="produto-busca-erro" style={{ marginBottom: 10 }}>{erro}</div>}

      <table className="produto-busca-tabela">
        <thead>
          <tr>
            <th>Doc.</th>
            <th>Série</th>
            <th>Fornecedor</th>
            <th>Doc. Frete 2</th>
            <th>Série 2</th>
            <th>Fornecedor 2</th>
            <th style={{ width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && (
            <tr><td colSpan={7} className="produto-busca-status">Carregando...</td></tr>
          )}
          {!carregando && linhas.length === 0 && (
            <tr><td colSpan={7} className="produto-busca-status">Nenhum frete vinculado cadastrado para esta entrada.</td></tr>
          )}
          {!carregando && linhas.map(linha => (
            <tr key={linha.id}>
              <td>{linha.doc ?? '—'}</td>
              <td>{linha.serie ?? '—'}</td>
              <td>{linha.cod_fornecedor ?? '—'}</td>
              <td>{linha.doc2 ?? '—'}</td>
              <td>{linha.serie2 ?? '—'}</td>
              <td>{linha.cod_fornecedor2 ?? '—'}</td>
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
          {editandoId ? `Editando frete vinculado #${editandoId}` : 'Novo frete vinculado'}
        </h4>

        <fieldset style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <legend style={{ fontSize: 12, color: '#777' }}>Entrada principal (esta entrada)</legend>
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
          <legend style={{ fontSize: 12, color: '#777' }}>Documento de frete vinculado (2º conjunto)</legend>
          <div className="form-row">
            <div className="form-group">
              <label>Cód. Empresa 2</label>
              <input type="number" value={form.cod_empresa2} onChange={e => setCampo('cod_empresa2', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Tipo Documento 2</label>
              <input type="text" maxLength={1} value={form.tipo_doc2} onChange={e => setCampo('tipo_doc2', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Documento 2 (Nº)</label>
              <input type="number" value={form.doc2} onChange={e => setCampo('doc2', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Série 2</label>
              <input type="text" maxLength={4} value={form.serie2} onChange={e => setCampo('serie2', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Cód. Fornecedor 2 (GENUS)</label>
              <input type="number" value={form.cod_fornecedor2} onChange={e => setCampo('cod_fornecedor2', e.target.value)} />
            </div>
          </div>
        </fieldset>

        <div className="form-row" style={{ justifyContent: 'flex-end' }}>
          {editandoId && (
            <button type="button" className="btn-cancel" disabled={salvando} onClick={limparForm}>Cancelar edição</button>
          )}
          <button type="button" className="btn-save" disabled={salvando} onClick={salvar}>
            {salvando ? 'Salvando...' : (editandoId ? 'Salvar alterações' : '+ Adicionar frete vinculado')}
          </button>
        </div>
      </form>
    </fieldset>
  );
}
